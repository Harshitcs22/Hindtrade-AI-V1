import { ExporterProfile, ChapterNode, ProductAsset } from './types';

export const ONBOARDED_PROFILES: ExporterProfile[] = [
  {
    id: "92C07E2E-B337-4072-B685-E907412BDD1A",
    name: "Akshay Exports",
    established: 1975,
    dealsIn: "sports goods and sportswear",
    markets: "23 Countries",
    shipments: "100+",
    experience: "51 Yrs",
    netWorth: "50cr",
    isLive: true,
    countryCode: "IN",
    badges: ["Gst Registered", "Iec Holder"],
    slug: "akshay-exports"
  },
  {
    id: "4A118D3F-F112-4981-A542-C109483FD22B",
    name: "Himrock Exports",
    established: 1998,
    dealsIn: "light engineering components & forging",
    markets: "14 Countries",
    shipments: "85+",
    experience: "28 Yrs",
    netWorth: "32cr",
    isLive: true,
    countryCode: "IN",
    badges: ["Gst Registered", "Oea Certified"],
    slug: "himrock-exports"
  }
];

export const METRICS_STRIP = [
  { label: "Indexed Assets", value: "12,842" },
  { label: "Verified Exporters", value: "84" },
  { label: "HSN Mapped Products", value: "5,400" },
  { label: "Export Markets", value: "37" },
  { label: "Audit Coverage", value: "98.2%" }
];

export const TAXONOMY_STRIP = ["ALL", "CRICKET", "HOCKEY", "FOOTBALL", "FITNESS", "BOXING", "ATHLETICS", "TOYS", "INDOOR GAMES"];

export const FILTER_CHIPS = ["VERIFIED EXPORTERS", "IEC VERIFIED", "GST VERIFIED", "OEM CAPABLE", "EXPORT READY", "HSN VERIFIED", "TRACEABILITY ACTIVE", "MOQ AVAILABLE"];

export const CUSTOMS_TAXONOMY: ChapterNode[] = [
  {
    code: "9506",
    title: "SPORTS EQUIPMENT",
    subheadings: [
      { code: "9506.32", label: "Cricket Equipment" },
      { code: "9506.99", label: "Hockey Equipment" },
      { code: "9506.62", label: "Football Equipment" },
      { code: "9506.70", label: "Tennis Equipment" },
      { code: "9506.91", label: "Gym & Fitness" },
      { code: "9506.99.30", label: "Athletics & Boxing" }
    ]
  },
  {
    code: "9503",
    title: "TOYS & RECREATIONAL",
    subheadings: [
      { code: "9503.00", label: "Educational Kits" },
      { code: "9503.40", label: "Plastic Components" }
    ]
  },
  {
    code: "9504",
    title: "GAME ARTICLES",
    subheadings: [
      { code: "9504.20", label: "Billiard Tables" },
      { code: "9504.50", label: "Arcade consoles" }
    ]
  }
];

export const INVENTORY_POOL: ProductAsset[] = [
  {
    id: "prod-1",
    hsn: "9506.32.00",
    name: "Professional Cricket Leather Ball",
    category: "CRICKET",
    material: "Alum Hydrated Leather / Core Cork",
    markets: "UK, Australia, South Africa",
    moq: "500 Units",
    exporter: "Akshay Exports",
    verified: true,
    tags: ["Leather", "Match Grade", "OEM Ready", "Hand Stitched"],
    image: "🔴"
  },
  {
    id: "prod-2",
    hsn: "9506.99.10",
    name: "Tournament Composite Hockey Stick",
    category: "HOCKEY",
    material: "85% Carbon / 15% Kevlar Matrix",
    markets: "Netherlands, Germany, Belgium",
    moq: "200 Units",
    exporter: "Akshay Exports",
    verified: true,
    tags: ["Carbon Composite", "Elite Grade", "Custom Bow"],
    image: "🏑"
  },
  {
    id: "prod-3",
    hsn: "9506.62.10",
    name: "Match Grade Thermo-Bonded Football",
    category: "FOOTBALL",
    material: "High-Density Textured PU",
    markets: "UK, France, UAE",
    moq: "1000 Units",
    exporter: "Himrock Exports",
    verified: true,
    tags: ["PU Matrix", "FIFA Spec", "Thermo Bonded"],
    image: "⚽"
  },
  {
    id: "prod-4",
    hsn: "9506.91.00",
    name: "Hex Dumbbell Gym Weight Matrix",
    category: "FITNESS",
    material: "Solid Cast Iron / Textured Chrome Handle",
    markets: "USA, Germany, Singapore",
    moq: "100 Pairs",
    exporter: "Akshay Exports",
    verified: true,
    tags: ["Cast Iron", "Gym Grade", "Hex Grip", "Heavy Duty"],
    image: "🏋️"
  },
  {
    id: "prod-5",
    hsn: "9506.99.30",
    name: "Elite Cowhide Leather Boxing Gloves",
    category: "BOXING",
    material: "Full Grain Cowhide Leather / Multi-Layer Foam",
    markets: "USA, UK, Japan",
    moq: "250 Units",
    exporter: "Himrock Exports",
    verified: true,
    tags: ["Cowhide Leather", "Match Approved", "Ergonomic Bow"],
    image: "🥊"
  },
  {
    id: "prod-6",
    hsn: "9506.99.30",
    name: "Competition Grade Aluminum Javelin",
    category: "ATHLETICS",
    material: "Tempered Aircraft-Grade Aluminum Alloy",
    markets: "Germany, Australia, Sweden",
    moq: "50 Units",
    exporter: "Akshay Exports",
    verified: true,
    tags: ["Aluminum", "IAAF Spec", "Anti-Vibration"],
    image: "🏃"
  },
  {
    id: "prod-7",
    hsn: "9503.00.00",
    name: "Autonomous STEM Robotics Lab Kit",
    category: "TOYS",
    material: "ABS Plastic / Micro-Controller Node",
    markets: "UK, France, South Korea",
    moq: "500 Kits",
    exporter: "Himrock Exports",
    verified: true,
    tags: ["Robotics", "STEM Learn", "ABS Safe"],
    image: "🤖"
  },
  {
    id: "prod-8",
    hsn: "9504.20.00",
    name: "Professional Slate Billiard Table",
    category: "INDOOR GAMES",
    material: "Premium Italian Slate / Mahogany Frames",
    markets: "UAE, UK, Qatar",
    moq: "10 Units",
    exporter: "Akshay Exports",
    verified: true,
    tags: ["Slate Table", "Pro Cushion", "Mahogany Wood"],
    image: "🎱"
  }
];
