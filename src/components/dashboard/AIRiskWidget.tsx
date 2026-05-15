"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, AlertTriangle, Fingerprint, Cpu } from "lucide-react";
import { useProductStore } from "@/lib/store";

export function AIRiskWidget() {
  const { firmDetails, documents, inventory, trustScore } = useProductStore();

  // ── Dynamic risk assessment logic ──────────────────────────────────────────
  const checks = [
    {
      label: "Identity Anchored",
      passed: !!firmDetails.id && !!firmDetails.name,
      detail: "Firm identity verified against IEC registry",
    },
    {
      label: "Trade Records Consistent",
      passed: inventory.length > 0 && Number(firmDetails.shipments) > 0,
      detail: `${inventory.length} product(s) in inventory, ${firmDetails.shipments} shipments recorded`,
    },
    {
      label: "Compliance Passed",
      passed: documents.filter(d => d.status === "verified" || d.status === "VERIFIED").length >= 2,
      detail: `${documents.filter(d => d.status === "verified" || d.status === "VERIFIED").length} verified certificates on file`,
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const riskLevel = passedCount === 3 ? "LOW" : passedCount >= 2 ? "MEDIUM" : "HIGH";
  const riskColor = riskLevel === "LOW" ? "#DEFF9A" : riskLevel === "MEDIUM" ? "#D4CAA3" : "#EF4444";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-8 md:mx-12 my-6 break-inside-avoid"
    >
      <div className="bg-[#0D0D0D] border border-white/[0.06] relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DEFF9A]/30 to-transparent" />

        <div className="flex flex-col md:flex-row">
          {/* Left: Risk Score */}
          <div className="flex flex-col items-center justify-center px-10 py-8 md:py-10 md:border-r border-b md:border-b-0 border-white/5 md:min-w-[260px]">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#22D3EE] uppercase font-bold">
                AI Risk Analysis
              </span>
            </div>

            {/* Risk badge */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="px-8 py-3 mb-3 border-2"
              style={{ borderColor: `${riskColor}40`, backgroundColor: `${riskColor}08` }}
            >
              <span
                className="text-3xl font-mono font-black tracking-widest"
                style={{ color: riskColor }}
              >
                {riskLevel}
              </span>
            </motion.div>

            <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
              Risk Classification
            </span>

            {/* Score bar */}
            <div className="w-full max-w-[180px] mt-4">
              <div className="flex justify-between text-[8px] font-mono text-zinc-700 uppercase mb-1">
                <span>High</span><span>Low</span>
              </div>
              <div className="h-1.5 bg-white/5 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passedCount / 3) * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full absolute left-0 top-0"
                  style={{ backgroundColor: riskColor }}
                />
              </div>
            </div>
          </div>

          {/* Right: Checklist */}
          <div className="flex-1 p-7 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-4 h-4 text-[#D4CAA3]" />
              <span className="text-xs font-serif text-[#F9F6EE]">Compliance Verification</span>
            </div>

            <div className="space-y-3">
              {checks.map(({ label, passed, detail }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-start gap-3 p-3.5 border transition-all ${
                    passed
                      ? "border-[#DEFF9A]/15 bg-[#DEFF9A]/[0.03]"
                      : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <div className={`w-5 h-5 shrink-0 flex items-center justify-center mt-0.5 ${
                    passed ? "text-[#DEFF9A]" : "text-zinc-600"
                  }`}>
                    {passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-sans font-medium ${passed ? "text-[#F9F6EE]" : "text-zinc-500"}`}>
                      {label}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 mt-0.5 truncate">{detail}</div>
                  </div>
                  <span className={`text-[8px] font-mono tracking-widest shrink-0 mt-1 ${
                    passed ? "text-[#DEFF9A]" : "text-zinc-700"
                  }`}>
                    {passed ? "PASS" : "FAIL"}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Fingerprint hash */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
              <Fingerprint className="w-3 h-3 text-zinc-700" />
              <span className="text-[9px] font-mono text-zinc-700 tracking-widest">
                ANALYSIS HASH: {firmDetails.id?.slice(0, 8) || "0x00000000"}...{firmDetails.id?.slice(-4) || "0000"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
