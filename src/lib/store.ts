import { create } from 'zustand';
import { ProductType } from '@/components/dashboard/ProductCard';
import { supabase, isConfigured } from './supabase';

// ─── IN-MEMORY DEMO REGISTRY ─────────────────────────────────────────────────
// Used when isConfigured is false (no Supabase credentials).
// Persists for the lifetime of the browser session via module scope.
const demoFirmRegistry = new Map<string, { firmDetails: FirmDetails; inventory: ProductType[]; documents: DocumentType[] }>();

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export interface FirmDetails {
  id?: string;
  slug?: string;
  name: string;
  established: number;
  iecStatus: string;
  yearsInTrade: number;
  globalRank: string;
  dealsIn: string;
  markets: string;
  shipments: string;
  netWorth: string;
  udin: string;
  global_presence?: any[]; // [{id, name, status, cx, cy, flag, exports, volume, growth}]
  domestic_presence?: {
    isPanIndia: boolean;
    states?: string[];
  };
}

export interface DocumentType {
  id: string;
  name: string;
  status: string;
  hash: string;
  file_url?: string;
}

interface ComplianceState {
  // Global State
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  toggleEditMode: () => void;

  // Firm Details (backward-compatible surface)
  firmDetails: FirmDetails;
  updateFirmDetails: (updates: Partial<FirmDetails>) => void;

  // Trust Layer
  documents: DocumentType[];
  trustScore: number;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;

  // Inventory
  inventory: ProductType[];
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  updateProduct: (id: string, updates: Partial<ProductType>) => void;

  // ─── TRADE NETWORK ──────────────────────────────────────────────────────
  updateTradeNetwork: (slug: string, type: 'global' | 'domestic', data: any) => Promise<void>;

  // ─── SUPABASE ASYNC ACTIONS ──────────────────────────────────────────────
  fetchFirmData: (slug: string) => Promise<void>;
  createFirm: (name: string) => Promise<string | null>;
}

// ─── HSN INTEGRITY LOCK ──────────────────────────────────────────────────────
// Hard-coded corrections per founder spec. Any product update or creation
// routes through this gate before touching the database.
const getCorrectedHSN = (name: string, currentHSN: string): string => {
  const n = name.toLowerCase();
  if (n.includes('hockey'))       return '9506.99.10';
  if (n.includes('ball'))         return '9506.99.20';
  if (n.includes('gloves'))       return '9506.99.90';
  return currentHSN;
};

// ─── DEFAULTS (used when Supabase has no data yet / fallback) ────────────────

const DEFAULT_FIRM: FirmDetails = {
  name: "HIMROCK EXPORTS",
  established: 1980,
  iecStatus: "VERIFIED",
  yearsInTrade: 44,
  globalRank: "TIER 1",
  dealsIn: "Sports Goods, Premium Leather",
  markets: "USA, United Kingdom, UAE",
  shipments: "120+",
  netWorth: "₹12 Cr",
  udin: "240591B2AASCV1923",
  global_presence: [
    { id: "us", name: "United States", cx: 195, cy: 165, flag: "🇺🇸", exports: "Sports Equipment, Leather Goods", volume: "$2.4M", growth: "+18%", status: "ACTIVE", shipments: 42 },
    { id: "uk", name: "United Kingdom", cx: 468, cy: 118, flag: "🇬🇧", exports: "Hockey Sticks, Cricket Bats", volume: "$1.8M", growth: "+12%", status: "ACTIVE", shipments: 31 },
    { id: "de", name: "Germany", cx: 502, cy: 122, flag: "🇩🇪", exports: "Boxing Gloves, Gym Equipment", volume: "$1.2M", growth: "+24%", status: "GROWING", shipments: 18 },
  ],
  domestic_presence: {
    isPanIndia: true,
    states: []
  }
};

const DEFAULT_INVENTORY: ProductType[] = [
  {
    id: "prod-001",
    name: "Professional Field Hockey Stick (Carbon Fiber)",
    hsn: "9506.99.10",
    image: "/demo/hockey.png",
    materials: [
      "Imported Japanese Toray Carbon Fiber",
      "Kevlar Core Reinforcement",
      "Polyurethane Grip (GST 18%)",
      "Final Assembly (Jalandhar, IN)"
    ]
  },
  {
    id: "prod-002",
    name: "Premium Cricket Leather Ball (Grade A)",
    hsn: "9506.99.20",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
    materials: [
      "Alum Tanned Steer Hide",
      "Cork & Worsted Yarn Core",
      "Hand-Stitched Seam (15/16 oz)",
      "Quality Control Check Passed"
    ]
  },
  {
    id: "prod-003",
    name: "Elite Cricket Batting Gloves (Premium Series)",
    hsn: "9506.99.90",
    image: "/demo/gloves.png",
    materials: [
      "Premium Sheepskin Leather Palm",
      "High-Density Foam Finger Rolls",
      "Kevlar Reinforced Side Bar",
      "Moisture-Wicking Wrist Band"
    ]
  }
];

const DEFAULT_DOCS: DocumentType[] = [
  { id: "ISO",  name: "ISO 9001:2015",     status: "VERIFIED", hash: "8d9a2b..." },
  { id: "MSME", name: "MSME Registration", status: "VERIFIED", hash: "4f7e1c..." },
  { id: "GST",  name: "GST Compliance",    status: "ACTIVE",   hash: "9a0b3d..." },
  { id: "RCMC", name: "RCMC Certificate",  status: "VERIFIED", hash: "2e5f8g..." },
];

// ─── STORE ───────────────────────────────────────────────────────────────────

export const useProductStore = create<ComplianceState>((set, get) => ({
  isEditMode: false,
  isLoading: false,
  error: null,

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

  // ─── FIRM DETAILS (backward-compatible) ──────────────────────────────────
  firmDetails: DEFAULT_FIRM,

  updateFirmDetails: (updates) =>
    set((state) => ({ firmDetails: { ...state.firmDetails, ...updates } })),

  // ─── TRUST LAYER ─────────────────────────────────────────────────────────
  documents: DEFAULT_DOCS,
  trustScore: DEFAULT_DOCS.filter(d => d.status === "VERIFIED" || d.status === "ACTIVE").length * 25,

  updateDocument: (id, updates) =>
    set((state) => {
      const newDocs = state.documents.map(d => d.id === id ? { ...d, ...updates } : d);
      const newScore = newDocs.filter(d => d.status === "VERIFIED" || d.status === "ACTIVE").length * 25;
      return { documents: newDocs, trustScore: newScore };
    }),

  // ─── INVENTORY ───────────────────────────────────────────────────────────
  inventory: DEFAULT_INVENTORY,
  activeProductId: null,
  setActiveProduct: (id) => set({ activeProductId: id }),

  updateProduct: (id, updates) =>
    set((state) => {
      // Apply HSN Integrity Lock before updating
      if (updates.name || updates.hsn) {
        const current = state.inventory.find(p => p.id === id);
        const resolvedName = updates.name || current?.name || '';
        updates.hsn = getCorrectedHSN(resolvedName, updates.hsn || current?.hsn || '');
      }
      return {
        inventory: state.inventory.map(p => p.id === id ? { ...p, ...updates } : p)
      };
    }),

  // ─── SUPABASE: FETCH FIRM BY SLUG ────────────────────────────────────────
  fetchFirmData: async (slug: string) => {
    set({ isLoading: true, error: null });

    // ── DEMO MODE ─────────────────────────────────────────────────────────
    if (!isConfigured) {
      // Simulate a brief network delay for realism
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
      // 1. Fetch Firm
      const { data: firm, error: firmError } = await supabase
        .from('firms')
        .select('*')
        .eq('slug', slug)
        .single();

      if (firmError) throw firmError;
      if (!firm) throw new Error('Firm not found');

      // 2. Fetch Products
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('firm_id', firm.id);

      if (prodError) throw prodError;

      // 3. Fetch Certifications
      const { data: certs, error: certError } = await supabase
        .from('certifications')
        .select('*')
        .eq('firm_id', firm.id);

      if (certError) throw certError;

      // 4. Map Supabase data into the existing FirmDetails shape
      const mappedFirm: FirmDetails = {
        id: firm.id,
        slug: firm.slug,
        name: firm.name || slug,
        established: firm.established ?? new Date().getFullYear(),
        iecStatus: firm.iec_code ? 'VERIFIED' : 'PENDING',
        yearsInTrade: firm.years_in_trade ?? 0,
        globalRank: firm.global_rank ?? '—',
        dealsIn: firm.deals_in ?? '—',
        markets: firm.markets ?? '—',
        shipments: firm.shipments ?? '0',
        netWorth: firm.net_worth ?? '—',
        udin: firm.udin ?? '—',
        global_presence: firm.global_presence ?? DEFAULT_FIRM.global_presence,
        domestic_presence: firm.domestic_presence ?? DEFAULT_FIRM.domestic_presence,
      };

      const mappedInventory: ProductType[] = (products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        hsn: getCorrectedHSN(p.name, p.hsn_code || ''),
        image: p.image_url || '/demo/placeholder.png',
        materials: Array.isArray(p.material) ? p.material : (p.material ? [p.material] : []),
      }));

      const mappedDocs: DocumentType[] = (certs || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        status: c.status || 'PENDING',
        hash: c.hash || 'SHA-256',
        file_url: c.file_url,
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
      console.error('fetchFirmData error:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  // ─── SUPABASE: CREATE FIRM ───────────────────────────────────────────────
  createFirm: async (name: string) => {
    set({ isLoading: true, error: null });
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // ── DEMO MODE ─────────────────────────────────────────────────────────
    if (!isConfigured) {
      await new Promise((r) => setTimeout(r, 800)); // Simulate async

      if (demoFirmRegistry.has(slug)) {
        set({ error: 'A firm with that name already exists in this session.', isLoading: false });
        return null;
      }

      const newFirmDetails: FirmDetails = {
        id: `demo-${crypto.randomUUID()}`,
        slug,
        name,
        established: new Date().getFullYear(),
        iecStatus: 'PENDING',
        yearsInTrade: 0,
        globalRank: '—',
        dealsIn: '—',
        markets: '—',
        shipments: '0',
        netWorth: '—',
        udin: '—',
        global_presence: [],
        domestic_presence: { isPanIndia: false, states: [] }
      };

      // Persist to the in-memory registry so fetchFirmData can retrieve it
      demoFirmRegistry.set(slug, {
        firmDetails: newFirmDetails,
        inventory: [],
        documents: [],
      });

      set({
        firmDetails: newFirmDetails,
        inventory: [],
        documents: [],
        trustScore: 0,
        isLoading: false,
      });

      console.info(`[HindTrade DEMO] Firm "${name}" created locally at /dashboard/${slug}`);
      return slug;
    }

    // ── LIVE MODE ─────────────────────────────────────────────────────────
    try {
      // Attach the owning user so RLS policies can identify the owner
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('firms')
        .insert([{
          name,
          slug,
          user_id: user?.id ?? null,
          trust_score: 0,
          established: new Date().getFullYear(),
        }])
        .select()
        .single();

      if (error) throw error;

      // Populate the store with the new firm's empty state
      set({
        firmDetails: {
          id: data.id,
          slug: data.slug,
          name: data.name,
          established: data.established ?? new Date().getFullYear(),
          iecStatus: 'PENDING',
          yearsInTrade: 0,
          globalRank: '—',
          dealsIn: '—',
          markets: '—',
          shipments: '0',
          netWorth: '—',
          udin: '—',
          global_presence: [],
          domestic_presence: { isPanIndia: false, states: [] }
        },
        inventory: [],
        documents: [],
        trustScore: 0,
        isLoading: false,
      });

      return slug;
    } catch (err: any) {
      console.error('createFirm error:', err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  updateTradeNetwork: async (slug: string, type: 'global' | 'domestic', data: any) => {
    set({ isLoading: true });
    
    // DEMO MODE
    if (!isConfigured) {
      const entry = demoFirmRegistry.get(slug);
      if (entry) {
        const field = type === 'global' ? 'global_presence' : 'domestic_presence';
        entry.firmDetails = { ...entry.firmDetails, [field]: data };
        set({ firmDetails: entry.firmDetails, isLoading: false });
      }
      return;
    }

    // LIVE MODE
    try {
      const field = type === 'global' ? 'global_presence' : 'domestic_presence';
      const { error } = await supabase
        .from('firms')
        .update({ [field]: data })
        .eq('slug', slug);

      if (error) throw error;
      set((state) => ({ 
        firmDetails: { ...state.firmDetails, [field]: data },
        isLoading: false 
      }));
    } catch (err: any) {
      console.error('updateTradeNetwork error:', err?.message || err || 'Unknown Error');
      set({ error: err?.message || 'Database update failed', isLoading: false });
    }
  },

  deleteProduct: async (productId: string) => {
    const { firmDetails, isConfigured } = get();
    set({ isLoading: true, error: null });

    if (!isConfigured) {
      set((state) => ({
        inventory: state.inventory.filter(p => p.id !== productId),
        isLoading: false
      }));
      return;
    }

    try {
      // Use count: 'exact' to see if anything was actually deleted
      const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', productId);

      if (error) throw error;
      
      if (count === 0) {
        console.warn('No product found with ID:', productId);
        // If it's a fallback ID (like prod-001), just filter it locally
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
}));
