// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/createProductSlice.ts
// Purpose: Product inventory transactional operations and JSONB serialization
// ════════════════════════════════════════════════════════════════════════════════

import { StateCreator } from 'zustand';
import { ProductType } from '@/components/dashboard/ProductCard';
import { supabase, isConfigured } from '../supabase';
import { StoreState, ProductSlice } from './types';
import { getCorrectedHSN, DEFAULT_INVENTORY } from './helpers';

export const createProductSlice: StateCreator<StoreState, [], [], ProductSlice> = (set, get) => ({
  inventory: DEFAULT_INVENTORY,
  activeProductId: null,
  setActiveProduct: (id) => set({ activeProductId: id }),

  updateProduct: (id, updates) =>
    set((state) => {
      if (updates.name || updates.hsn) {
        const current = state.inventory.find(p => p.id === id);
        const resolvedName = updates.name || current?.name || '';
        updates.hsn = getCorrectedHSN(resolvedName, updates.hsn || current?.hsn || '');
      }
      return {
        inventory: state.inventory.map(p => p.id === id ? { ...p, ...updates } : p)
      };
    }),

  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });

    if (!isConfigured) {
      set((state) => ({
        inventory: state.inventory.filter(p => p.id !== productId),
        isLoading: false
      }));
      return;
    }

    try {
      const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', productId);

      if (error) throw error;
      
      if (count === 0) {
        console.warn('No product found with ID:', productId);
        if (productId.startsWith('prod-')) {
          set((state) => ({
            inventory: state.inventory.filter(p => p.id !== productId),
            isLoading: false
          }));
          return;
        }
        throw new Error('Product not found in database or RLS policy blocked deletion.');
      }

      set((state) => ({
        inventory: state.inventory.filter(p => p.id !== productId),
        isLoading: false
      }));
    } catch (err: any) {
      const msg = err?.message || 'Deletion failed';
      console.error('deleteProduct error:', msg);
      alert(`DECOMMISSION ERROR: ${msg}\n\nThis usually happens if the Supabase RLS policy is missing or if you are trying to delete a locked system asset.`);
      set({ error: msg, isLoading: false });
    }
  },

  addProductToInventory: async (productPayload: any) => {
    const { firmDetails } = get();

    if (!firmDetails?.id) {
      throw new Error('Firm configuration missing; product ingestion blocked.');
    }

    if (!isConfigured) {
      await new Promise((r) => setTimeout(r, 800));
      const newProduct: ProductType = {
        id: `demo-prod-${Date.now()}`,
        name: productPayload.name || 'Untitled Product',
        hsn: productPayload.hsn_code || '9506.99.99',
        image: productPayload.image_url || 'https://images.unsplash.com/photo-1486401899868-87e8d3931e5e?w=800&q=80',
        materials: Array.isArray(productPayload.material) ? productPayload.material : [productPayload.material || 'Unspecified'],
      };
      set((state) => ({
        inventory: [...state.inventory, newProduct],
        firmDetails: {
          ...state.firmDetails,
          products: [...(state.firmDetails.products || []), newProduct],
        },
      }));
      return;
    }

    try {
      const insertPayload = {
        firm_id: firmDetails.id,
        name: productPayload.name?.trim() || 'Untitled',
        hsn_code: productPayload.hsn_code || '9506.99.99',
        material: Array.isArray(productPayload.material)
          ? productPayload.material.filter((m: string) => m?.trim())
          : [productPayload.material || 'Unspecified'],
        journey: Array.isArray(productPayload.journey)
          ? productPayload.journey.map((step: string, idx: number) => ({
              step: idx + 1,
              title: step?.trim() || `Step ${idx + 1}`,
              location: 'Jalandhar, IN',
              timestamp: new Date().toISOString(),
            }))
          : [],
        image_url: productPayload.image_url?.trim() || null,
        audit_trace: productPayload.audit_trace || 'Product ingested via compliance modal',
      };

      const { data: insertedRow, error: insertError } = await supabase
        .from('products')
        .insert([insertPayload])
        .select();

      if (insertError) {
        console.error('RLS or database error:', insertError.message || insertError);
        throw new Error(`Database policy rejection: ${insertError.message}`);
      }

      if (insertedRow && insertedRow.length > 0) {
        const dbRow = insertedRow[0];
        const optimisticProduct: ProductType = {
          id: dbRow.id,
          name: dbRow.name,
          hsn: dbRow.hsn_code,
          image: dbRow.image_url || 'https://images.unsplash.com/photo-1486401899868-87e8d3931e5e?w=800&q=80',
          materials: dbRow.material || [],
        };
        set((state) => ({
          inventory: [...state.inventory, optimisticProduct],
          firmDetails: {
            ...state.firmDetails,
            products: [...(state.firmDetails.products || []), optimisticProduct],
          },
        }));
      }
    } catch (err: any) {
      const errMsg = err?.message || err?.toString() || 'Failed to add product to inventory';
      console.error('addProductToInventory error:', errMsg);
      throw new Error(errMsg);
    }
  },
});
