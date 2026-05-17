"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ComplianceStripProps {
  iecStatus: string;
  identityAnchored: boolean;
}

export function ComplianceStrip({ iecStatus, identityAnchored }: ComplianceStripProps) {
  const showNeutralVerified = iecStatus === "VERIFIED" && identityAnchored;

  if (iecStatus === "PENDING" || iecStatus === "UNDER_REVIEW") {
    return (
      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        className="text-[#D4CAA3] text-[11px] font-mono tracking-[0.25em] uppercase font-bold"
      >
        {"// SYSTEM UNDER MANUAL COMPLIANCE REVIEW"}
      </motion.div>
    );
  }

  if (showNeutralVerified) {
    return null;
  }

  return (
    <div className="text-red-400 text-[11px] font-mono tracking-[0.25em] uppercase font-bold px-3 py-1.5 border border-red-500/40 bg-red-500/5">
      ⚠ {iecStatus}
    </div>
  );
}
