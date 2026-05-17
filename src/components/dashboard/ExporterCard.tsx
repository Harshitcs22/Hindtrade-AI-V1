"use client";

import React from "react";
import { motion } from "framer-motion";
import { useProductStore } from "@/lib/store";

export function ExporterCard({ onOpenAI }: { onOpenAI: () => void }) {
  const { firmDetails } = useProductStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto group text-left"
    >
      {/* Premium Trade Card Component - Exact clone from Landing Page */}
      <div className="relative w-full bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000000] border border-white/10 rounded-2xl py-6 px-8 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden group">
        
        {/* Luxury Metallic Glare Effect (Visible on hover) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Sleeker Logo Box */}
            <div className="w-6 h-6 bg-gradient-to-br from-[#D4CAA3] to-[#8C825A] text-[#0A0A0A] flex items-center justify-center font-serif text-xs font-bold rounded-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              H
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400 text-[9px] font-sans tracking-[0.2em] font-normal uppercase">
                VERIFIED EXPORTER
              </span>
              <span className="flex items-center text-emerald-500/80 text-[7px] font-sans tracking-widest font-medium uppercase">
                <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_4px_#10b981]"></span>
                LIVE
              </span>
            </div>
          </div>
          <div className="text-zinc-600 font-sans text-[9px] font-normal tracking-[0.2em] uppercase">IN</div>
        </div>

        {/* Title - Ultra Luxury Spacing */}
        <div className="text-center mt-2 mb-4">
          <h2 className="text-xl md:text-[22px] font-sans font-light tracking-[0.3em] text-white/95 uppercase">
            {firmDetails.name}
          </h2>
          <div className="text-[#D4CAA3]/70 text-[8px] tracking-[0.3em] font-sans mt-2">
            EST. {firmDetails.established}
          </div>
        </div>

        {/* Business Profile - Dense & Sleek */}
        <div className="border-y border-white/5 py-3 mb-4 font-sans text-[10px] font-light tracking-widest flex flex-col gap-2 px-1">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 uppercase text-[8px]">DEALS IN</span>
            <span className="text-zinc-300 font-normal text-right">{firmDetails.deals_in}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 uppercase text-[8px]">MARKETS</span>
            <span className="text-zinc-300 font-normal text-right">{Object.keys(firmDetails.global_presence || {}).length} COUNTRIES</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div>
            <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">SHIPMENTS</div>
            <div className="text-white/90 text-sm md:text-base font-sans font-medium">{firmDetails.shipments}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">EXPERIENCE</div>
            <div className="text-white/90 text-sm md:text-base font-sans font-medium">{firmDetails.years_in_trade} Yrs</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">NET WORTH</div>
            <div className="text-[#D4CAA3] text-sm md:text-base font-sans font-medium">{firmDetails.net_worth}</div>
          </div>
        </div>

        {/* Pill Badges - Thinner borders, smaller text */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <span className="bg-white/[0.02] text-zinc-400 border border-white/10 px-3 py-1 text-[7px] font-sans tracking-[0.2em] uppercase font-light rounded-full">
            GST REGISTERED
          </span>
          <span className="bg-white/[0.02] text-zinc-400 border border-white/10 px-3 py-1 text-[7px] font-sans tracking-[0.2em] uppercase font-light rounded-full">
            IEC HOLDER
          </span>
        </div>

        {/* Footer & CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="text-zinc-500 text-[8px] font-sans tracking-[0.15em] uppercase">
            ID: {firmDetails.id || "N/A"} <span className="mx-1 text-zinc-700">|</span> <span className="text-[#D4CAA3]/90 font-normal">VERIFIED</span>
          </div>
          <button 
            onClick={onOpenAI}
            className="bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,202,163,0.15)]"
          >
            Talk to AI <span className="text-lg leading-none mt-[-2px]">✦</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
