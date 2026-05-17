// ════════════════════════════════════════════════════════════════════════════════
// FILE: lib/store.ts — BACKWARD-COMPATIBLE RE-EXPORT SHIM
// Purpose: Preserves all existing import paths. Every component that imports
//          from '@/lib/store' gets the same useProductStore and types without
//          any import path changes required.
//
// The actual implementation lives in src/lib/store/ (sliced architecture).
// ════════════════════════════════════════════════════════════════════════════════

export {
  useProductStore,
} from './store/index';

export type {
  StoreState,
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
} from './store/index';
