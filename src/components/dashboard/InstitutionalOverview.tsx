"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Factory, Users, Boxes, Gauge, ShieldCheck, Award, Lock } from "lucide-react";
import { useProductStore } from "@/lib/store";

// ── Trust badge icons ────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { id: "iec",  label: "IEC",       icon: ShieldCheck, status: "VERIFIED" },
  { id: "gst",  label: "GST",       icon: ShieldCheck, status: "ACTIVE" },
  { id: "msme", label: "MSME",      icon: Award,       status: "VERIFIED" },
  { id: "iso",  label: "ISO 9001",  icon: Award,       status: "VERIFIED" },
];

// ── Default factory stats ───────────────────────────────────────────────────
const DEFAULT_STATS = [
  { id: "area",     label: "Factory Area",     value: "25,000 sq. ft.", fill: 72, icon: Factory, color: "#D4CAA3" },
  { id: "workers",  label: "Skilled Workers",  value: "120+",           fill: 60, icon: Users,   color: "#22D3EE" },
  { id: "capacity", label: "Monthly Capacity", value: "15,000 units",   fill: 85, icon: Boxes,   color: "#DEFF9A" },
  { id: "yield",    label: "Quality Yield",    value: "99.2%",          fill: 99, icon: Gauge,   color: "#D4CAA3" },
];

// ── Editable text input helper (inline, no-border luxury style) ─────────────
function EditableText({
  value,
  onChange,
  isEditing,
  className,
  as: Tag = "p",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  className?: string;
  as?: "p" | "span" | "h2";
  multiline?: boolean;
}) {
  if (!isEditing) return <Tag className={className}>{value}</Tag>;

  if (multiline) {
    return (
      <textarea
        defaultValue={value}
        rows={4}
        onBlur={(e) => onChange(e.target.value.trim())}
        className={`${className} bg-transparent border border-[#D4CAA3]/20 outline-none w-full resize-none focus:border-[#D4CAA3]/50 transition-colors px-3 py-2`}
      />
    );
  }

  return (
    <input
      defaultValue={value}
      onBlur={(e) => onChange(e.target.value.trim())}
      className={`${className} bg-transparent border-b border-[#D4CAA3]/30 outline-none w-full focus:border-[#D4CAA3] transition-colors`}
    />
  );
}

export function InstitutionalOverview() {
  const { firmDetails, documents, isEditMode, updateProfileStats } = useProductStore();

  // ── Local editable state for philosophy text ──────────────────────────────
  const [quote, setQuote] = useState(
    "Every product that leaves our factory floor carries a century-old craft tradition fused with modern precision engineering."
  );
  const [story1, setStory1] = useState(
    `${firmDetails.name || "Our firm"} is built on the principle that quality cannot be compromised. We source raw materials from certified suppliers across three continents, process them through ISO-compliant workflows, and deliver finished goods that meet the most stringent international procurement standards.`
  );
  const [story2, setStory2] = useState(
    "Our manufacturing journey from raw material to export-ready product is fully traceable, ensuring every shipment meets customs compliance requirements across 12+ active markets. This is the foundation of sovereign trade."
  );
  const [tagline, setTagline] = useState(
    "Trade is trust. Trust is traceability. — HindTrade Sovereign Protocol"
  );

  const currentDomestic = firmDetails?.domestic_presence || {};
  const factoryMetrics = (currentDomestic as any).factory_metrics || {
    factory_area: "25,000 SQ. FT.",
    skilled_workers: "120+",
    monthly_capacity: "15,000 UNITS",
    quality_yield: "99.2%",
    machine_utilization: "87%"
  };

  const handleFactoryMetricBlur = async (key: string, value: string) => {
    const updatedDomestic = {
      ...currentDomestic,
      factory_metrics: {
        ...factoryMetrics,
        [key]: value.trim()
      }
    };
    try {
      await updateProfileStats({ domestic_presence: updatedDomestic });
    } catch (err) {
      console.error("Failed to commit factory telemetry patch stream:", err);
    }
  };

  const stats = [
    {
      id: "area",
      label: "Factory Area",
      value: factoryMetrics.factory_area,
      fill: 72,
      icon: Factory,
      color: "#D4CAA3",
      field: "factory_area"
    },
    {
      id: "workers",
      label: "Skilled Workers",
      value: factoryMetrics.skilled_workers,
      fill: 60,
      icon: Users,
      color: "#22D3EE",
      field: "skilled_workers"
    },
    {
      id: "capacity",
      label: "Monthly Capacity",
      value: factoryMetrics.monthly_capacity,
      fill: 85,
      icon: Boxes,
      color: "#DEFF9A",
      field: "monthly_capacity"
    },
    {
      id: "yield",
      label: "Quality Yield",
      value: factoryMetrics.quality_yield,
      fill: parseFloat(factoryMetrics.quality_yield) || 99.2,
      icon: Gauge,
      color: "#D4CAA3",
      field: "quality_yield",
      isAudited: true
    },
  ];

  const utilizationNum = parseInt(factoryMetrics.machine_utilization) || 87;

  return (
    <section className="py-16 px-8 md:px-12 bg-[#0A0A0A] break-inside-avoid">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
        <div>
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#D4CAA3] uppercase font-bold mb-2 block">
            Institutional Overview
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] tracking-tight">
            Manufacturing Philosophy
          </h2>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-zinc-700 uppercase">
          Profile Version: 2.1
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Story (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4CAA3]/30 via-transparent to-transparent" />

            {/* Hero quote */}
            {isEditMode ? (
              <textarea
                defaultValue={quote}
                rows={3}
                onBlur={(e) => setQuote(e.target.value.trim())}
                className="text-lg font-serif text-[#F9F6EE] leading-relaxed tracking-tight mb-5 bg-transparent border border-[#D4CAA3]/20 outline-none w-full resize-none focus:border-[#D4CAA3]/50 transition-colors px-3 py-2"
              />
            ) : (
              <p className="text-lg font-serif text-[#F9F6EE] leading-relaxed tracking-tight mb-5">
                &ldquo;{quote}&rdquo;
              </p>
            )}

            {/* Story paragraph 1 */}
            <EditableText
              value={story1}
              onChange={setStory1}
              isEditing={isEditMode}
              multiline
              className="text-sm font-sans text-zinc-400 font-light leading-relaxed mb-4"
            />

            {/* Story paragraph 2 */}
            <EditableText
              value={story2}
              onChange={setStory2}
              isEditing={isEditMode}
              multiline
              className="text-sm font-sans text-zinc-400 font-light leading-relaxed"
            />

            {/* Inline quote accent */}
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D4CAA3]/10 border border-[#D4CAA3]/20 flex items-center justify-center shrink-0">
                <span className="text-[#D4CAA3] font-serif text-lg">&ldquo;</span>
              </div>
              {isEditMode ? (
                <input
                  defaultValue={tagline}
                  onBlur={(e) => setTagline(e.target.value.trim())}
                  className="text-[11px] font-sans text-zinc-500 italic bg-transparent border-b border-[#D4CAA3]/30 outline-none w-full focus:border-[#D4CAA3] transition-colors"
                />
              ) : (
                <p className="text-[11px] font-sans text-zinc-500 italic">
                  {tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Factory Stats Terminal (2 cols) */}
        <div className="lg:col-span-2">
          <div className="w-full bg-zinc-950/40 backdrop-blur-md p-6 md:p-8 border border-white/5 shadow-[0_0_20px_rgba(212,202,163,0.01)] transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#D4CAA3]/15 hover:shadow-[0_0_25px_rgba(212,202,163,0.15)] rounded-none">
            {/* Terminal header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 bg-transparent">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DEFF9A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4CAA3]" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase ml-2 text-zinc-500 font-semibold">
                Factory Terminal
              </span>
            </div>

            {/* Stats with individual bars */}
            <div className="divide-y divide-white/[0.04]">
              {stats.map(({ id, label, value, fill, icon: Icon, color, field, isAudited }, idx) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="py-5 group hover:bg-white/[0.02] transition-colors"
                >
                  {/* Label + Value row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-zinc-600 group-hover:text-[#D4CAA3] transition-colors" />
                      <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
                        {label}
                      </span>
                    </div>
                    {isEditMode && !isAudited ? (
                      <input
                        defaultValue={value}
                        onBlur={(e) => handleFactoryMetricBlur(field, e.target.value.trim())}
                        className="bg-transparent border-b border-[#D4CAA3]/30 outline-none font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase text-right w-32 focus:border-[#D4CAA3] transition-colors"
                      />
                    ) : (
                      <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase flex items-center gap-1.5">
                        {value}
                        {isAudited && (
                          <span className="text-zinc-500 font-sans text-[9px] tracking-wider uppercase flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> [✓ AUDITED LEDGER]
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-[2px] bg-zinc-900 w-full relative mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${fill}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="h-full absolute left-0 top-0 bg-zinc-400"
                    />
                    {/* Micro-glow terminating head element */}
                    <motion.div
                      initial={{ left: 0 }}
                      whileInView={{ left: `${fill}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4CAA3] shadow-[0_0_8px_rgba(212,202,163,1)]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Machine Utilization — featured metric */}
            <div className="py-6 border-t border-white/[0.06] bg-transparent">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-[9px] tracking-[0.22em] text-zinc-500 uppercase font-semibold block">
                  Machine Utilization
                </span>
                <span className="font-sans text-xs md:text-sm text-zinc-100 font-bold tracking-wider uppercase flex items-center gap-1.5">
                  {utilizationNum}%
                  <span className="text-zinc-500 font-sans text-[9px] tracking-wider uppercase flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> [✓ AUDITED LEDGER]
                  </span>
                </span>
              </div>
              <div className="h-[2px] bg-zinc-900 w-full relative mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${utilizationNum}%` }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                  viewport={{ once: true }}
                  className="h-full absolute left-0 top-0 bg-zinc-400"
                />
                <motion.div
                  initial={{ left: 0 }}
                  whileInView={{ left: `${utilizationNum}%` }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4CAA3] shadow-[0_0_8px_rgba(212,202,163,1)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ROW ── */}
      <div className="mt-10 flex flex-wrap items-center gap-y-4 divide-x divide-white/5 border border-white/5 bg-[#0D0D0D] px-6 py-4 rounded-none">
        <span className="text-[9px] font-sans tracking-[0.25em] text-zinc-500 uppercase mr-4">
          Trust Anchors
        </span>
        {TRUST_BADGES.map(({ id, label, icon: Icon }, idx) => {
          let isVerified = false;
          const isIec = id === "iec";

          if (id === "iec") {
            isVerified = String(firmDetails.iec_status).toUpperCase() === "VERIFIED";
          } else if (id === "gst" || id === "msme") {
            const hasDoc = documents.some(
              d => d.name.toLowerCase().includes(id) &&
                   ["VERIFIED", "ACTIVE"].includes(String(d.status).toUpperCase())
            );
            isVerified = hasDoc || firmDetails.identity_anchored === true;
          } else if (id === "iso") {
            isVerified = documents.some(
              d => d.name.toLowerCase().includes("iso") &&
                   ["VERIFIED", "ACTIVE"].includes(String(d.status).toUpperCase())
            );
          }

          return (
            <div
              key={id}
              className="flex items-center gap-2 px-4 py-1"
            >
              <Icon className={`w-3.5 h-3.5 ${isVerified ? "text-[#D4CAA3]" : "text-zinc-600"}`} />
              <span className="font-sans text-[10px] tracking-[0.2em] font-semibold uppercase text-zinc-300">
                {label}
              </span>
              {isVerified && (
                <div
                  className={`h-1.5 w-1.5 rounded-full bg-[#D4CAA3] shadow-[0_0_8px_rgba(212,202,163,1)] ${
                    isIec ? "animate-pulse" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
