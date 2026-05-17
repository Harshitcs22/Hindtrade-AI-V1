"use client";

import React from "react";
import { useProductStore } from "@/lib/store";

export function InstitutionalBio() {
  const { firmDetails, isEditMode, updateProfileStats } = useProductStore();

  const handleMetricBlur = async (field: string, value: string) => {
    try {
      let finalValue: any = value.trim();
      if (field === "years_in_trade") {
        const parsed = parseInt(finalValue, 10);
        if (!isNaN(parsed)) {
          finalValue = parsed;
        }
      }
      await updateProfileStats({ [field]: finalValue });
    } catch (err) {
      console.error(`Failed to sync field update for ${field}:`, err);
    }
  };

  return (
    <section className="w-full py-16 px-6 max-w-7xl mx-auto bg-[#0A0A0A]">
      <span className="font-sans text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-4 block">
        INSTITUTIONAL OVERVIEW
      </span>
      <h2 className="font-serif text-3xl font-normal text-zinc-100 tracking-wide mb-12">
        Corporate Profile & Sovereign Operational Ledger
      </h2>

      {/* The 6-Cell Metrics Ledger Block Container Card */}
      <div className="w-full bg-zinc-950/40 backdrop-blur-md p-6 md:p-8 mb-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 rounded-none border border-[#D4CAA3]/10 shadow-[0_0_20px_rgba(212,202,163,0.03)] transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#D4CAA3]/25 hover:shadow-[0_0_30px_rgba(212,202,163,0.25)] cursor-pointer">
        {/* 1. IEC STATUS */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4 lg:first:border-l-0 lg:first:pl-0">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            IEC Status
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.iec_status || "VERIFIED"}
              onBlur={(e) => handleMetricBlur("iec_status", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.iec_status || "VERIFIED"}
            </span>
          )}
        </div>

        {/* 2. SHIPMENTS */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            Shipments
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.shipments || "1000+"}
              onBlur={(e) => handleMetricBlur("shipments", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.shipments || "1000+"}
            </span>
          )}
        </div>

        {/* 3. YEARS IN TRADE */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            Years In Trade
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.years_in_trade || "51 YRS"}
              onBlur={(e) => handleMetricBlur("years_in_trade", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.years_in_trade ? `${firmDetails.years_in_trade} YRS` : "51 YRS"}
            </span>
          )}
        </div>

        {/* 4. LOCATION */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            Location
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.location || "Jalandhar"}
              onBlur={(e) => handleMetricBlur("location", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.location || "Jalandhar"}
            </span>
          )}
        </div>

        {/* 5. GLOBAL RANK */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            Global Rank
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.global_rank || "TIER 1"}
              onBlur={(e) => handleMetricBlur("global_rank", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.global_rank || "TIER 1"}
            </span>
          )}
        </div>

        {/* 6. NET WORTH */}
        <div className="flex flex-col gap-y-1.5 border-l-0 pl-0 lg:border-l lg:border-white/5 lg:pl-4">
          <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
            Net Worth
          </span>
          {isEditMode ? (
            <input
              type="text"
              defaultValue={firmDetails?.net_worth || "50CR"}
              onBlur={(e) => handleMetricBlur("net_worth", e.target.value)}
              className="bg-transparent text-white font-sans text-xs md:text-sm font-bold tracking-wider focus:outline-none border-b border-white/10 focus:border-[#D4CAA3] uppercase w-full py-0.5 mt-1"
            />
          ) : (
            <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase block mt-1">
              {firmDetails?.net_worth || "50CR"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT FLEX COLUMN: THE NARRATIVE COMPANY BIO (Span 5) */}
        <div className="lg:col-span-5 flex flex-col">
          <h3 className="font-serif text-xl font-bold tracking-wide text-[#D4CAA3] mb-4">
            ABOUT THE INSTITUTION
          </h3>
          <p className="font-sans text-sm leading-relaxed text-zinc-400 font-normal">
            Based out of the industrial trade zones of {firmDetails?.location || "Jalandhar, India"},
            <span className="text-white font-medium"> {firmDetails?.name || "The Entity"}</span> has established a verified
            {" "}{firmDetails?.years_in_trade || "51"}-year sovereign footprint in international commerce. Managing
            active trade pipelines routing through to <span className="text-white font-medium">{Object.keys(firmDetails?.global_presence || {}).length || "10"} countries</span>,
            the entity integrates physical craftsmanship with institutional regulatory compliance.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8 w-full">
            {/* Primary CTA: Request Quotation */}
            <button className="px-6 py-3 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase border border-[#D4CAA3] bg-[#D4CAA3] text-black hover:bg-transparent hover:text-[#D4CAA3] transition-all duration-300">
              Request Quotation
            </button>

            {/* Secondary CTA: Download Export Profile */}
            <button
              onClick={() => window.print()}
              className="px-6 py-3 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase border border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300"
            >
              Download Export Profile
            </button>
          </div>
        </div>

        {/* RIGHT FLEX COLUMN: DYNAMIC CREDENTIALS (Span 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 1. IEC STATUS */}
          <div className="flex flex-col border-l border-white/5 pl-6">
            <h4 className="font-serif text-xs font-bold tracking-wider text-white uppercase mb-4">
              IEC REGISTRY STATUS
            </h4>
            <div className="mb-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-[#D4CAA3] px-3 py-1.5 border border-white/5 bg-white/[0.02]">
                {firmDetails?.iec_status || "VERIFIED"}
              </span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-zinc-500">
              Dynamic node confirmation tracking active commercial shipping authorization code directly linked to Indian custom databases.
            </p>
          </div>

          {/* 2. IDENTITY ANCHOR STATUS */}
          <div className="flex flex-col border-l border-white/5 pl-6">
            <h4 className="font-serif text-xs font-bold tracking-wider text-white uppercase mb-4">
              SOVEREIGN IDENTITY RECORD
            </h4>
            <div className="mb-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-[#22D3EE] px-3 py-1.5 border border-[#22D3EE]/20 bg-[#22D3EE]/5 shadow-[0_0_10px_rgba(34,211,238,0.05)]">
                {firmDetails?.identity_anchored ? "SECURED SIGNATURE" : "PROVISIONAL"}
              </span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-zinc-500">
              Cryptographic identity registration validated against domestic corporate registries to guard against cross-border transaction risks.
            </p>
          </div>

          {/* 3. PRODUCTION BASICS & AVAILABILITY */}
          <div className="flex flex-col border-l border-white/5 pl-6">
            <h4 className="font-serif text-xs font-bold tracking-wider text-white uppercase mb-4">
              OPERATIONAL BASELINES
            </h4>
            <div className="mb-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-400 px-3 py-1.5 border border-white/5 bg-white/[0.02]">
                MOQ: {firmDetails?.domestic_presence?.moq || "200 UNITS"}
              </span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-zinc-500">
              Minimum order thresholds calibrated natively to support raw material allocation queues, customs clearance protocols, and sustained batch quality.
            </p>
          </div>

          {/* 4. COMPLIANCE MATRIX */}
          <div className="flex flex-col border-l border-white/5 pl-6">
            <h4 className="font-serif text-xs font-bold tracking-wider text-white uppercase mb-4">
              AUDIT INDEX LOGS
            </h4>
            <div className="mb-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-[#DEFF9A] px-3 py-1.5 border border-[#DEFF9A]/20 bg-[#DEFF9A]/5">
                4/4 DOCUMENTS VERIFIED
              </span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-zinc-500">
              Full verification status achieved across core tax records, export licenses, and manufacturing asset profiles under manual platform review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
