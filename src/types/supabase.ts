// ════════════════════════════════════════════════════════════════════════════════
// FILE: types/supabase.ts
// Purpose: TypeScript interfaces for multi-tenant dashboard schema
// ════════════════════════════════════════════════════════════════════════════════

export type IECStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'REJECTED';
export type VerificationStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING';

// ─────────────────────────────────────────────────────────────────────────────────
// Firm: Core firm identity and metadata
// ─────────────────────────────────────────────────────────────────────────────────
export interface Firm {
  id: string;
  slug: string;
  name: string;
  industry?: string;
  established_year?: number;
  moq?: number;
  location?: string;
  net_worth?: string;
  rank?: number;
  iec_status: IECStatus;
  sovereign_trust_score: number;
  identity_anchored: boolean;
  banner_url?: string;
  shipments?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// FirmMetrics: Performance KPIs and rolling metrics for the metrics bar
// ─────────────────────────────────────────────────────────────────────────────────
export interface FirmMetrics {
  id: string;
  firm_id: string;
  shipment_success_rate: number;
  avg_lead_time_days: number;
  active_countries_count: number;
  total_shipments_done: number;
  ai_response_time: string;
  total_revenue_usd?: number;
  year_over_year_growth?: number;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Verification: Human-In-The-Loop verification pipeline
// ─────────────────────────────────────────────────────────────────────────────────
export interface Verification {
  id: string;
  firm_id: string;
  document_type: string;
  document_url?: string;
  status: VerificationStatus;
  reviewed_by?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Extended Firm with related metrics and verifications
// ─────────────────────────────────────────────────────────────────────────────────
export interface FirmWithMetrics extends Firm {
  metrics?: FirmMetrics;
  verifications?: Verification[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// Dashboard state shape for React Context/Zustand
// ─────────────────────────────────────────────────────────────────────────────────
export interface DashboardState {
  firm: FirmWithMetrics | null;
  metrics: FirmMetrics | null;
  verifications: Verification[];
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Edit payload for updating firm data
// ─────────────────────────────────────────────────────────────────────────────────
export interface FirmUpdatePayload {
  name?: string;
  industry?: string;
  moq?: number;
  location?: string;
  net_worth?: string;
  rank?: number;
  banner_url?: string;
}
