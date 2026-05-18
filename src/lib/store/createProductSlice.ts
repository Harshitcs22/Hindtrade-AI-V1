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
  products: [],
  activeProductId: null,
  setActiveProduct: (id) => set({ activeProductId: id }),

  fetchProducts: async (firmId: string) => {
    if (!firmId) return;
    set({ isLoading: true });
    try {
      // If Supabase is not configured, try to load demo data
      if (!isConfigured) {
        const { demoFirmRegistry } = require('./helpers');
        const firmDetails = get().firmDetails;
        
        // Try to find the demo entry by slug
        if (demoFirmRegistry && demoFirmRegistry.size > 0 && firmDetails?.slug) {
          const demoEntry = demoFirmRegistry.get(firmDetails.slug);
          if (demoEntry && demoEntry.inventory && demoEntry.inventory.length > 0) {
            set({ 
              inventory: demoEntry.inventory,
              products: demoEntry.inventory
            });
            set({ isLoading: false });
            return;
          }
        }
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('firm_id', firmId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mappedProducts = data.map((dbRow: any) => ({
          id: dbRow.id,
          name: dbRow.name,
          hsn: dbRow.hsn_code,
          image: dbRow.image_url || 'https://images.unsplash.com/photo-1486401899868-87e8d3931e5e?w=800&q=80',
          materials: dbRow.material || [],
          audit_trace: dbRow.audit_trace,
          trade_terms: dbRow.trade_terms
        }));
        set({ 
          inventory: mappedProducts,
          products: data
        });
      } else if (error) {
        console.error("fetchProducts error:", error);
        // Fallback to demo data if query fails
        const { demoFirmRegistry } = require('./helpers');
        const firmDetails = get().firmDetails;
        if (demoFirmRegistry && demoFirmRegistry.size > 0 && firmDetails?.slug) {
          const demoEntry = demoFirmRegistry.get(firmDetails.slug);
          if (demoEntry && demoEntry.inventory) {
            set({ 
              inventory: demoEntry.inventory,
              products: demoEntry.inventory
            });
          }
        }
      }
    } catch (err) {
      console.error("fetchProducts error:", err);
      // Fallback to demo data on any error
      const { demoFirmRegistry } = require('./helpers');
      const firmDetails = get().firmDetails;
      if (demoFirmRegistry && demoFirmRegistry.size > 0 && firmDetails?.slug) {
        const demoEntry = demoFirmRegistry.get(firmDetails.slug);
        if (demoEntry && demoEntry.inventory) {
          set({ 
            inventory: demoEntry.inventory,
            products: demoEntry.inventory
          });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (productId: string, updatedFields: any) => {
    if (!productId) return;
    set({ isLoading: true, error: null });

    // Instantly sync frontend array cache
    set((state: any) => {
      const current = state.inventory.find((p: any) => p.id === productId);
      const resolvedName = updatedFields.name !== undefined ? updatedFields.name : (current?.name || '');
      const formattedHsn = updatedFields.hsn_code || updatedFields.hsn || current?.hsn || '';
      const correctedHsn = getCorrectedHSN(resolvedName, formattedHsn);
      
      const newProduct = {
        ...current,
        name: resolvedName,
        hsn: correctedHsn,
        image: updatedFields.image_url || updatedFields.image || current?.image,
        materials: updatedFields.material || updatedFields.materials || current?.materials || [],
        audit_trace: updatedFields.audit_trace || current?.audit_trace,
        trade_terms: updatedFields.trade_terms || current?.trade_terms
      };
      
      return {
        inventory: state.inventory.map((p: any) => p.id === productId ? newProduct : p)
      };
    });

    if (!isConfigured) {
      set({ isLoading: false });
      return;
    }

    try {
      const payload: any = {};
      if (updatedFields.name !== undefined) payload.name = updatedFields.name;
      if (updatedFields.hsn_code !== undefined) payload.hsn_code = updatedFields.hsn_code;
      if (updatedFields.hsn !== undefined && updatedFields.hsn_code === undefined) payload.hsn_code = updatedFields.hsn;
      if (updatedFields.material !== undefined) payload.material = updatedFields.material;
      if (updatedFields.journey !== undefined) payload.journey = updatedFields.journey;
      if (updatedFields.image_url !== undefined) payload.image_url = updatedFields.image_url;
      if (updatedFields.image !== undefined && updatedFields.image_url === undefined) payload.image_url = updatedFields.image;
      if (updatedFields.audit_trace !== undefined) payload.audit_trace = updatedFields.audit_trace;
      if (updatedFields.trade_terms !== undefined) payload.trade_terms = updatedFields.trade_terms;

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const dbRow = data[0];
        set((state: any) => {
          const optimisticProduct: ProductType = {
            id: dbRow.id,
            name: dbRow.name,
            hsn: dbRow.hsn_code,
            image: dbRow.image_url || 'https://images.unsplash.com/photo-1486401899868-87e8d3931e5e?w=800&q=80',
            materials: dbRow.material || [],
            audit_trace: dbRow.audit_trace,
            trade_terms: dbRow.trade_terms
          };
          return {
            inventory: state.inventory.map((p: any) => p.id === productId ? optimisticProduct : p),
            products: state.products?.map((p: any) => p.id === productId ? dbRow : p) || []
          };
        });
      }
    } catch (err: any) {
      console.error("updateProduct error:", err.message);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (productId: string) => {
    if (!productId) {
      console.error("Aborting deletion: Execution context missing valid target UUID token.");
      return;
    }
    set({ isLoading: true, error: null });

    if (!isConfigured) {
      set((state) => ({
        inventory: state.inventory.filter(p => p.id !== productId),
        products: (state.products || []).filter((p: any) => p.id !== productId),
        isLoading: false
      }));
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      set((state: any) => ({
        inventory: state.inventory.filter((p: any) => p.id !== productId),
        products: (state.products || []).filter((p: any) => p.id !== productId),
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
        trade_terms: productPayload.trade_terms,
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
      const safeTrim = (val: any): string => {
        if (typeof val === 'string') return val.trim();
        if (val && typeof val === 'object' && 'name' in val) return typeof val.name === 'string' ? val.name.trim() : '';
        if (val && typeof val === 'object' && 'title' in val) return typeof val.title === 'string' ? val.title.trim() : '';
        return '';
      };

      const payloadMaterial = Array.isArray(productPayload.material) 
        ? productPayload.material.map((m: any) => {
            if (typeof m === 'string') return { index: 0, name: m.trim(), category: 'raw_material' };
            if (m && typeof m === 'object') {
              return {
                ...m,
                name: typeof m.name === 'string' ? m.name.trim() : (m.name || '')
              };
            }
            return m;
          })
        : [];

      const payloadJourney = Array.isArray(productPayload.journey)
        ? productPayload.journey.map((j: any, idx: number) => {
            if (typeof j === 'string') {
              return {
                step: idx + 1,
                title: j.trim(),
                location: 'Jalandhar, IN',
                timestamp: new Date().toISOString(),
              };
            }
            if (j && typeof j === 'object') {
              return {
                step: typeof j.step === 'number' ? j.step : (idx + 1),
                title: typeof j.title === 'string' ? j.title.trim() : (j.title || `Step ${idx + 1}`),
                location: typeof j.location === 'string' ? j.location : 'Jalandhar, IN',
                timestamp: typeof j.timestamp === 'string' ? j.timestamp : new Date().toISOString(),
              };
            }
            return j;
          })
        : [];

      const insertPayload = {
        firm_id: firmDetails.id,
        name: typeof productPayload.name === 'string' ? productPayload.name.trim() : 'Untitled',
        hsn_code: productPayload.hsn_code || '9506.99.99',
        material: payloadMaterial,
        journey: payloadJourney,
        image_url: typeof productPayload.image_url === 'string' ? productPayload.image_url.trim() : null,
        audit_trace: productPayload.audit_trace || 'Product ingested via compliance modal',
        trade_terms: productPayload.trade_terms
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
          trade_terms: dbRow.trade_terms
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
