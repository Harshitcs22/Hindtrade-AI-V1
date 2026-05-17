// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/index.ts — THE CENTRAL SYNAPSE COORDINATOR
// Purpose: Assembles all isolated slice elements using Zustand's multi-slice
//          parameter spreader notation pattern. This is the single source of
//          truth for the composed store.
// ════════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { StoreState } from './types';
import { createUiSlice } from './createUiSlice';
import { createFirmSlice } from './createFirmSlice';
import { createProductSlice } from './createProductSlice';
import { createVaultSlice } from './createVaultSlice';

// ─── COMPOSED STORE ─────────────────────────────────────────────────────────
// All slices are spread into a single Zustand store using the StateCreator
// combiner pattern. External consumers import useProductStore with ZERO
// breaking changes — the API surface is identical to the monolith.

export const useProductStore = create<StoreState>()((...a) => ({
  ...createUiSlice(...a),
  ...createFirmSlice(...a),
  ...createProductSlice(...a),
  ...createVaultSlice(...a),
}));

// ─── RE-EXPORTS ─────────────────────────────────────────────────────────────
// Expose all types so consumers can import from '@/lib/store' directly.
export type { StoreState } from './types';
export type {
  FirmDetails,
  DocumentType,
  GlobalPresenceJSONB,
  DomesticPresenceJSONB,
  NetworkStatus,
  GlobalPresenceNode,
  UiSlice,
  FirmSlice,
  ProductSlice,
  VaultSlice,
} from './types';
