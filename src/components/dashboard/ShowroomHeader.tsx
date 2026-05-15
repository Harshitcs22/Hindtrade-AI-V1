"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings2, ShieldCheck, Globe, CheckCircle2, Camera,
  ImageIcon, X, AlertTriangle, ChevronRight, Loader2,
  Upload, TrendingUp,
} from "lucide-react";
import { useProductStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

// ─── COLUMN MAP: FirmDetails key → Supabase column name ─────────────────────
const DB_COL: Record<string, string> = {
  name:         "name",
  iecStatus:    "iec_code",
  yearsInTrade: "years_in_trade",
  globalRank:   "global_rank",
  shipments:    "shipments",
  markets:      "location",
  dealsIn:      "deals_in",
  netWorth:     "net_worth",
  established:  "established",
};

// ─── REACTIVE EXPORT READINESS SCORE ────────────────────────────────────────
function calcReadiness(
  iecStatus: string,
  inventoryCount: number,
  trustScore: number,
  docCount: number
): { score: number; missing: string[] } {
  let score = 0;
  const missing: string[] = [];

  // IEC (25 pts)
  if (iecStatus === "VERIFIED" || iecStatus === "verified") score += 25;
  else missing.push("IEC Registration — not yet verified");

  // Products (25 pts)
  if (inventoryCount > 0) score += 25;
  else missing.push("Add at least 1 product to the Digital Inventory");

  // Trust Layer (up to 35 pts based on doc count)
  const docScore = Math.min(docCount, 4) * 8;
  score += docScore;
  if (docCount < 2) missing.push(`Verification Vault — needs ${2 - docCount} more certificate(s)`);

  // Net worth / shipments (15 pts)
  if (trustScore >= 50) score += 15;
  else missing.push("Complete firm profile (shipments, net worth, location)");

  return { score: Math.min(score, 100), missing };
}

export function ShowroomHeader({ onOpenAI }: { onOpenAI?: () => void }) {
  const {
    isEditMode, toggleEditMode,
    firmDetails, updateFirmDetails,
    inventory, documents, trustScore,
  } = useProductStore();

  // ── Supabase save state ───────────────────────────────────────────────────
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Dial compliance modal ─────────────────────────────────────────────────
  const [showCompliance, setShowCompliance] = useState(false);

  // ── Image upload states ───────────────────────────────────────────────────
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
  );
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // ── Reactive readiness score ──────────────────────────────────────────────
  const { score: readiness, missing: complianceGaps } = calcReadiness(
    firmDetails.iecStatus,
    inventory.length,
    trustScore,
    documents.length,
  );

  // ── onBlur: persist field to Supabase ────────────────────────────────────
  const handleBlurSave = useCallback(async (field: string, value: string | number) => {
    if (!firmDetails.id) return;
    const col = DB_COL[field];
    if (!col) return;

    setSaveState("saving");
    try {
      const { error } = await supabase
        .from("firms")
        .update({ [col]: value })
        .eq("id", firmDetails.id);
      if (error) throw error;
      setSaveState("saved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }, [firmDetails.id]);

  // ── Banner image upload to Supabase Storage ───────────────────────────────
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firmDetails.id) return;
    setBannerUploading(true);

    try {
      const ext  = file.name.split(".").pop();
      const path = `banners/${firmDetails.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("firm_assets")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("firm_assets")
        .getPublicUrl(path);

      setBannerUrl(publicUrl);

      await supabase
        .from("firms")
        .update({ banner_url: publicUrl })
        .eq("id", firmDetails.id);
    } catch (err) {
      console.error("[Banner upload]", err);
    } finally {
      setBannerUploading(false);
    }
  };

  // ── ContentEditable helper ────────────────────────────────────────────────
  const EditableField = ({
    value, field, className, placeholder, as: Tag = "span",
  }: {
    value: string; field: string; className?: string; placeholder?: string; as?: "span" | "h1" | "p";
  }) => {
    if (!isEditMode) return <Tag className={className}>{value || placeholder}</Tag>;
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        data-sovereign-edit="true"
        data-placeholder={placeholder}
        className={`${className} cursor-text px-1`}
        onBlur={(e) => {
          const val = (e.target as HTMLElement).textContent?.trim() || value;
          updateFirmDetails({ [field]: val } as any);
          handleBlurSave(field, val);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  };

  // ── Stat input helper ─────────────────────────────────────────────────────
  const StatInput = ({
    value, field, width = "w-20", color = "text-[#F9F6EE]",
  }: {
    value: string | number; field: string; width?: string; color?: string;
  }) => {
    if (!isEditMode) return <span>{value}</span>;
    return (
      <input
        defaultValue={String(value)}
        className={`bg-transparent border-b border-[#D4CAA3]/40 outline-none ${color} ${width} font-mono focus:border-[#D4CAA3] transition-colors text-sm`}
        onBlur={(e) => {
          const val = e.target.value.trim();
          updateFirmDetails({ [field]: val } as any);
          handleBlurSave(field, val);
        }}
      />
    );
  };

  // ── Circular SVG dial ─────────────────────────────────────────────────────
  const circumference = 2 * Math.PI * 15.9155;
  const offset = circumference - (readiness / 100) * circumference;
  const dialColor = readiness >= 75 ? "#DEFF9A" : readiness >= 50 ? "#D4CAA3" : "#EF4444";

  return (
    <section className="relative w-full border-b border-white/5 bg-[#0A0A0A]">
      {/* ── CINEMATIC BANNER ──────────────────────────────────────────────── */}
      <div className="h-[380px] md:h-[480px] w-full relative overflow-hidden">
        {/* Scan-line effect */}
        <div className="scan-line z-10" />

        {/* Banner image */}
        <img
          src={bannerUrl}
          alt="Firm Banner"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-35 mix-blend-luminosity transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />

        {/* ── UPLOAD BANNER BUTTON (edit mode) ── */}
        {isEditMode && (
          <button
            onClick={() => bannerInputRef.current?.click()}
            disabled={bannerUploading}
            className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-black/70 border border-[#D4CAA3]/30 hover:border-[#D4CAA3]/70 text-[#D4CAA3] text-[10px] font-mono tracking-widest uppercase px-4 py-2.5 backdrop-blur-md transition-all"
          >
            {bannerUploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
            ) : (
              <><ImageIcon className="w-3.5 h-3.5" /> Change Banner</>
            )}
          </button>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerUpload}
        />

        {/* ── TOP RIGHT: CONTROLS + DIAL ── */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          {/* Save indicator */}
          <AnimatePresence>
            {saveState !== "idle" && (
              <motion.div
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5
                  ${saveState === "saving" ? "text-zinc-500" : "text-[#DEFF9A]"}`}
              >
                {saveState === "saving"
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                  : <><CheckCircle2 className="w-3 h-3" /> Saved</>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Mode Toggle */}
          <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-4 py-2.5 border border-white/10">
            <Settings2 className={`w-3.5 h-3.5 transition-colors ${isEditMode ? "text-[#D4CAA3]" : "text-zinc-600"}`} />
            <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase">Edit</span>
            <Switch checked={isEditMode} onCheckedChange={toggleEditMode} className="scale-75 ml-1" />
          </div>

          {/* Export Readiness Dial */}
          <button
            onClick={() => setShowCompliance(true)}
            className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2.5 border border-white/10 hover:border-[#D4CAA3]/40 transition-all group trust-glow"
          >
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Track */}
                <circle cx="18" cy="18" r="15.9155" fill="none"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                {/* Progress */}
                <motion.circle
                  cx="18" cy="18" r="15.9155" fill="none"
                  stroke={dialColor} strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <span className="relative text-[9px] font-mono font-bold" style={{ color: dialColor }}>
                {readiness}%
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Export</div>
              <div className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">Readiness</div>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-[#D4CAA3] transition-colors" />
          </button>
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div className="ShowroomHeader_bottom absolute bottom-0 left-0 w-full px-8 md:px-12 pb-8 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-20">

          {/* Left: Identity */}
          <div className="space-y-3 max-w-2xl">
            {/* Badges */}
            <div className="flex items-center flex-wrap gap-3">
              <Badge className="bg-[#DEFF9A]/10 text-[#DEFF9A] border-[#DEFF9A]/20 rounded-none px-3 py-1 text-[10px] tracking-widest font-mono">
                SOVEREIGN TRUST: {trustScore}%
              </Badge>
              {/* Identity Anchored with glow-pulse */}
              <div className="flex items-center gap-1.5 text-[#22D3EE] text-[10px] tracking-widest font-mono uppercase glow-pulse px-2 py-1 border border-[#22D3EE]/20 bg-[#22D3EE]/5">
                <ShieldCheck className="w-3 h-3" />
                Identity Anchored
              </div>
            </div>

            {/* Firm Name — Playfair Display */}
            <EditableField
              as="h1"
              field="name"
              value={firmDetails.name}
              placeholder="Your Firm Name"
              className="text-5xl md:text-[4.5rem] font-serif text-[#F9F6EE] tracking-tight uppercase leading-none"
            />

            {/* Tagline — Urbanist */}
            <EditableField
              as="p"
              field="dealsIn"
              value={firmDetails.dealsIn}
              placeholder="Your export category & tagline"
              className="text-zinc-400 font-sans font-light tracking-wide text-sm md:text-base max-w-xl leading-relaxed"
            />

            {/* Markets */}
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#D4CAA3]/60 shrink-0" />
              <StatInput
                value={firmDetails.markets}
                field="markets"
                width="w-48"
                color="text-zinc-400"
              />
            </div>

            {/* ── IDENTITY RIBBON (Editable) ── */}
            <div className="flex items-center flex-wrap gap-0 text-xs font-serif tracking-[0.15em] uppercase text-zinc-400 mt-3">
              {[
                { display: "🇮🇳 India Exporter", field: null, fixed: true },
                { display: "Verified Manufacturer", field: null, fixed: true },
                { display: `Est. ${firmDetails.established || '2013'}`, field: "established", editPrefix: "Est. ", editValue: String(firmDetails.established || '2013') },
                { display: `MOQ: 500`, field: null, fixed: true },
              ].map((item, i, arr) => (
                <span key={i} className="flex items-center">
                  {isEditMode && item.field ? (
                    <span className="flex items-center gap-1">
                      <span className="text-[#D4CAA3]/50">{item.editPrefix}</span>
                      <input
                        defaultValue={item.editValue}
                        className="bg-transparent border-b border-[#D4CAA3]/30 outline-none text-zinc-300 font-serif text-xs tracking-[0.15em] uppercase w-14 text-center focus:border-[#D4CAA3] transition-colors"
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          updateFirmDetails({ [item.field!]: val } as any);
                          handleBlurSave(item.field!, val);
                        }}
                      />
                    </span>
                  ) : (
                    <span className="hover:text-[#D4CAA3] transition-colors">{item.display}</span>
                  )}
                  {i < arr.length - 1 && (
                    <span className="text-[#22D3EE]/30 mx-3 text-[8px] select-none">◆</span>
                  )}
                </span>
              ))}
            </div>

            {/* ── ACTION SUITE ── */}
            <div className="flex items-center flex-wrap gap-3 mt-2">
              <button
                onClick={onOpenAI}
                className="bg-[#D4CAA3] text-[#0A0A0A] font-bold text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-white transition-colors"
              >
                Request Quotation
              </button>
              <button
                onClick={() => window.print()}
                className="border border-[#D4CAA3]/50 text-[#D4CAA3] font-bold text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[#D4CAA3]/10 transition-colors"
              >
                Download Export Profile
              </button>
              <button
                onClick={onOpenAI}
                className="border border-[#22D3EE]/50 text-[#22D3EE] font-serif text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-[#22D3EE]/10 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
              >
                Talk to Sales Head (AI)
              </button>
            </div>
          </div>

          {/* Right: Stats — Open executive serif line */}
          <div className="flex items-center gap-0">
            {[
              { label: "IEC", value: firmDetails.iecStatus, color: "#22D3EE", field: "iecStatus" },
              { label: "SHIPMENTS", value: firmDetails.shipments, color: "#F9F6EE", field: "shipments" },
              { label: "YEARS", value: `${firmDetails.yearsInTrade} YRS`, color: "#F9F6EE", field: "yearsInTrade" },
              { label: "RANK", value: firmDetails.globalRank, color: "#D4CAA3", field: "globalRank" },
              { label: "NET WORTH", value: firmDetails.netWorth, color: "#DEFF9A", field: "netWorth" },
            ].map(({ label, value, color, field }, idx, arr) => (
              <div key={field} className="flex items-center gap-0">
                <div className="flex flex-col items-center px-6 md:px-8 py-3">
                  <span className="text-[10px] font-serif tracking-[0.2em] text-[#D4CAA3]/60 uppercase mb-1.5">{label}</span>
                  {isEditMode ? (
                    <input
                      defaultValue={String(value).replace(' YRS', '')}
                      className="bg-transparent border-b border-white/10 outline-none font-serif text-base text-center w-20 focus:border-[#D4CAA3]/60 transition-colors"
                      style={{ color }}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        updateFirmDetails({ [field]: val } as any);
                        handleBlurSave(field, val);
                      }}
                    />
                  ) : (
                    <span
                      className="font-serif text-base font-semibold tracking-[0.1em]"
                      style={{ color, textShadow: `0 0 8px ${color}30` }}
                    >
                      {value}
                    </span>
                  )}
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-[#22D3EE]/25 text-[8px] select-none">◆</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompliance && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
            onClick={() => setShowCompliance(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="bg-[#0A0A0A] border border-[#D4CAA3]/20 w-full max-w-lg relative shadow-[0_0_80px_rgba(212,202,163,0.12)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/60 to-transparent" />
              
              <button onClick={() => setShowCompliance(false)}
                className="absolute top-5 right-5 text-zinc-600 hover:text-[#D4CAA3] transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Dial — large */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9155" fill="none"
                        stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                      <motion.circle
                        cx="18" cy="18" r="15.9155" fill="none"
                        stroke={dialColor} strokeWidth="2.5" strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-mono font-bold" style={{ color: dialColor }}>{readiness}%</span>
                      <span className="text-[8px] font-mono text-zinc-600 tracking-widest">READY</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#F9F6EE] mb-1">Export Readiness</h3>
                    <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                      {readiness >= 80
                        ? "Your firm is export-ready. Agent Ekayan is fully operational."
                        : readiness >= 50
                        ? "Good progress. Complete the items below to reach full readiness."
                        : "Complete the compliance checklist to activate your sovereign terminal."}
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <div className="text-[9px] font-mono tracking-[0.25em] text-zinc-600 uppercase mb-3">
                    Compliance Checklist
                  </div>

                  {/* Passing items */}
                  {[
                    { label: "IEC Status verified", done: firmDetails.iecStatus === "VERIFIED" },
                    { label: "Product inventory seeded", done: inventory.length > 0 },
                    { label: "2+ certifications added", done: documents.filter(d => d.status === "verified" || d.status === "VERIFIED").length >= 2 },
                    { label: "Firm profile complete", done: trustScore >= 50 },
                  ].map(({ label, done }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 border transition-colors
                      ${done ? "border-[#DEFF9A]/15 bg-[#DEFF9A]/5" : "border-white/5 bg-[#111111]"}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#DEFF9A]/20" : "bg-white/5"}`}>
                        {done
                          ? <CheckCircle2 className="w-3 h-3 text-[#DEFF9A]" />
                          : <AlertTriangle className="w-3 h-3 text-zinc-600" />}
                      </div>
                      <span className={`text-xs font-sans ${done ? "text-[#F9F6EE]" : "text-zinc-500"}`}>{label}</span>
                      <span className={`ml-auto text-[9px] font-mono ${done ? "text-[#DEFF9A]" : "text-zinc-700"}`}>
                        {done ? "DONE" : "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>

                {complianceGaps.length > 0 && (
                  <div className="mt-5 p-4 bg-[#D4CAA3]/5 border border-[#D4CAA3]/15">
                    <div className="text-[9px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Next Actions
                    </div>
                    <ul className="space-y-1.5">
                      {complianceGaps.map((g, i) => (
                        <li key={i} className="text-xs text-zinc-400 font-sans flex items-start gap-2">
                          <span className="text-[#D4CAA3] mt-0.5 shrink-0">→</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
