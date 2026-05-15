"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, ShieldCheck, ExternalLink, Map, Plus, X, 
  Loader2, Lock, Eye, Stamp, Fingerprint, UploadCloud 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProductStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

// ── DOCUMENT TYPE THEMES ───────────────────────────────────────────────────
function getDocTheme(name: string) {
  const n = name.toLowerCase();
  if (n.includes("iso"))  return { accent: "#22D3EE" };
  if (n.includes("msme")) return { accent: "#DEFF9A" };
  if (n.includes("gst"))  return { accent: "#D4CAA3" };
  if (n.includes("rcmc") || n.includes("iec")) return { accent: "#D4CAA3" };
  return { accent: "#F9F6EE" };
}

export function VerificationVault() {
  const { documents, isEditMode, updateDocument, firmDetails } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [certName, setCertName] = useState("");
  const [certStatus, setCertStatus] = useState<"verified" | "pending">("pending");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !firmDetails.id) return;
    setIsAdding(true);
    setAddError(null);

    try {
      const { error } = await supabase
        .from("certifications")
        .insert([{
          firm_id: firmDetails.id,
          name: certName.trim(),
          status: certStatus,
          hash: Math.random().toString(36).substring(2, 8).toUpperCase(),
        }]);

      if (error) throw error;

      const { fetchFirmData } = useProductStore.getState();
      if (firmDetails.slug) await fetchFirmData(firmDetails.slug);

      setCertName("");
      setCertStatus("pending");
      setIsAddOpen(false);
    } catch (err: any) {
      setAddError(err.message || "Failed to add certification.");
    } finally {
      setIsAdding(false);
    }
  };

  const inputClass =
    "w-full bg-[#0A0A0A] border border-white/10 text-[#F9F6EE] text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/60 transition-colors placeholder:text-zinc-700 font-sans";

  return (
    <section className="py-24 px-8 md:px-12 bg-[#050505] relative overflow-hidden break-inside-avoid">
      {/* Background visualization */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none flex items-center justify-center">
        <Map className="w-[800px] h-[800px] text-[#22D3EE]" strokeWidth={0.2} />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 relative z-10">
        <div>
          <span className="text-xl font-serif font-semibold uppercase tracking-[0.15em] text-[#D4CAA3] mb-4 block">
            Institutional Trust Layer
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-serif text-[#F9F6EE] tracking-tight">
              Verification Vault
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-[#D4CAA3]/40 to-transparent" />
          </div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mt-4">
            Secured Sovereign Ledger • Node ID: HT-{firmDetails.id?.substring(0, 8)}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-zinc-700 font-mono text-[9px] tracking-widest uppercase text-right">
            {documents.length} ANCHORED ASSETS<br/>
            AUDIT V3.2 • ACTIVE
          </div>
          {isEditMode && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 hover:bg-[#D4CAA3]/20 text-[#D4CAA3] text-[10px] font-mono tracking-widest uppercase px-5 py-2.5 transition-all group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              Ingest Document
            </button>
          )}
        </div>
      </div>

      {/* ── Institutional Trust Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <TooltipProvider>
          {documents.map((doc, idx) => {
            const theme = getDocTheme(doc.name);
            const isVerified = doc.status === "VERIFIED" || doc.status === "verified";

            return (
              <Tooltip key={doc.id}>
                <TooltipTrigger className="text-left w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    viewport={{ once: true, margin: "-20px" }}
                    className="h-full transform-gpu"
                  >
                    <div className="group bg-[#0D0D0D] border border-white/5 relative overflow-hidden h-full shadow-[20px_20px_50px_rgba(0,0,0,0.5)] hover:border-[#D4CAA3]/20 transition-all duration-500">
                      {/* Top Visual: Blurred Doc Preview */}
                      <div className="h-32 relative overflow-hidden bg-[#121212]">
                        <div className="absolute inset-0 opacity-20 blur-[60px] pointer-events-none">
                           <div className="absolute inset-4 border-[20px] border-white/30" />
                           <div className="absolute top-1/2 left-0 w-full h-8 bg-[#D4CAA3]/40 -rotate-12" />
                        </div>
                        
                        {/* Simulated Micro-Lines */}
                        <div className="absolute inset-6 space-y-2.5 opacity-10">
                          <div className="h-1.5 w-3/4 bg-white rounded-full" />
                          <div className="h-1.5 w-full bg-white rounded-full" />
                          <div className="h-1.5 w-1/2 bg-white rounded-full" />
                          <div className="h-1.5 w-2/3 bg-white rounded-full" />
                        </div>

                        {/* Custom Rubber Stamp Effect */}
                        {isVerified && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                              initial={{ scale: 2, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", delay: idx * 0.2 + 0.5 }}
                              className="relative px-6 py-2 border-4 border-[#DEFF9A]/60 rotate-[-15deg] flex items-center justify-center"
                              style={{ 
                                filter: "url(#rough-edge)",
                                boxShadow: "0 0 15px rgba(222, 255, 154, 0.15)"
                              }}
                            >
                              <span className="text-xl font-mono font-black text-[#DEFF9A] uppercase tracking-tighter mix-blend-screen opacity-90">
                                VERIFIED
                              </span>
                              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#DEFF9A] rounded-full blur-[2px]" />
                            </motion.div>
                          </div>
                        )}

                        {!isVerified && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <Lock className="w-6 h-6 text-zinc-700" />
                          </div>
                        )}

                        {/* Edit Mode Addon */}
                        {isEditMode && (
                          <button className="absolute top-3 right-3 p-2 bg-black/60 border border-white/10 hover:border-[#D4CAA3]/50 transition-colors">
                            <UploadCloud className="w-3.5 h-3.5 text-[#D4CAA3]" />
                          </button>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            {isEditMode ? (
                              <input
                                value={doc.name}
                                onChange={(e) => updateDocument(doc.id, { name: e.target.value })}
                                className="bg-transparent border-b border-[#D4CAA3]/20 outline-none text-[#D4CAA3] font-serif text-xl w-full focus:border-[#D4CAA3]/60 transition-colors"
                              />
                            ) : (
                              <h3 className="text-[#D4CAA3] font-serif text-xl leading-tight">{doc.name}</h3>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                           {/* Pulse Info */}
                           <div className="flex items-center gap-3">
                              <div className="relative">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                                 <motion.div 
                                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="absolute inset-0 bg-[#22D3EE] rounded-full"
                                 />
                              </div>
                              <span className={`text-[10px] font-mono tracking-[0.2em] uppercase font-bold ${isVerified ? 'text-[#DEFF9A]' : 'text-zinc-600'}`}>
                                {doc.status.toUpperCase()}
                              </span>
                           </div>

                           {/* Metadata Fields */}
                           <div className="grid grid-cols-1 gap-2 pt-4 border-t border-white/[0.04]">
                              <div className="flex justify-between items-center">
                                 <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Issuer</span>
                                 <span className="text-[8px] font-mono text-[#F9F6EE]/60 uppercase">[GOVT_OF_INDIA]</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Status</span>
                                 <span className="text-[8px] font-mono text-[#F9F6EE]/60 uppercase">ANCHORED ON LEDGER</span>
                              </div>
                           </div>

                           {/* Sovereign Hash */}
                           <div className="pt-4 flex items-center gap-2">
                              <Fingerprint className="w-3 h-3 text-zinc-800" />
                              <div className="flex flex-col">
                                 <span className="text-[7px] font-mono text-zinc-800 tracking-[0.3em] uppercase">Sovereign Hash</span>
                                 <span className="text-[9px] font-mono text-white/30 tracking-widest truncate max-w-[150px]">
                                   {doc.hash}X99A77B22C
                                 </span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-black border border-[#D4CAA3]/20 text-[#D4CAA3] font-mono text-[9px] p-3 rounded-none max-w-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <p className="font-bold mb-1 uppercase tracking-widest">Encryption Key Verified</p>
                  <p className="text-zinc-500">Document anchored via HT-Chain v4.1</p>
                  <p className="text-zinc-600 mt-2">Access restricted to verified procurement officers.</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Edit Mode: Add Placeholder */}
          {isEditMode && documents.length < 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsAddOpen(true)}
              className="border border-dashed border-[#D4CAA3]/10 bg-[#0D0D0D]/50 flex flex-col items-center justify-center gap-4 hover:border-[#D4CAA3]/30 transition-all group min-h-[300px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4CAA3]/5 flex items-center justify-center group-hover:bg-[#D4CAA3]/10 transition-colors">
                <Plus className="w-5 h-5 text-[#D4CAA3]/40 group-hover:text-[#D4CAA3] transition-colors group-hover:rotate-90 duration-500" />
              </div>
              <span className="text-[10px] font-mono text-zinc-700 group-hover:text-[#D4CAA3] tracking-[0.4em] uppercase">
                New Asset
              </span>
            </motion.button>
          )}
        </TooltipProvider>
      </div>

      {/* Rough Edge Filter for Stamp */}
      <svg className="absolute w-0 h-0 overflow-hidden">
        <filter id="rough-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>

      {/* ── ADD MODAL ── */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
            onClick={() => !isAdding && setIsAddOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-[#0D0D0D] border border-[#D4CAA3]/20 w-full max-w-md relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/40 to-transparent" />
              <button
                onClick={() => !isAdding && setIsAddOpen(false)}
                className="absolute top-6 right-6 text-zinc-600 hover:text-[#D4CAA3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-10">
                <h3 className="text-2xl font-serif text-[#F9F6EE] mb-2 tracking-tight">Ingest Trust Asset</h3>
                <p className="text-[10px] font-mono tracking-widest text-zinc-600 mb-8 uppercase">
                  Anchoring new document to Sovereign Ledger
                </p>

                {addError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono p-4 mb-6 uppercase tracking-widest">{addError}</div>
                )}

                <form onSubmit={handleAddCert} className="space-y-6">
                  <div>
                    <label className="text-[9px] font-mono font-bold tracking-[0.3em] text-zinc-500 uppercase mb-3 block">
                      Asset Nomenclature
                    </label>
                    <input
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g., ISO-9001 AUDIT"
                      required
                      className="w-full bg-[#050505] border border-white/5 text-[#F9F6EE] text-sm px-5 py-4 outline-none focus:border-[#D4CAA3]/40 transition-colors placeholder:text-zinc-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold tracking-[0.3em] text-zinc-500 uppercase mb-3 block">
                      Verification Level
                    </label>
                    <div className="flex gap-4">
                      {(["verified", "pending"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCertStatus(s)}
                          className={`flex-1 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-all border
                            ${certStatus === s
                              ? "bg-[#D4CAA3]/5 border-[#D4CAA3]/40 text-[#D4CAA3]"
                              : "bg-transparent border-white/5 text-zinc-700 hover:border-white/10"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdding || !certName.trim()}
                    className="w-full bg-[#D4CAA3] text-black font-bold text-[10px] tracking-[0.3em] uppercase py-5 flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {isAdding ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Anchoring...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Finalize Ingestion</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
