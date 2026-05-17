// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/createVaultSlice.ts
// Purpose: Compliance certificates, verification arrays, and trust telemetry
// ════════════════════════════════════════════════════════════════════════════════

import { StateCreator } from 'zustand';
import { StoreState, VaultSlice } from './types';
import { DEFAULT_DOCS } from './helpers';

export const createVaultSlice: StateCreator<StoreState, [], [], VaultSlice> = (set) => ({
  documents: DEFAULT_DOCS,
  trustScore: DEFAULT_DOCS.filter(d => d.status === "VERIFIED" || d.status === "ACTIVE").length * 25,
  multiVerifications: [],

  updateDocument: (id, updates) =>
    set((state) => {
      const newDocs = state.documents.map(d => d.id === id ? { ...d, ...updates } : d);
      const newScore = newDocs.filter(d => d.status === "VERIFIED" || d.status === "ACTIVE").length * 25;
      return { documents: newDocs, trustScore: newScore };
    }),
});
