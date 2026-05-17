// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/types.ts
// Purpose: Consolidated type definitions for all Zustand slices
// ════════════════════════════════════════════════════════════════════════════════

import { ProductType } from '@/components/dashboard/ProductCard';
import { Firm, FirmMetrics, Verification, FirmWithMetrics } from '@/types/supabase';

// ─── NETWORK TYPES ──────────────────────────────────────────────────────────────

export type NetworkStatus = 'active' | 'growing' | 'target';

export interface GlobalPresenceNode {
  code?: string;
  countryCode?: string;
  id?: string;
  name?: string;
  status: NetworkStatus | string;
  cx?: number;
  cy?: number;
  flag?: string;
  exports?: string;
  volume?: string;
  growth?: string;
  shipments?: number;
}

export type GlobalPresenceJSONB = Record<string, GlobalPresenceNode>;

export interface DomesticPresenceJSONB {
  pan_india?: boolean;
  isPanIndia?: boolean;
  states?: string[];
  active_states?: string[];
  moq?: string;
  customs_chapter?: string;
  factory_area?: string;
  skilled_workers?: string;
  monthly_capacity?: string;
}

// ─── FIRM DETAILS ───────────────────────────────────────────────────────────────
// Maps EXACTLY to public.firms schema columns (no camelCase deviation)

export interface FirmDetails {
  id?: string;
  slug?: string;
  // Core firm identity (exact schema column names)
  name: string;
  deals_in: string;
  established: number;
  years_in_trade: number;
  global_rank: string;
  shipments: string;
  net_worth: string;
  location: string;
  // Trust & compliance pillars
  trust_score: number;
  iec_status: string;
  identity_anchored?: boolean;
  global_presence?: GlobalPresenceJSONB;
  domestic_presence?: DomesticPresenceJSONB;
  products?: ProductType[];
  factory_area?: string;
  skilled_workers?: string;
  monthly_capacity?: string;
}

// ─── DOCUMENT TYPE ──────────────────────────────────────────────────────────────

export interface DocumentType {
  id: string;
  name: string;
  status: string;
  hash: string;
  file_url?: string;
}

// ─── SLICE STATE INTERFACES ─────────────────────────────────────────────────────

export interface UiSlice {
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  toggleEditMode: () => void;
}

export interface FirmSlice {
  // Multi-tenant dashboard state
  multiFirm: FirmWithMetrics | null;
  realtimeVerificationListener: (() => void) | null;
  realtimeFirmListener: (() => void) | null;
  fetchDashboardData: (slug: string) => Promise<void>;
  updateFirmProfileData: (updates: Partial<Firm>) => Promise<void>;
  updateMetricsData: (updates: Partial<FirmMetrics>) => Promise<void>;
  setUpRealtimeListeners: () => void;
  tearDownRealtimeListeners: () => void;

  // Firm details (backward-compatible surface)
  firmDetails: FirmDetails;
  updateFirmDetails: (updates: Partial<FirmDetails>) => void;

  // Trade network operations
  updateTradeNetwork: (slug: string, type: 'global' | 'domestic', data: any) => Promise<void>;

  // Supabase async actions
  fetchFirmData: (slug: string) => Promise<void>;
  createFirm: (name: string) => Promise<string | null>;
  updateProfileStats: (fields: Partial<FirmDetails>) => Promise<void>;
  updateTradeMatrix: (type: 'global' | 'domestic', payload: any) => Promise<void>;
}

export interface ProductSlice {
  inventory: ProductType[];
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  updateProduct: (id: string, updates: Partial<ProductType>) => void;
  deleteProduct: (productId: string) => Promise<void>;
  addProductToInventory: (productPayload: any) => Promise<void>;
}

export interface VaultSlice {
  documents: DocumentType[];
  trustScore: number;
  multiVerifications: Verification[];
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
}

// ─── COMBINED STORE STATE ───────────────────────────────────────────────────────

export type StoreState = UiSlice & FirmSlice & ProductSlice & VaultSlice;
