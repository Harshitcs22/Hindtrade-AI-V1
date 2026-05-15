"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Factory, Users, Boxes, Gauge, ShieldCheck, Award } from "lucide-react";
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
  const { firmDetails, documents, isEditMode } = useProductStore();

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

  // ── Local editable state for factory stats ────────────────────────────────
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [utilization, setUtilization] = useState("87");

  const updateStat = (id: string, newValue: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: newValue } : s))
    );
  };

  const utilizationNum = Math.min(parseInt(utilization) || 0, 100);

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
          <div className="bg-[#0D0D0D] border border-white/[0.06] overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2.5 px-7 py-4 border-b border-white/5 bg-[#111111]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#DEFF9A]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4CAA3]" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="text-[10px] font-serif text-zinc-500 tracking-[0.2em] uppercase ml-2">
                Factory Terminal
              </span>
            </div>

            {/* Stats with individual bars */}
            <div className="divide-y divide-white/[0.04]">
              {stats.map(({ id, label, value, fill, icon: Icon, color }, idx) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="px-7 py-5 group hover:bg-white/[0.02] transition-colors"
                >
                  {/* Label + Value row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-zinc-600 group-hover:text-[#D4CAA3] transition-colors" />
                      <span className="text-xs font-serif tracking-[0.15em] text-zinc-400 uppercase">
                        {label}
                      </span>
                    </div>
                    {isEditMode ? (
                      <input
                        defaultValue={value}
                        onBlur={(e) => updateStat(id, e.target.value.trim())}
                        className="bg-transparent border-b border-[#D4CAA3]/30 outline-none font-serif text-base font-semibold tracking-wide text-right w-32 focus:border-[#D4CAA3] transition-colors"
                        style={{ color }}
                      />
                    ) : (
                      <span
                        className="font-serif text-base font-semibold tracking-wide"
                        style={{ color }}
                      >
                        {value}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/[0.04] overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${fill}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="h-full absolute left-0 top-0"
                      style={{ backgroundColor: color, opacity: 0.7 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Machine Utilization — featured metric */}
            <div className="px-7 py-6 border-t border-white/[0.06] bg-[#0C0C0C]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-serif tracking-[0.15em] text-zinc-400 uppercase">
                  Machine Utilization
                </span>
                {isEditMode ? (
                  <div className="flex items-center gap-1">
                    <input
                      defaultValue={utilization}
                      onBlur={(e) => setUtilization(e.target.value.trim())}
                      className="bg-transparent border-b border-[#D4CAA3]/30 outline-none font-serif text-lg font-bold text-[#D4CAA3] text-right w-12 focus:border-[#D4CAA3] transition-colors"
                    />
                    <span className="font-serif text-lg font-bold text-[#D4CAA3]">%</span>
                  </div>
                ) : (
                  <span className="font-serif text-lg font-bold text-[#D4CAA3]">
                    {utilizationNum}%
                  </span>
                )}
              </div>
              <div className="h-2 bg-white/[0.04] overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${utilizationNum}%` }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-[#D4CAA3] to-[#DEFF9A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ROW ── */}
      <div className="mt-10 flex items-center flex-wrap gap-4">
        <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-700 uppercase mr-2">
          Trust Anchors:
        </span>
        {TRUST_BADGES.map(({ id, label, icon: Icon, status }, idx) => {
          // Check if this badge matches a real document
          const realDoc = documents.find(
            d => d.name.toLowerCase().includes(id) ||
                 d.name.toLowerCase().includes(label.toLowerCase())
          );
          const isVerified = realDoc
            ? (realDoc.status === "VERIFIED" || realDoc.status === "verified")
            : status === "VERIFIED";

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className={`flex items-center gap-2 px-4 py-2.5 border transition-all ${
                isVerified
                  ? "border-[#D4CAA3]/20 bg-[#D4CAA3]/[0.04] hover:border-[#D4CAA3]/40"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isVerified ? "text-[#D4CAA3]" : "text-zinc-600"}`} />
              <span className={`text-[10px] font-mono tracking-widest uppercase ${
                isVerified ? "text-[#D4CAA3]" : "text-zinc-600"
              }`}>
                {label}
              </span>
              {isVerified && <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A]" />}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
