// ════════════════════════════════════════════════════════════════════════════════
// FILE: store/helpers.ts
// Purpose: Shared normalization utilities, integrity locks, and JSONB helpers
// ════════════════════════════════════════════════════════════════════════════════

import { ProductType } from '@/components/dashboard/ProductCard';
import {
  NetworkStatus,
  GlobalPresenceNode,
  GlobalPresenceJSONB,
  DomesticPresenceJSONB,
  FirmDetails,
  DocumentType,
} from './types';

// ─── HSN INTEGRITY LOCK ──────────────────────────────────────────────────────
// Hard-coded corrections per founder spec. Any product update or creation
// routes through this gate before touching the database.
export const getCorrectedHSN = (name: string, currentHSN: string): string => {
  const n = name.toLowerCase();
  if (n.includes('hockey'))       return '9506.99.10';
  if (n.includes('ball'))         return '9506.99.20';
  if (n.includes('gloves'))       return '9506.99.90';
  return currentHSN;
};

export const normalizeStatus = (status: string | undefined): NetworkStatus => {
  const value = (status || 'target').toLowerCase();
  if (value === 'active' || value === 'growing' || value === 'target') return value;
  if (value === 'looking for' || value === 'looking_for' || value === 'looking') return 'target';
  return 'target';
};

export const normalizeGlobalPresence = (value?: GlobalPresenceJSONB | GlobalPresenceNode[] | null): GlobalPresenceJSONB => {
  if (!value) return {};

  if (Array.isArray(value)) {
    return value.reduce<GlobalPresenceJSONB>((acc, node) => {
      const code = node.code || node.countryCode || node.id;
      if (!code) return acc;
      acc[code] = {
        ...node,
        code,
        status: normalizeStatus(node.status),
        cx: Number(node.cx ?? 0),
        cy: Number(node.cy ?? 0),
        shipments: Number(node.shipments ?? 0),
      };
      return acc;
    }, {});
  }

  return Object.entries(value).reduce<GlobalPresenceJSONB>((acc, [code, node]) => {
    acc[code] = {
      ...node,
      code: node.code || code,
      status: normalizeStatus(node.status),
      cx: Number(node.cx ?? 0),
      cy: Number(node.cy ?? 0),
      shipments: Number(node.shipments ?? 0),
    };
    return acc;
  }, {});
};

export const normalizeDomesticPresence = (value?: DomesticPresenceJSONB | null): DomesticPresenceJSONB => ({
  pan_india: Boolean(value?.pan_india ?? value?.isPanIndia ?? false),
  isPanIndia: Boolean(value?.isPanIndia ?? value?.pan_india ?? false),
  states: Array.isArray(value?.states) ? value!.states : [],
  active_states: Array.isArray(value?.active_states) ? value!.active_states : [],
  moq: value?.moq ?? undefined,
  customs_chapter: value?.customs_chapter ?? undefined,
});

export const parseIntegerField = (value: string | number | undefined, label: string): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number.parseInt(String(value ?? '').trim(), 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }
  return parsed;
};

export const toTextValue = (value: unknown) => String(value ?? '').trim();

// ─── IN-MEMORY DEMO REGISTRY ─────────────────────────────────────────────────
// Used when isConfigured is false (no Supabase credentials).
// Persists for the lifetime of the browser session via module scope.
export const demoFirmRegistry = new Map<string, { firmDetails: FirmDetails; inventory: ProductType[]; documents: DocumentType[] }>();

// ─── DEFAULTS (used when Supabase has no data yet / fallback) ────────────────

export const DEFAULT_INVENTORY: ProductType[] = [
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

export const DEFAULT_FIRM: FirmDetails = {
  name: "HIMROCK EXPORTS",
  established: 1980,
  iec_status: "VERIFIED",
  years_in_trade: 44,
  global_rank: "TIER 1",
  deals_in: "Sports Goods, Premium Leather",
  location: "Jalandhar, Punjab, India",
  shipments: "120+",
  net_worth: "₹12 Cr",
  trust_score: 85,
  identity_anchored: true,
  global_presence: {
    us: { code: "us", name: "United States", cx: 195, cy: 165, flag: "🇺🇸", exports: "Sports Equipment, Leather Goods", volume: "$2.4M", growth: "+18%", status: "active", shipments: 42 },
    uk: { code: "uk", name: "United Kingdom", cx: 468, cy: 118, flag: "🇬🇧", exports: "Hockey Sticks, Cricket Bats", volume: "$1.8M", growth: "+12%", status: "active", shipments: 31 },
    de: { code: "de", name: "Germany", cx: 502, cy: 122, flag: "🇩🇪", exports: "Boxing Gloves, Gym Equipment", volume: "$1.2M", growth: "+24%", status: "growing", shipments: 18 },
  },
  domestic_presence: {
    pan_india: true,
    isPanIndia: true,
    states: [],
    active_states: [],
    moq: "500 UNITS",
    customs_chapter: "95",
  },
  products: DEFAULT_INVENTORY,
};

export const DEFAULT_DOCS: DocumentType[] = [
  { id: "ISO",  name: "ISO 9001:2015",     status: "VERIFIED", hash: "8d9a2b..." },
  { id: "MSME", name: "MSME Registration", status: "VERIFIED", hash: "4f7e1c..." },
  { id: "GST",  name: "GST Compliance",    status: "ACTIVE",   hash: "9a0b3d..." },
  { id: "RCMC", name: "RCMC Certificate",  status: "VERIFIED", hash: "2e5f8g..." },
];
