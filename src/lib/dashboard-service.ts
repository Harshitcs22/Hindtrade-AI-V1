// ════════════════════════════════════════════════════════════════════════════════
// FILE: lib/dashboard-service.ts
// Purpose: Supabase service layer for multi-tenant dashboard data fetching
// ════════════════════════════════════════════════════════════════════════════════

import { supabase, isConfigured } from './supabase';
import { Firm, FirmMetrics, Verification, FirmWithMetrics } from '@/types/supabase';

/**
 * Fetch complete firm profile by slug with metrics and verifications
 * @param slug - URL-friendly firm identifier (e.g., "himrock-exports")
 * @returns FirmWithMetrics or null if not found
 */
export async function fetchFirmBySlug(slug: string): Promise<FirmWithMetrics | null> {
  if (!isConfigured) {
    console.warn('Supabase not configured; returning mock data for slug:', slug);
    return getMockFirmData(slug);
  }

  try {
    // First attempt: try a single relational select (works when relationships exist)
    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .select(`*, metrics:firm_metrics(*), verifications(*)`)
      .eq('slug', slug)
      .single();

    if (!firmError && firm) {
      // Normalize older column names if present
      const normalized: any = { ...firm };
      if (!normalized.iec_status && normalized.iec_code) normalized.iec_status = normalized.iec_code ? 'VERIFIED' : 'PENDING';
      if (normalized.sovereign_trust_score === undefined && normalized.trust_score !== undefined) normalized.sovereign_trust_score = normalized.trust_score;
      if (!normalized.established_year && normalized.established) normalized.established_year = normalized.established;

      return {
        ...normalized,
        metrics: normalized.metrics?.[0] || normalized.metrics || undefined,
        verifications: normalized.verifications || [],
      } as FirmWithMetrics;
    }

    // If relational select fails (different schema / no foreign key), fall back to separate queries
    console.warn('Relational fetch failed, falling back to separate queries:', firmError?.message || 'no relation');

    const { data: firmRow, error: singleErr } = await supabase
      .from('firms')
      .select('*')
      .eq('slug', slug)
      .single();

    if (singleErr || !firmRow) {
      console.error('Error fetching firm (fallback):', singleErr?.message || 'not found');
      return null;
    }

    const firmId = firmRow.id as string;

    // Try fetching metrics table if it exists
    let metrics: any = null;
    try {
      const { data: m } = await supabase.from('firm_metrics').select('*').eq('firm_id', firmId).single();
      metrics = m || null;
    } catch (e) {
      // ignore if table or relation not present
      metrics = null;
    }

    // Try fetching verifications; fallback to certifications table if necessary
    let verifications: any[] = [];
    try {
      const { data: vs } = await supabase.from('verifications').select('*').eq('firm_id', firmId).order('created_at', { ascending: false });
      verifications = vs || [];
    } catch (e1) {
      try {
        const { data: certs } = await supabase.from('certifications').select('*').eq('firm_id', firmId).order('created_at', { ascending: false });
        verifications = (certs || []).map((c: any) => ({
          id: c.id,
          firm_id: c.firm_id,
          document_type: c.name || c.document_type || 'CERT',
          document_url: c.file_url || c.document_url,
          status: (c.status === 'verified' || c.status === 'active') ? 'APPROVED' : (c.status === 'pending' ? 'PENDING' : 'REJECTED'),
          reviewed_by: undefined,
          comments: c.hash,
          created_at: c.created_at,
          updated_at: c.updated_at,
        } as Verification));
      } catch (e2) {
        verifications = [];
      }
    }

    // Map legacy column names to normalized schema
    const normalizedRow: any = {
      ...firmRow,
      iec_status: (firmRow as any).iec_status || ((firmRow as any).iec_code ? 'VERIFIED' : 'PENDING'),
      sovereign_trust_score: (firmRow as any).sovereign_trust_score ?? (firmRow as any).trust_score ?? 0,
      established_year: (firmRow as any).established_year ?? (firmRow as any).established ?? null,
    };

    return {
      ...normalizedRow,
      metrics: metrics || undefined,
      verifications,
    } as FirmWithMetrics;
  } catch (err) {
    console.error('Unexpected error fetching firm:', err);
    return null;
  }
}

/**
 * Fetch firm metrics separately (useful for real-time updates)
 * @param firmId - UUID of the firm
 * @returns FirmMetrics or null
 */
export async function fetchFirmMetrics(firmId: string): Promise<FirmMetrics | null> {
  if (!isConfigured) {
    console.warn('Supabase not configured; returning mock metrics');
    return getMockMetrics(firmId);
  }

  try {
    const { data: metrics, error } = await supabase
      .from('firm_metrics')
      .select('*')
      .eq('firm_id', firmId)
      .single();

    if (error) {
      console.error('Error fetching metrics:', error.message);
      return null;
    }

    return metrics as FirmMetrics;
  } catch (err) {
    console.error('Unexpected error fetching metrics:', err);
    return null;
  }
}

/**
 * Fetch firm verifications/certifications
 * @param firmId - UUID of the firm
 * @returns Array of Verification objects
 */
export async function fetchFirmVerifications(firmId: string): Promise<Verification[]> {
  if (!isConfigured) {
    console.warn('Supabase not configured; returning mock verifications');
    return getMockVerifications(firmId);
  }

  try {
    // Try verifications table first
    const { data: verifications, error: verError } = await supabase
      .from('verifications')
      .select('*')
      .eq('firm_id', firmId)
      .order('created_at', { ascending: false });

    if (!verError && verifications) {
      return verifications as Verification[];
    }

    // Fallback to certifications table if verifications doesn't exist
    try {
      const { data: certs } = await supabase
        .from('certifications')
        .select('*')
        .eq('firm_id', firmId)
        .order('created_at', { ascending: false });

      return (certs || []).map((c: any) => ({
        id: c.id,
        firm_id: c.firm_id,
        document_type: c.name || c.document_type || 'CERT',
        document_url: c.file_url || c.document_url,
        status: (c.status === 'verified' || c.status === 'active') ? 'APPROVED' : (c.status === 'pending' ? 'PENDING' : 'REJECTED'),
        reviewed_by: undefined,
        comments: c.hash,
        created_at: c.created_at,
        updated_at: c.updated_at,
      } as Verification));
    } catch (e2) {
      return [];
    }
  } catch (err) {
    console.error('Unexpected error fetching verifications:', err);
    return [];
  }
}

/**
 * Update firm profile data
 * @param firmId - UUID of the firm
 * @param updates - Partial firm data to update
 */
export async function updateFirmProfile(
  firmId: string,
  updates: Partial<Firm>
): Promise<Firm | null> {
  if (!isConfigured) {
    console.warn('Demo mode: firm profile update simulated');
    return { id: firmId, ...updates } as any;
  }

  try {
    const { data: updated, error } = await supabase
      .from('firms')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', firmId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update firm: ${error.message}`);
    }

    return updated as Firm;
  } catch (err) {
    console.error('Error updating firm profile:', err);
    throw err;
  }
}

/**
 * Update firm metrics
 * @param firmId - UUID of the firm
 * @param updates - Partial metrics data to update
 */
export async function updateFirmMetrics(
  firmId: string,
  updates: Partial<FirmMetrics>
): Promise<FirmMetrics | null> {
  if (!isConfigured) {
    console.warn('Demo mode: metrics update simulated');
    return { firm_id: firmId, ...updates } as any;
  }

  try {
    const { data: updated, error } = await supabase
      .from('firm_metrics')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('firm_id', firmId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update metrics: ${error.message}`);
    }

    return updated as FirmMetrics;
  } catch (err) {
    console.error('Error updating metrics:', err);
    throw err;
  }
}

/**
 * Subscribe to real-time verification status updates
 * Useful for instant badge updates when admin approves documents
 */
export function subscribeToVerifications(
  firmId: string,
  onUpdate: (verification: Verification) => void
) {
  if (!isConfigured) {
    console.warn('Demo mode: real-time subscriptions not available');
    return () => {};
  }

  const subscription = supabase
    .channel(`verifications:firm_id:eq.${firmId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'verifications',
        filter: `firm_id=eq.${firmId}`,
      },
      (payload) => {
        const verification = payload.new as Verification;
        onUpdate(verification);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to real-time firm profile updates
 */
export function subscribeToFirmUpdates(
  firmId: string,
  onUpdate: (firm: Firm) => void
) {
  if (!isConfigured) {
    console.warn('Demo mode: real-time subscriptions not available');
    return () => {};
  }

  const subscription = supabase
    .channel(`firms:id:eq.${firmId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'firms',
        filter: `id=eq.${firmId}`,
      },
      (payload) => {
        const firm = payload.new as Firm;
        onUpdate(firm);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Demo mode when Supabase not configured)
// ─────────────────────────────────────────────────────────────────────────────────

function getMockFirmData(slug: string): FirmWithMetrics {
  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    slug: 'himrock-exports',
    name: 'HIMROCK EXPORTS',
    industry: 'sports goods and sportswear',
    established_year: 1980,
    moq: 1000,
    location: 'Jalandhar, Punjab, India',
    net_worth: '₹12 Cr',
    rank: 1,
    iec_status: 'VERIFIED',
    sovereign_trust_score: 85,
    identity_anchored: true,
    shipments: '120+',
    banner_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-05-17T12:00:00Z',
    created_by: 'user-123',
    metrics: getMockMetrics('550e8400-e29b-41d4-a716-446655440000'),
    verifications: getMockVerifications('550e8400-e29b-41d4-a716-446655440000'),
  };
}

function getMockMetrics(firmId: string): FirmMetrics {
  return {
    id: '660e8400-e29b-41d4-a716-446655440000',
    firm_id: firmId,
    shipment_success_rate: 98.2,
    avg_lead_time_days: 14,
    active_countries_count: 12,
    total_shipments_done: 1000,
    ai_response_time: 'Instant',
    total_revenue_usd: 2400000,
    year_over_year_growth: 18.5,
    updated_at: '2026-05-17T12:00:00Z',
  };
}

function getMockVerifications(firmId: string): Verification[] {
  return [
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      firm_id: firmId,
      document_type: 'IEC',
      document_url: undefined,
      status: 'APPROVED',
      reviewed_by: undefined,
      comments: 'Valid IEC certificate on file',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440002',
      firm_id: firmId,
      document_type: 'GSTIN',
      document_url: undefined,
      status: 'APPROVED',
      reviewed_by: undefined,
      comments: 'Valid GST registration',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ];
}
