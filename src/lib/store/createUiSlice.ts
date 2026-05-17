// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/createUiSlice.ts
// Purpose: Interactive layout flags, edit-mode transitions, and mutation queue
// ════════════════════════════════════════════════════════════════════════════════

import { StateCreator } from 'zustand';
import { StoreState, UiSlice } from './types';

export const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (set) => ({
  isEditMode: false,
  isLoading: false,
  error: null,

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
});
