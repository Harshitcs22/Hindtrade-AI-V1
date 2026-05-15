/**
 * Logic for parsing and formatting Antigravity Audit Traces
 */

export interface AuditStep {
  rule: string;
  result: "PASS" | "FAIL" | "PENDING";
  note: string;
  hash: string;
}

export interface AuditTrace {
  hsnCode: string;
  riskScore: number;
  steps: AuditStep[];
  timestamp: string;
}

export function formatAuditHash(hash: string): string {
  return `0x${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

export function getRiskColor(score: number): string {
  if (score < 20) return "#10b981"; // Emerald
  if (score < 50) return "#f59e0b"; // Amber
  return "#ef4444"; // Red
}

export function generateMockTrace(hsn: string): AuditTrace {
  return {
    hsnCode: hsn,
    riskScore: Math.floor(Math.random() * 30),
    timestamp: new Date().toISOString(),
    steps: [
      {
        rule: "GRI 1: Section Notes Analysis",
        result: "PASS",
        note: "Product matches Section XX, Chapter 95 definitions.",
        hash: "a1b2c3d4e5f6g7h8",
      },
      {
        rule: "GRI 3(b): Essential Character",
        result: "PASS",
        note: "Composite good classified by material giving essential character.",
        hash: "h8g7f6e5d4c3b2a1",
      },
      {
        rule: "Legal Note 2: Exclusion Check",
        result: "PASS",
        note: "Not excluded under Chapter 95 Legal Note 1.",
        hash: "1234567890abcdef",
      }
    ]
  };
}
