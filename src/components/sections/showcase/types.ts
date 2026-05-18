// Type specifications for Hindtrade Trust and Search domains

export interface ExporterProfile {
  id: string;
  name: string;
  established: number;
  dealsIn: string;
  markets: string;
  shipments: string;
  experience: string;
  netWorth: string;
  isLive: boolean;
  countryCode: string;
  badges: string[];
  slug: string;
}

export interface ProductAsset {
  id: string;
  hsn: string;
  name: string;
  category: string;
  material: string;
  markets: string;
  moq: string;
  exporter: string;
  verified: boolean;
  tags: string[];
  image: string;
  exporterSlug?: string;
  audit_trace?: string;
}

export interface ChapterNode {
  code: string;
  title: string;
  subheadings: { code: string; label: string }[];
}
