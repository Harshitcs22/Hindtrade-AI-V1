// ════════════════════════════════════════════════════════════════════════════════
// FILE: components/dashboard/VerificationBadges.tsx
// Purpose: Dynamic verification status badges with real-time updates
// Displays IEC, Identity, and Trust Score badges based on multi-tenant verification data
// ════════════════════════════════════════════════════════════════════════════════

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { Verification, IECStatus } from "@/types/supabase";

interface Props {
  iecStatus: IECStatus;
  identityAnchored: boolean;
  trustScore: number;
  verifications?: Verification[];
  isVerifying?: boolean;
}

export function VerificationBadges({
  iecStatus,
  identityAnchored,
  trustScore,
  verifications = [],
  isVerifying = false,
}: Props) {
  // Calculate verification progress
  const approvedVerifications = verifications.filter(v => v.status === 'APPROVED').length;
  const pendingVerifications = verifications.filter(v => v.status === 'PENDING' || v.status === 'UNDER_REVIEW').length;

  // ── IEC STATUS BADGE ────────────────────────────────────────────────────────
  const iecBadge = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      key="iec-badge"
    >
      {iecStatus === 'VERIFIED' ? (
        <div className="border border-white/5 bg-white/[0.01] px-2.5 py-1 text-zinc-200 font-sans text-[10px] tracking-[0.2em] font-medium uppercase flex items-center gap-1.5 backdrop-blur-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4CAA3]" />
          IEC VERIFIED
        </div>
      ) : iecStatus === 'PENDING' ? (
        <div className="border border-white/5 bg-white/[0.01] px-2.5 py-1 text-zinc-400 font-sans text-[10px] tracking-[0.2em] font-medium uppercase flex items-center gap-1.5 backdrop-blur-md animate-pulse">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          UNDER MANUAL REVIEW
        </div>
      ) : (
        <div className="border border-red-500/20 bg-white/[0.01] px-2.5 py-1 text-zinc-200 font-sans text-[10px] tracking-[0.2em] font-medium uppercase flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500/80" />
          VERIFICATION FAILED
        </div>
      )}
    </motion.div>
  );

  // ── IDENTITY ANCHORED BADGE ────────────────────────────────────────────────
  const identityBadge = identityAnchored && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      key="identity-badge"
    >
      <div className="border border-white/5 bg-white/[0.01] px-2.5 py-1 text-zinc-200 font-sans text-[10px] tracking-[0.2em] font-medium uppercase flex items-center gap-1.5 backdrop-blur-md">
        <div className="w-2.5 h-2.5 rounded-full border border-[#D4CAA3]/50 flex items-center justify-center bg-[#D4CAA3]/10">
           <div className="w-1 h-1 bg-[#D4CAA3] rounded-full animate-pulse" />
        </div>
        IDENTITY ANCHORED
      </div>
    </motion.div>
  );

  // ── SOVEREIGN TRUST SCORE BADGE ────────────────────────────────────────────
  const trustBadge = trustScore > 0 && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      key="trust-badge"
    >
      <div className={`border bg-white/[0.01] px-2.5 py-1 text-zinc-200 font-sans text-[10px] tracking-[0.2em] font-medium uppercase flex items-center gap-1.5 backdrop-blur-md
        ${trustScore >= 75
          ? 'border-[#DEFF9A]/20'
          : trustScore >= 50
          ? 'border-[#D4CAA3]/20'
          : 'border-yellow-500/20'
        }`}
      >
        <div className={`w-2 h-2 rounded-full
          ${trustScore >= 75 ? 'bg-[#DEFF9A]' : trustScore >= 50 ? 'bg-[#D4CAA3]' : 'bg-yellow-500'}
        `} />
        <span>
          Sovereign Trust: {trustScore}%
        </span>
      </div>
    </motion.div>
  );

  // ── VERIFICATION PROGRESS ──────────────────────────────────────────────────
  const verificationProgress = verifications.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      key="verification-progress"
      className="flex items-center gap-6 mt-3.5"
    >
      <div className="flex items-center align-middle gap-2">
        {verifications.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className={`w-1.5 h-1.5 rounded-full transition-all
              ${v.status === 'APPROVED' ? 'bg-[#D4CAA3]' : 
                v.status === 'PENDING' || v.status === 'UNDER_REVIEW' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500/50'}
            `}
            title={`${v.document_type}: ${v.status}`}
          />
        ))}
      </div>
      <div className="flex items-center align-middle font-sans text-[10px] tracking-[0.2em] font-medium uppercase text-zinc-400">
        {approvedVerifications}/{verifications.length} Documents Verified
        {pendingVerifications > 0 && (
          <span className="text-yellow-600/80 animate-pulse ml-2 tracking-normal text-[10px]">
            ({pendingVerifications} under review)
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {iecBadge}
      {identityBadge}
    </div>
  );
}
