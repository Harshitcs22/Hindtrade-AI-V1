"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Loader2, CheckCircle, Plus, Trash2,
  Package, Cpu, ShieldCheck, Tag, Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProductStore } from "@/lib/store";

// ─── HSN INTEGRITY LOCK (mirrors store logic) ─────────────────────────────────
function getCorrectedHSN(name: string, hint: string): string {
  const n = name.toLowerCase();
  if (n.includes("hockey")) return "9506.99.10";
  if (n.includes("ball")) return "9506.99.20";
  if (n.includes("gloves") || n.includes("glove")) return "9506.99.90";
  if (n.includes("bat")) return "9506.99.30";
  if (n.includes("net")) return "5608.90.00";
  if (n.includes("leather")) return "4205.00.90";
  if (n.includes("textile") || n.includes("fabric")) return "6217.90.00";
  return hint || "9506.99.99";
}

// ── AUTO IMAGE SUGGESTION ─────────────────────────────────────────────
// Maps product keywords → curated Unsplash photos so images always show.
function getAutoImageUrl(name: string, category: string): string {
  const t = (name + " " + category).toLowerCase();
  if (t.includes("hockey"))                  return "https://images.unsplash.com/photo-1580748142113-45511c2a7d75?w=800&q=80";
  if (t.includes("football") || t.includes("soccer")) return "https://images.unsplash.com/photo-1594671778774-ed74e0e7e4a0?w=800&q=80";
  if (t.includes("cricket"))                 return "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80";
  if (t.includes("boxing") || t.includes("glove")) return "https://images.unsplash.com/photo-1517438984742-1262db08379e?w=800&q=80";
  if (t.includes("leather"))                 return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80";
  if (t.includes("textile") || t.includes("fabric")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";
  if (t.includes("sports"))                  return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80";
  if (t.includes("ball"))                    return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80";
  return "https://images.unsplash.com/photo-1486401899868-87e8d3931e5e?w=800&q=80";
}

type Step = 1 | 2 | 3;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  firmId: string;
}

const STEP_META = [
  { step: 1, icon: Package, label: "Basic Info", mono: "PRODUCT IDENTITY" },
  { step: 2, icon: Cpu,     label: "Technical",  mono: "MANUFACTURING DATA" },
  { step: 3, icon: ShieldCheck, label: "Compliance", mono: "HSN STATUTORY LOCK" },
];

export function ProductIngestionModal({ isOpen, onClose, firmId }: Props) {
  const { inventory } = useProductStore();

  // ── Step 1 state ──────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageOverridden, setImageOverridden] = useState(false);

  // Auto-suggest image when name/category changes (unless user manually set one)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!imageOverridden) setImageUrl(getAutoImageUrl(val, category));
  };
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (!imageOverridden) setImageUrl(getAutoImageUrl(name, val));
  };
  const handleImageUrlChange = (val: string) => {
    setImageUrl(val);
    setImageOverridden(val.length > 0);
  };

  // ── Step 2 state ──────────────────────────────────────────────────────────
  const [materials, setMaterials] = useState<string[]>([""]);
  const [journeySteps, setJourneySteps] = useState<string[]>([""]);

  // ── Step 3 state ──────────────────────────────────────────────────────────
  const lockedHSN = getCorrectedHSN(name, category);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStep(1);
    setName(""); setCategory(""); setImageUrl("");
    setMaterials([""]); setJourneySteps([""]);
    setIsSuccess(false); setIsSubmitting(false); setError(null);
  };

  const handleClose = () => { if (!isSubmitting) { reset(); onClose(); } };

  // ── Material tag helpers ───────────────────────────────────────────────────
  const addMaterial = () => setMaterials((m) => [...m, ""]);
  const updateMaterial = (i: number, val: string) =>
    setMaterials((m) => m.map((v, idx) => (idx === i ? val : v)));
  const removeMaterial = (i: number) =>
    setMaterials((m) => m.filter((_, idx) => idx !== i));

  // ── Journey step helpers ──────────────────────────────────────────────────
  const addJourney = () => setJourneySteps((j) => [...j, ""]);
  const updateJourney = (i: number, val: string) =>
    setJourneySteps((j) => j.map((v, idx) => (idx === i ? val : v)));
  const removeJourney = (i: number) =>
    setJourneySteps((j) => j.filter((_, idx) => idx !== i));

  // ── Step validation ───────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 1) return name.trim().length > 0 && category.trim().length > 0;
    if (step === 2) return materials.some((m) => m.trim());
    return true;
  };

  // ── Finalize: INSERT to Supabase ──────────────────────────────────────────
  const handleFinalize = async () => {
    if (!firmId || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    const journeyPayload = journeySteps
      .filter((j) => j.trim())
      .map((title, idx) => ({ step: idx + 1, title, location: "Jalandhar, IN" }));

    try {
      const { error: insertError } = await supabase.from("products").insert([
        {
          firm_id: firmId,
          name: name.trim(),
          hsn_code: lockedHSN,
          material: materials.filter((m) => m.trim()),
          journey: journeyPayload,
          image_url: imageUrl.trim() || null,
          audit_trace: `Classified under HSN ${lockedHSN} per GRI Rule 1 — ${category} goods.`,
        },
      ]);

      if (insertError) throw insertError;

      // Refresh inventory in store
      const { fetchFirmData, firmDetails } = useProductStore.getState();
      if (firmDetails.slug) await fetchFirmData(firmDetails.slug);

      setIsSuccess(true);
      setTimeout(() => { reset(); onClose(); }, 2200);
    } catch (err: any) {
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#0A0A0A] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/60 transition-colors placeholder:text-zinc-700 rounded-none";
  const labelClass =
    "text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="bg-[#0A0A0A] border border-[#D4CAA3]/20 w-full max-w-2xl relative overflow-hidden shadow-[0_0_100px_rgba(212,202,163,0.10)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/60 to-transparent" />

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-zinc-600 hover:text-[#D4CAA3] transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Indicator */}
            {!isSuccess && (
              <div className="flex items-center gap-0 border-b border-white/5">
                {STEP_META.map(({ step: s, icon: Icon, label, mono }) => (
                  <button
                    key={s}
                    onClick={() => s < step && setStep(s as Step)}
                    className={`flex-1 flex items-center gap-3 px-6 py-4 border-r border-white/5 last:border-r-0 transition-all
                      ${step === s ? "bg-[#D4CAA3]/5 border-b-2 border-b-[#D4CAA3]" : "border-b-2 border-b-transparent"}
                      ${s < step ? "cursor-pointer hover:bg-white/5" : "cursor-default"}`}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all
                      ${step === s ? "border-[#D4CAA3] bg-[#D4CAA3]/10" : s < step ? "border-[#D4CAA3]/50 bg-[#D4CAA3]/5" : "border-white/10"}`}>
                      {s < step
                        ? <CheckCircle className="w-3.5 h-3.5 text-[#D4CAA3]" />
                        : <Icon className={`w-3.5 h-3.5 ${step === s ? "text-[#D4CAA3]" : "text-zinc-600"}`} />}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className={`text-[10px] font-mono tracking-widest ${step === s ? "text-[#D4CAA3]" : "text-zinc-600"}`}>
                        {`0${s}`}
                      </div>
                      <div className={`text-xs font-sans ${step === s ? "text-[#F9F6EE]" : "text-zinc-600"}`}>
                        {label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">

                {/* ── STEP 1: BASIC INFO ── */}
                {step === 1 && !isSuccess && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-serif text-[#F9F6EE] mb-1">Product Identity</h2>
                    <p className="text-xs text-zinc-500 mb-7 font-light">Define the core identity of your export-grade product.</p>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-5 font-mono">{error}</div>}

                    <div className="space-y-5">
                      <div>
                        <label className={labelClass}>Product Name *</label>
                        <input value={name} onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g., Professional Field Hockey Stick"
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Export Category *</label>
                        <input value={category} onChange={(e) => handleCategoryChange(e.target.value)}
                          placeholder="e.g., Sports Goods, Leather Goods"
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Cinematic Image URL
                          {imageUrl && !imageOverridden && (
                            <span className="ml-2 text-[#D4CAA3]/60 normal-case font-normal">— auto-suggested</span>
                          )}
                        </label>
                        <input value={imageUrl} onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="Auto-filled based on product type"
                          className={inputClass} />
                        {imageUrl && (
                          <div className="mt-2 h-32 overflow-hidden border border-white/5 relative">
                            <img
                              src={imageUrl}
                              alt="preview"
                              className="w-full h-full object-cover opacity-70"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: TECHNICAL ── */}
                {step === 2 && !isSuccess && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-serif text-[#F9F6EE] mb-1">Manufacturing Data</h2>
                    <p className="text-xs text-zinc-500 mb-7 font-light">Add material composition and the 0→1 manufacturing journey.</p>

                    {/* Material Tags */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelClass}>Material Composition *</label>
                        <button onClick={addMaterial} className="flex items-center gap-1 text-[10px] font-mono text-[#D4CAA3] hover:text-white transition-colors">
                          <Plus className="w-3 h-3" /> Add Material
                        </button>
                      </div>
                      <div className="space-y-2">
                        {materials.map((m, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-1 bg-[#0A0A0A] border border-white/10 focus-within:border-[#D4CAA3]/60 transition-colors px-3 py-2">
                              <Tag className="w-3 h-3 text-zinc-600 shrink-0" />
                              <input value={m} onChange={(e) => updateMaterial(i, e.target.value)}
                                placeholder={`Material ${i + 1}`}
                                className="bg-transparent text-sm text-[#F9F6EE] outline-none w-full placeholder:text-zinc-700" />
                            </div>
                            {materials.length > 1 && (
                              <button onClick={() => removeMaterial(i)} className="text-zinc-700 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Journey Steps */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelClass}>Manufacturing Journey (0→1)</label>
                        <button onClick={addJourney} className="flex items-center gap-1 text-[10px] font-mono text-[#D4CAA3] hover:text-white transition-colors">
                          <Plus className="w-3 h-3" /> Add Step
                        </button>
                      </div>
                      <div className="space-y-2">
                        {journeySteps.map((j, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="flex items-center gap-3 flex-1 bg-[#0A0A0A] border border-white/10 focus-within:border-[#D4CAA3]/60 transition-colors px-3 py-2">
                              <span className="text-[10px] font-mono text-zinc-600 w-4 shrink-0">{String(i).padStart(2, "0")}</span>
                              <input value={j} onChange={(e) => updateJourney(i, e.target.value)}
                                placeholder={`Step ${i + 1}: e.g., Raw carbon fiber sourced from Toray Japan`}
                                className="bg-transparent text-sm text-[#F9F6EE] outline-none w-full placeholder:text-zinc-700" />
                            </div>
                            {journeySteps.length > 1 && (
                              <button onClick={() => removeJourney(i)} className="text-zinc-700 hover:text-red-400 transition-colors mt-2.5">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: COMPLIANCE ── */}
                {step === 3 && !isSuccess && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-serif text-[#F9F6EE] mb-1">Statutory Compliance Lock</h2>
                    <p className="text-xs text-zinc-500 mb-7 font-light">Agent Ekayan has assigned the following HSN code. This is legally locked per GRI Rules.</p>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-5 font-mono">{error}</div>}

                    {/* HSN Lock Display */}
                    <div className="bg-[#111111] border border-[#D4CAA3]/20 p-6 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/40 to-transparent" />
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-[#DEFF9A]" />
                        <span className="text-[10px] font-mono tracking-[0.25em] text-[#DEFF9A] uppercase">HSN Integrity Lock — Active</span>
                      </div>
                      <div className="text-4xl font-mono font-bold text-[#D4CAA3] mb-2">{lockedHSN}</div>
                      <div className="text-xs text-zinc-500 font-sans">
                        Classified under <span className="text-zinc-300">{category || "Export Goods"}</span> per ITC-HS 2022 Schedule.
                      </div>
                      <div className="mt-4 text-[10px] font-mono text-zinc-600 border-t border-white/5 pt-3">
                        GRI RULE APPLIED: Rule 1 — Classification by heading description
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#111111] border border-white/5 p-5 space-y-3">
                      <div className="text-[10px] font-mono text-zinc-500 tracking-widest mb-2">PRODUCT SUMMARY</div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-600">Name</span>
                        <span className="text-xs text-[#F9F6EE] font-medium text-right max-w-[60%]">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-600">Category</span>
                        <span className="text-xs text-[#F9F6EE]">{category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-600">Materials</span>
                        <span className="text-xs text-[#F9F6EE]">{materials.filter(Boolean).length} defined</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-600">Journey Steps</span>
                        <span className="text-xs text-[#F9F6EE]">{journeySteps.filter(Boolean).length} defined</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── SUCCESS STATE ── */}
                {isSuccess && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center text-center gap-5">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="w-16 h-16 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-[#D4CAA3]" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-serif text-[#F9F6EE] mb-1">Product Ingested</h3>
                      <p className="text-xs text-zinc-500 font-mono">
                        <span className="text-[#D4CAA3]">{name}</span> added to the Digital Showroom
                      </p>
                    </div>
                    <div className="text-[10px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase animate-pulse">
                      Syncing with Agent Ekayan...
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Navigation Footer */}
              {!isSuccess && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : handleClose()}
                    className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 hover:text-[#D4CAA3] transition-colors uppercase"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {step === 1 ? "Cancel" : "Back"}
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => canProceed() && setStep((s) => (s + 1) as Step)}
                      disabled={!canProceed()}
                      className="bg-[#D4CAA3] text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase px-8 py-3 flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                      Continue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalize}
                      disabled={isSubmitting}
                      className="bg-[#D4CAA3] text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase px-8 py-3 flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-40 group"
                    >
                      {isSubmitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing...</>
                        : <><Sparkles className="w-3.5 h-3.5" /> Finalize & Ingest</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
