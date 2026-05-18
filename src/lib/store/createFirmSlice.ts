// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/createFirmSlice.ts
// Purpose: Firm profile state, multi-tenant dashboard, JSONB interceptors,
//          trade network operations, and Supabase CRUD
// CRITICAL: Preserves exact unified interceptor logic in updateProfileStats
//           routing moq/customs_chapter into deep JSONB patch on domestic_presence
// ════════════════════════════════════════════════════════════════════════════════

import { StateCreator } from 'zustand';
import { ProductType } from '@/components/dashboard/ProductCard';
import { supabase, isConfigured } from '../supabase';
import {
  fetchFirmBySlug,
  updateFirmProfile,
  updateFirmMetrics,
  subscribeToVerifications,
  subscribeToFirmUpdates,
} from '../dashboard-service';
import { Firm, FirmMetrics, Verification, FirmWithMetrics } from '@/types/supabase';
import { StoreState, FirmSlice, GlobalPresenceJSONB } from './types';
import {
  normalizeGlobalPresence,
  normalizeDomesticPresence,
  parseIntegerField,
  toTextValue,
  getCorrectedHSN,
  demoFirmRegistry,
  DEFAULT_FIRM,
  DEFAULT_DOCS,
} from './helpers';

export const createFirmSlice: StateCreator<StoreState, [], [], FirmSlice> = (set, get) => ({
  // ─── MULTI-TENANT DASHBOARD (New Architecture) ───────────────────────────
  multiFirm: null,
  realtimeVerificationListener: null,
  realtimeFirmListener: null,

  fetchDashboardData: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const firmData = await fetchFirmBySlug(slug);
      if (!firmData) {
        set({ error: `Firm "${slug}" not found`, isLoading: false });
        return;
      }
      set((state) => ({
        multiFirm: firmData,
        multiVerifications: firmData.verifications || [],
        firmDetails: {
          ...state.firmDetails,
          id: firmData.id,
          slug: firmData.slug,
          name: firmData.name,
          iec_status: firmData.iec_status,
          established: firmData.established_year || new Date().getFullYear(),
          years_in_trade: new Date().getFullYear() - (firmData.established_year || 1980),
          deals_in: (firmData as any).deals_in ?? firmData.industry ?? '—',
          net_worth: firmData.net_worth || '—',
          global_rank: `TIER ${firmData.rank || 1}`,
          shipments: String(firmData.shipments || '0+'),
          location: firmData.location || 'India',
          trust_score: firmData.sovereign_trust_score || 0,
          identity_anchored: firmData.identity_anchored ?? false,
          global_presence: (firmData as any).global_presence as GlobalPresenceJSONB,
          domestic_presence: normalizeDomesticPresence((firmData as any).domestic_presence),
        },
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('fetchDashboardData error:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  updateFirmProfileData: async (updates: Partial<Firm>) => {
    const { multiFirm } = get();
    if (!multiFirm?.id) throw new Error('No firm loaded');
    set({ isLoading: true });
    try {
      const updated = await updateFirmProfile(multiFirm.id, updates);
      if (updated) {
        set((state) => ({
          multiFirm: { ...state.multiFirm, ...updated } as FirmWithMetrics,
          isLoading: false,
        }));
      }
    } catch (err: any) {
      console.error('updateFirmProfileData error:', err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateMetricsData: async (updates: Partial<FirmMetrics>) => {
    const { multiFirm } = get();
    if (!multiFirm?.id || !multiFirm?.metrics?.id) throw new Error('No metrics found');
    try {
      const updated = await updateFirmMetrics(multiFirm.id, updates);
      if (updated) {
        set((state) => ({
          multiFirm: { ...state.multiFirm, metrics: updated } as FirmWithMetrics,
        }));
      }
    } catch (err: any) {
      console.error('updateMetricsData error:', err);
      throw err;
    }
  },

  setUpRealtimeListeners: () => {
    const { multiFirm } = get();
    if (!multiFirm?.id) return;
    const verificationUnsubscribe = subscribeToVerifications(multiFirm.id, (verification) => {
      set((state) => ({
        multiVerifications: state.multiVerifications.map(v =>
          v.id === verification.id ? verification : v
        ),
      }));
    });
    const firmUnsubscribe = subscribeToFirmUpdates(multiFirm.id, (updatedFirm) => {
      set((state) => ({
        multiFirm: { ...state.multiFirm, ...updatedFirm } as FirmWithMetrics,
      }));
    });
    set({
      realtimeVerificationListener: verificationUnsubscribe,
      realtimeFirmListener: firmUnsubscribe,
    });
  },

  tearDownRealtimeListeners: () => {
    const { realtimeVerificationListener, realtimeFirmListener } = get();
    if (realtimeVerificationListener) realtimeVerificationListener();
    if (realtimeFirmListener) realtimeFirmListener();
    set({ realtimeVerificationListener: null, realtimeFirmListener: null });
  },

  // ─── FIRM DETAILS (backward-compatible) ──────────────────────────────────
  firmDetails: DEFAULT_FIRM,

  updateFirmDetails: (updates) =>
    set((state) => ({ firmDetails: { ...state.firmDetails, ...updates } })),

  // ─── TRADE NETWORK ──────────────────────────────────────────────────────
  updateTradeNetwork: async (slug: string, type: 'global' | 'domestic', data: any) => {
    set({ isLoading: true });
    const patch = type === 'global'
      ? { global_presence: normalizeGlobalPresence(data) }
      : { domestic_presence: normalizeDomesticPresence(data) };

    if (!isConfigured) {
      const entry = demoFirmRegistry.get(slug);
      if (entry) {
        entry.firmDetails = { ...entry.firmDetails, ...patch };
        set({ firmDetails: entry.firmDetails, isLoading: false });
      }
      return;
    }

    try {
      const { error } = await supabase.from('firms').update(patch).eq('slug', slug);
      if (error) throw error;
      set((state) => ({ firmDetails: { ...state.firmDetails, ...patch }, isLoading: false }));
    } catch (err: any) {
      console.error('updateTradeNetwork error:', err?.message || err || 'Unknown Error');
      set({ error: err?.message || 'Database update failed', isLoading: false });
    }
  },

  // ─── SUPABASE: FETCH FIRM BY SLUG ────────────────────────────────────────
  fetchFirmData: async (slug: string) => {
    set({ isLoading: true, error: null });

    // ── DEMO MODE ─────────────────────────────────────────────────────────
    if (!isConfigured) {
      await new Promise((r) => setTimeout(r, 600));
      const demoEntry = demoFirmRegistry.get(slug);
      if (demoEntry) {
        const trustScore = demoEntry.documents.filter(
          (d) => d.status === 'VERIFIED' || d.status === 'ACTIVE'
        ).length * 25;
        set({ ...demoEntry, trustScore, isLoading: false, error: null });
      } else {
        set({ error: `Firm "${slug}" not found in demo registry.`, isLoading: false });
      }
      return;
    }

    // ── LIVE MODE ─────────────────────────────────────────────────────────
    try {
      const { data: firm, error: firmError } = await supabase
        .from('firms').select('*').eq('slug', slug).single();
      if (firmError) throw firmError;
      if (!firm) throw new Error('Firm not found');

      const { data: products, error: prodError } = await supabase
        .from('products').select('*').eq('firm_id', firm.id);
      if (prodError) throw prodError;

      const { data: certs, error: certError } = await supabase
        .from('certifications').select('*').eq('firm_id', firm.id);
      if (certError) throw certError;

      const mappedFirm = {
        id: firm.id,
        slug: firm.slug,
        name: firm.name || slug,
        established: firm.established ?? new Date().getFullYear(),
        iec_status: firm.iec_status || 'PENDING',
        years_in_trade: firm.years_in_trade ?? 0,
        global_rank: firm.rank ?? '—',
        deals_in: (firm as any).deals_in ?? firm.industry ?? '—',
        location: firm.location ?? '—',
        shipments: String(firm.shipments ?? '0'),
        net_worth: firm.net_worth ?? '—',
        trust_score: firm.sovereign_trust_score ?? 0,
        identity_anchored: firm.identity_anchored ?? false,
        global_presence: normalizeGlobalPresence(firm.global_presence ?? DEFAULT_FIRM.global_presence),
        domestic_presence: normalizeDomesticPresence(firm.domestic_presence ?? DEFAULT_FIRM.domestic_presence),
      };

      const mappedInventory: ProductType[] = (products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        hsn: getCorrectedHSN(p.name, p.hsn_code || ''),
        image: p.image_url || '/demo/placeholder.png',
        materials: Array.isArray(p.material) ? p.material : (p.material ? [p.material] : []),
      }));

      const mappedDocs = (certs || []).map((c: any) => ({
        id: c.id, name: c.name, status: c.status || 'PENDING',
        hash: c.hash || 'SHA-256', file_url: c.file_url,
      }));

      const newTrustScore = mappedDocs.length > 0
        ? mappedDocs.filter(d => d.status === 'VERIFIED' || d.status === 'ACTIVE').length * 25
        : firm.trust_score ?? 0;

      set({
        firmDetails: mappedFirm,
        inventory: mappedInventory,
        documents: mappedDocs.length > 0 ? mappedDocs : [],
        trustScore: newTrustScore,
        isLoading: false,
      });
    } catch (err: any) {
        // Log full error details for easier debugging (handles Error objects and generic payloads)
        try {
          const errMsg = err?.message ?? (typeof err === 'string' ? err : JSON.stringify(err, Object.getOwnPropertyNames(err)));
          console.error('fetchFirmData error:', err, '\nmessage:', errMsg, '\nstack:', err?.stack);
          set({ error: String(errMsg), isLoading: false });
        } catch (logErr) {
          console.error('fetchFirmData error (unable to stringify):', err, logErr);
          set({ error: 'Unknown error during fetchFirmData', isLoading: false });
        }
    }
  },

  // ─── SUPABASE: CREATE FIRM ───────────────────────────────────────────────
  createFirm: async (name: string) => {
    set({ isLoading: true, error: null });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!isConfigured) {
      await new Promise((r) => setTimeout(r, 800));
      if (demoFirmRegistry.has(slug)) {
        set({ error: 'A firm with that name already exists in this session.', isLoading: false });
        return null;
      }
      const newFirmDetails = {
        id: `demo-${crypto.randomUUID()}`, slug, name,
        established: new Date().getFullYear(), iec_status: 'PENDING',
        years_in_trade: 0, global_rank: '—', deals_in: '—', location: '—',
        shipments: '0', net_worth: '—', trust_score: 0,
        global_presence: {}, domestic_presence: { pan_india: false, isPanIndia: false, states: [] as string[], active_states: [] as string[] },
      };
      demoFirmRegistry.set(slug, { firmDetails: newFirmDetails, inventory: [], documents: [] });
      set({ firmDetails: newFirmDetails, inventory: [], documents: [], trustScore: 0, isLoading: false });
      console.info(`[HindTrade DEMO] Firm "${name}" created locally at /dashboard/${slug}`);
      return slug;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('firms')
        .insert([{ name, slug, user_id: user?.id ?? null, trust_score: 0, established: new Date().getFullYear() }])
        .select().single();
      if (error) throw error;
      set({
        firmDetails: {
          id: data.id, slug: data.slug, name: data.name,
          established: data.established ?? new Date().getFullYear(),
          iec_status: 'PENDING', years_in_trade: 0, global_rank: '—',
          deals_in: '—', location: '—', shipments: '0', net_worth: '—', trust_score: 0,
          global_presence: {}, domestic_presence: { pan_india: false, isPanIndia: false, states: [], active_states: [] },
        },
        inventory: [], documents: [], isLoading: false,
      });
      return slug;
    } catch (err: any) {
      console.error('createFirm error:', err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  // ─── CRITICAL: updateProfileStats with JSONB interceptor ─────────────────
  // Preserves the exact unified interceptor logic: moq and customs_chapter
  // are routed into the deep JSONB patch on domestic_presence, NOT root columns.
  // The deals_in fallback chain is preserved exactly.
  updateProfileStats: async (fields) => {
    // Fresh read from current Zustand state to prevent closure race conditions
    const current = get().firmDetails;
    const slug = current.slug;
    if (!slug) {
      set({ error: 'Cannot update profile before the firm slug is available.' });
      return;
    }

    const patch: Record<string, unknown> = {};
    const optimisticPatch: Record<string, unknown> = {};

    // NESTED JSONB HANDLERS: Intercept moq, customs_chapter, factory_area, skilled_workers, and monthly_capacity
    if (
      (fields as any).moq !== undefined ||
      (fields as any).customs_chapter !== undefined ||
      (fields as any).factory_area !== undefined ||
      (fields as any).skilled_workers !== undefined ||
      (fields as any).monthly_capacity !== undefined
    ) {
      // Dynamic active sequential state lookup
      const currentDomestic = get().firmDetails?.domestic_presence || { states: [], isPanIndia: false };
      const updatedDomestic = {
        ...currentDomestic,
        ...((fields as any).moq !== undefined ? { moq: toTextValue((fields as any).moq) } : {}),
        ...((fields as any).customs_chapter !== undefined ? { customs_chapter: toTextValue((fields as any).customs_chapter) } : {}),
        ...((fields as any).factory_area !== undefined ? { factory_area: toTextValue((fields as any).factory_area) } : {}),
        ...((fields as any).skilled_workers !== undefined ? { skilled_workers: toTextValue((fields as any).skilled_workers) } : {}),
        ...((fields as any).monthly_capacity !== undefined ? { monthly_capacity: toTextValue((fields as any).monthly_capacity) } : {})
      };
      patch.domestic_presence = updatedDomestic;
      optimisticPatch.domestic_presence = updatedDomestic;
    }

    // STRICT SCHEMA BINDING
    if (fields.name !== undefined) { patch.name = toTextValue(fields.name); optimisticPatch.name = patch.name; }
    if (fields.shipments !== undefined) { patch.shipments = toTextValue(fields.shipments); optimisticPatch.shipments = patch.shipments; }
    if (fields.location !== undefined) { patch.location = toTextValue(fields.location); optimisticPatch.location = patch.location; }
    if (fields.deals_in !== undefined) { patch.deals_in = toTextValue(fields.deals_in); optimisticPatch.deals_in = patch.deals_in; }
    if (fields.global_rank !== undefined) { patch.rank = toTextValue(fields.global_rank); optimisticPatch.global_rank = patch.rank; }
    if (fields.net_worth !== undefined) { patch.net_worth = toTextValue(fields.net_worth); optimisticPatch.net_worth = patch.net_worth; }
    if (fields.iec_status !== undefined) { patch.iec_status = toTextValue(fields.iec_status); optimisticPatch.iec_status = patch.iec_status; }
    if (fields.identity_anchored !== undefined) { patch.identity_anchored = Boolean(fields.identity_anchored); optimisticPatch.identity_anchored = patch.identity_anchored; }
    if (fields.established !== undefined) { const v = parseIntegerField(fields.established, 'Established year'); patch.established_year = v; optimisticPatch.established = v; }
    if (fields.years_in_trade !== undefined) { const v = parseIntegerField(fields.years_in_trade, 'Years in trade'); patch.years_in_trade = v; optimisticPatch.years_in_trade = v; }
    if (fields.trust_score !== undefined) { const v = parseIntegerField(fields.trust_score, 'Trust score'); patch.sovereign_trust_score = v; optimisticPatch.trust_score = v; }
    if (fields.global_presence !== undefined) { const v = normalizeGlobalPresence(fields.global_presence as any); patch.global_presence = v; optimisticPatch.global_presence = v; }
    if (fields.domestic_presence !== undefined) { const v = normalizeDomesticPresence(fields.domestic_presence as any); patch.domestic_presence = v; optimisticPatch.domestic_presence = v; }

    if (Object.keys(patch).length === 0) return;

    // Atomic functional merge set to prevent parallel overlapping states from overwriting updates
    set((state) => {
      const mergedFirmDetails = {
        ...state.firmDetails,
        ...optimisticPatch,
      };
      
      // Ensure domestic presence maps are deeply merged on top of latest state
      if (optimisticPatch.domestic_presence) {
        mergedFirmDetails.domestic_presence = {
          ...(state.firmDetails.domestic_presence || {}),
          ...(optimisticPatch.domestic_presence as any),
        };
      }
      
      return {
        firmDetails: mergedFirmDetails,
        error: null,
      };
    });

    try {
      const { error } = await supabase.from('firms').update(patch).eq('slug', slug);
      if (error) throw error;
    } catch (err: any) {
      console.error('updateProfileStats error:', err?.message || err || 'Unknown Error');
      // Revert to stable snapshot on failure
      set({ firmDetails: current, error: err?.message || 'Profile update failed' });
      throw err;
    }
  },

  updateTradeMatrix: async (type: 'global' | 'domestic', payload: any) => {
    const current = get().firmDetails;
    const slug = current.slug;
    if (!slug) { set({ error: 'Cannot update network before the firm slug is available.' }); return; }

    const patch = type === 'global'
      ? { global_presence: normalizeGlobalPresence(payload) }
      : { domestic_presence: normalizeDomesticPresence(payload) };

    set({ firmDetails: { ...current, ...patch }, error: null });

    try {
      const { error } = await supabase.from('firms').update(patch).eq('slug', slug);
      if (error) throw error;
    } catch (err: any) {
      console.error('updateTradeMatrix error:', err?.message || err || 'Unknown Error');
      set({ firmDetails: current, error: err?.message || 'Network update failed' });
      throw err;
    }
  },
});
