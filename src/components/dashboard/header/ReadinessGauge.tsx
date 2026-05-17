"use client";

import { motion } from "framer-motion";

interface ReadinessGaugeProps {
  trustScore: number;
}

export function ReadinessGauge({ trustScore }: ReadinessGaugeProps) {
  const normalized = Math.max(0, Math.min(100, trustScore));
  const circumference = 2 * Math.PI * 15.9155;
  const offset = circumference - (normalized / 100) * circumference;
  const dialColor = normalized >= 75 ? "#DEFF9A" : normalized >= 50 ? "#D4CAA3" : "#EF4444";

  return (
    <>
      <div className="relative w-11 h-11 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          <motion.circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke={dialColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <span className="relative text-[9px] font-mono font-bold" style={{ color: dialColor }}>
          {normalized}%
        </span>
      </div>
      <div className="text-left hidden sm:block">
        <div className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Export</div>
        <div className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Readiness</div>
      </div>
    </>
  );
}
