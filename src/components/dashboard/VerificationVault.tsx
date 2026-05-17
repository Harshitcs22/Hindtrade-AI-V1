"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, ShieldCheck, ExternalLink, Map, Plus, X, 
  Loader2, Lock, Eye, Stamp, Fingerprint, UploadCloud, AlertTriangle 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProductStore } from "@/lib/store";
import { supabase, isConfigured } from "@/lib/supabase";
import { Verification } from "@/types/supabase";

// ── DOCUMENT TYPE THEMES ───────────────────────────────────────────────────
function getDocTheme(name: string) {
  const n = name.toLowerCase();
  if (n.includes("iso"))  return { accent: "#22D3EE" };
  if (n.includes("msme")) return { accent: "#DEFF9A" };
  if (n.includes("gst"))  return { accent: "#D4CAA3" };
  if (n.includes("rcmc") || n.includes("iec")) return { accent: "#D4CAA3" };
  return { accent: "#F9F6EE" };
}

// ─── 4 CORE INSTITUTIONAL TRUST PILLARS ─────────────────────────────────────
const CORE_PILLARS = [
  {
    type: "IEC",
    title: "Import Export Code",
    subtitle: "DGFT, Ministry of Commerce",
    description: "Mandatory 10-digit statutory identification for conducting international trade from India.",
    icon: FileText,
  },
  {
    type: "GSTIN",
    title: "GSTIN Registration",
    subtitle: "Department of Revenue",
    description: "Statutory tax identification registry essential for domestic material flow validation.",
    icon: ShieldCheck,
  },
  {
    type: "MSME",
    title: "Udyam MSME Registry",
    subtitle: "Ministry of MSME",
    description: "Sovereign enterprise categorization unlocking institutional benefits and credit guarantees.",
    icon: Fingerprint,
  },
  {
    type: "INDIAS_TOP_10_EXPORTER",
    title: "Elite Exporter Index",
    subtitle: "HindTrade Sovereign Board",
    description: "Premium ranking accreditation for top tier global volume distributors and manufacturers.",
    icon: Stamp,
  }
];

export function VerificationVault() {
  const { 
    documents, 
    isEditMode, 
    updateDocument, 
    firmDetails, 
    multiVerifications 
  } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [certName, setCertName] = useState("");
  const [certStatus, setCertStatus] = useState<"verified" | "pending">("pending");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Pillar Upload States
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── CORE PILLAR FILE UPLOAD & DISPATCH ─────────────────────────────────────
  const handlePillarUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !firmDetails.id) return;
    setUploadingType(docType);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${firmDetails.id}/${docType}_${Date.now()}.${fileExt}`;

      if (!isConfigured) {
        // DEMO MODE BYPASS: Simulate secure upload in local store state
        await new Promise((r) => setTimeout(r, 1200));
        
        const newRecord: Verification = {
          id: `demo-ver-${Date.now()}`,
          firm_id: firmDetails.id,
          document_type: docType,
          document_url: 'https://placeholder.supabase.co/mock-doc.pdf',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Append to multiVerifications in Zustand store
        const currentVers = useProductStore.getState().multiVerifications || [];
        useProductStore.setState({ 
          multiVerifications: [...currentVers.filter(v => v.document_type !== docType), newRecord] 
        });
        
        setUploadingType(null);
        return;
      }

      // Live mode storage upload
      const { error: uploadErr } = await supabase.storage
        .from('verification-vault')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('verification-vault').getPublicUrl(filePath);

      // Check if this document type already exists
      const existing = multiVerifications?.find(v => v.document_type === docType);
      
      if (existing) {
        const { error: dbErr } = await supabase
          .from('verifications')
          .update({
            document_url: urlData.publicUrl,
            status: 'PENDING',
            comments: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase
          .from('verifications')
          .insert({
            firm_id: firmDetails.id,
            document_type: docType,
            document_url: urlData.publicUrl,
            status: 'PENDING'
          });

        if (dbErr) throw dbErr;
      }

      // Trigger store refresh to update UI state
      const { fetchDashboardData } = useProductStore.getState();
      if (firmDetails.slug) {
        await fetchDashboardData(firmDetails.slug);
      }

    } catch (err: any) {
      console.error('Core pillar upload failure:', err);
      setUploadError(err.message || 'Verification upload rejected by security policies.');
    } finally {
      setUploadingType(null);
    }
  };

  // ── CUSTOM ACCREDITATION ADDITION ──────────────────────────────────────────
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !firmDetails.id) return;
    setIsAdding(true);
    setAddError(null);

    try {
      if (!isConfigured) {
        // DEMO MODE BYPASS: Add custom certification in-memory
        await new Promise((r) => setTimeout(r, 600));
        const newDoc = {
          id: `doc-${Math.random().toString(36).substring(2, 9)}`,
          name: certName.trim(),
          status: certStatus.toUpperCase() as any,
          hash: Math.random().toString(36).substring(2, 8).toUpperCase(),
        };
        
        const { demoFirmRegistry } = await import("@/lib/store/helpers");
        const entry = demoFirmRegistry.get(firmDetails.slug || "himrock-exports");
        if (entry) {
          entry.documents.push(newDoc);
        }
        
        // Refresh local store details
        const { fetchFirmData } = useProductStore.getState();
        if (firmDetails.slug) await fetchFirmData(firmDetails.slug);
        
        setCertName("");
        setCertStatus("pending");
        setIsAddOpen(false);
        return;
      }

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
            Secured Sovereign Ledger • Node ID: HT-{firmDetails.id?.substring(0, 8) || "SANDBOX"}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-zinc-700 font-mono text-[9px] tracking-widest uppercase text-right">
            {(multiVerifications?.length || 0) + documents.length} ANCHORED ASSETS<br/>
            AUDIT V3.2 • ACTIVE
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 mb-8 font-mono max-w-7xl mx-auto uppercase tracking-widest">
          SYSTEM ERROR: {uploadError}
        </div>
      )}

      {/* ── SECTION 1: STATUTORY CORE TRUST PILLARS ──────────────────────────── */}
      <div className="mb-16 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#D4CAA3] uppercase">
            01 / STATUTORY COMPLIANCE DESK
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {CORE_PILLARS.map((pillar) => {
            const record = multiVerifications?.find(v => v.document_type === pillar.type);
            const PillarIcon = pillar.icon;
            
            // Calculate state conditions
            const hasRecord = record && record.document_url;
            const isVerified = hasRecord && (record.status === "APPROVED" || (record.status as any) === "verified");
            const isPending = hasRecord && (record.status === "PENDING" || record.status === "UNDER_REVIEW");
            const isRejected = hasRecord && (record.status === "REJECTED" || (record.status as any) === "FAILED");

            return (
              <div 
                key={pillar.type}
                className="relative bg-zinc-950/40 backdrop-blur-md p-6 md:p-8 border border-white/5 transition-all duration-300 ease-out hover:scale-[1.03] hover:border-zinc-700/40 select-none overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] group"
              >
                {/* Visual Stamp Overlay (Approved State) */}
                {isVerified && (
                  <div className="absolute top-4 right-4 border-2 border-[#22D3EE]/60 bg-[#22D3EE]/5 text-[#22D3EE] font-serif text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 -rotate-12 skew-x-3 shadow-[0_0_15px_rgba(34,211,238,0.15)] pointer-events-none z-10">
                    Verified
                  </div>
                )}

                <div>
                  {/* Top line with category / status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                      <PillarIcon className="w-5 h-5 text-[#D4CAA3] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {hasRecord && (
                      <a 
                        href={record.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-500 hover:text-[#D4CAA3] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Title info */}
                  <h3 className="text-[#F9F6EE] font-serif text-xl tracking-tight mb-1">{pillar.title}</h3>
                  <p className="text-[9px] font-mono tracking-widest text-[#D4CAA3] uppercase mb-4">{pillar.subtitle}</p>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6">{pillar.description}</p>
                </div>

                <div>
                  {/* Visual variants baselines */}
                  {!hasRecord ? (
                    // STATE V1: NO ASSET FOUND (THE INGESTION SLOT)
                    <div className="border border-dashed border-white/10 bg-zinc-950/20 p-5 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/10 transition-all relative">
                      {uploadingType === pillar.type ? (
                        <div className="flex items-center gap-2 text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ingesting...
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-zinc-700 mb-2 group-hover:text-[#D4CAA3] transition-colors" />
                          <span className="font-sans text-[9px] tracking-widest text-zinc-500 uppercase font-bold group-hover:text-zinc-400 transition-colors">
                            Deploy Document Asset +
                          </span>
                        </>
                      )}
                      <input 
                        type="file" 
                        disabled={uploadingType === pillar.type}
                        onChange={(e) => handlePillarUpload(e, pillar.type)} 
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                        accept=".pdf,image/*" 
                      />
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-white/[0.04] space-y-3">
                      {/* STATE V2: PENDING REVIEW */}
                      {isPending && (
                        <div className="flex items-center gap-2 font-sans text-[9px] tracking-widest text-amber-500 uppercase font-semibold animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Under Institutional Audit Review
                        </div>
                      )}

                      {/* STATE V3: APPROVED COMPLIANCE DETAILS */}
                      {isVerified && (
                        <div className="flex items-center gap-2 font-sans text-[9px] tracking-widest text-[#DEFF9A] uppercase font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#DEFF9A]" />
                          Statutory Ledger Anchored
                        </div>
                      )}

                      {/* STATE V4: REJECTED COMPLIANCE TRACE */}
                      {isRejected && (
                        <div className="bg-red-500/5 border border-red-500/10 p-3">
                          <div className="flex items-center gap-1.5 text-red-500 font-sans text-[9px] tracking-widest uppercase font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Audit Action Required
                          </div>
                          <p className="text-red-400 font-sans text-[9px] tracking-wider uppercase mt-1 leading-normal">
                            Audit Failed: {record.comments || "Invalid Credentials"}
                          </p>
                          {/* Reupload capability */}
                          <div className="mt-3 relative">
                            <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[8px] tracking-widest uppercase py-2 border border-red-500/20 transition-all">
                              Upload Corrective Asset ⟳
                            </button>
                            <input 
                              type="file" 
                              onChange={(e) => handlePillarUpload(e, pillar.type)} 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept=".pdf,image/*" 
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                        <span>LEDGER ID</span>
                        <span className="text-zinc-600">HT-{record.id?.substring(0, 8)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: OPERATIONAL CUSTOM CERTIFICATIONS & ISOs ──────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#D4CAA3] uppercase">
              02 / OPERATIONAL & CUSTOM CERTIFICATIONS
            </span>
            <div className="h-px flex-1 bg-white/5" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
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
                      <div className="relative bg-zinc-950/40 backdrop-blur-md p-6 md:p-8 border border-white/5 transition-all duration-300 ease-out hover:scale-[1.03] hover:border-zinc-700/40 select-none overflow-hidden flex flex-col justify-between min-h-[300px] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] group">
                        {/* Custom Rubber Stamp Effect */}
                        {isVerified && (
                          <div className="absolute top-4 right-4 border-2 border-[#DEFF9A]/60 bg-[#DEFF9A]/5 text-[#DEFF9A] font-serif text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 -rotate-12 skew-x-3 shadow-[0_0_15px_rgba(222,255,154,0.15)] pointer-events-none z-10">
                            Verified
                          </div>
                        )}

                        <div>
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#D4CAA3]" />
                            </div>
                          </div>

                          <div className="mb-4">
                            {isEditMode ? (
                              <input
                                value={doc.name}
                                onChange={(e) => updateDocument(doc.id, { name: e.target.value })}
                                className="bg-transparent border-b border-[#D4CAA3]/20 outline-none text-[#D4CAA3] font-serif text-xl w-full focus:border-[#D4CAA3]/60 transition-colors"
                              />
                            ) : (
                              <h3 className="text-[#F9F6EE] font-serif text-xl tracking-tight leading-tight">{doc.name}</h3>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                              <motion.div 
                                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-[#22D3EE] rounded-full"
                              />
                            </div>
                            <span className={`text-[9px] font-mono tracking-[0.2em] uppercase font-bold ${isVerified ? 'text-[#DEFF9A]' : 'text-zinc-600'}`}>
                              {doc.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-4 border-t border-white/[0.04]">
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                              <span>Issuer</span>
                              <span>[GOVT_OF_INDIA]</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                              <span>Node Hash</span>
                              <span className="truncate max-w-[80px]">{doc.hash}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border border-[#D4CAA3]/20 text-[#D4CAA3] font-mono text-[9px] p-3 rounded-none max-w-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <p className="font-bold mb-1 uppercase tracking-widest">Encryption Key Verified</p>
                    <p className="text-zinc-500">Document anchored via HT-Chain v4.1</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {isEditMode && documents.length < 6 && (
              <button
                onClick={() => setIsAddOpen(true)}
                className="border border-dashed border-[#D4CAA3]/10 bg-[#0D0D0D]/50 flex flex-col items-center justify-center gap-4 hover:border-[#D4CAA3]/30 transition-all group min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#D4CAA3]/5 flex items-center justify-center group-hover:bg-[#D4CAA3]/10 transition-colors">
                  <Plus className="w-5 h-5 text-[#D4CAA3]/40 group-hover:text-[#D4CAA3] transition-colors group-hover:rotate-90 duration-500" />
                </div>
                <span className="text-[10px] font-mono text-zinc-700 group-hover:text-[#D4CAA3] tracking-[0.4em] uppercase">
                  New Asset
                </span>
              </button>
            )}
          </TooltipProvider>
        </div>
      </div>

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
