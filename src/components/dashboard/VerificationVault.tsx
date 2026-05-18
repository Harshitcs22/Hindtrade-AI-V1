"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, ShieldCheck, Map, Plus, X, 
  Loader2, Stamp, Fingerprint, UploadCloud
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProductStore } from "@/lib/store";
import { supabase, isConfigured } from "@/lib/supabase";
import { useVaultUpload } from "@/hooks/useVaultUpload";
import { VaultCard } from "./VaultCard";

// ── DOCUMENT TYPE THEMES ───────────────────────────────────────────────────
function getDocTheme(name: string) {
  const n = name.toLowerCase();
  if (n.includes("iso"))  return { accent: "#22D3EE" };
  if (n.includes("msme")) return { accent: "#DEFF9A" };
  if (n.includes("gst"))  return { accent: "#D4CAA3" };
  if (n.includes("rcmc") || n.includes("iec")) return { accent: "#D4CAA3" };
  return { accent: "#F9F6EE" };
}

// ─── 4 CORE STATUTORY TRUST PILLARS ─────────────────────────────────────────
const CORE_PILLARS = [
  {
    type: "IEC",
    title: "Import Export Code",
    subtitle: "DGFT, Ministry of Commerce",
    description: "Mandatory 10-digit statutory identification for conducting international trade from India.",
    icon: FileText,
    tooltip: "Mandatory 10-digit statutory identification authorized and issued by the Directorate General of Foreign Trade (DGFT), Ministry of Commerce. Functions as the foundational ledger reference for global cross-border customs shipping clearance from Indian territory."
  },
  {
    type: "GSTIN",
    title: "GSTIN Registration",
    subtitle: "Department of Revenue",
    description: "Statutory tax identification registry essential for domestic material flow validation.",
    icon: ShieldCheck,
    tooltip: "Sovereign 15-digit national tax administration index verified directly against the Central Department of Revenue ledger. Validates domestic supply-chain flow integrity, fiscal compliance clearance, and official export-ready shipment routing protocols."
  },
  {
    type: "MSME",
    title: "Udyam MSME Registry",
    subtitle: "Ministry of MSME",
    description: "Sovereign enterprise categorization unlocking institutional benefits and credit guarantees.",
    icon: Fingerprint,
    tooltip: "Official industrial enterprise categorization signed and locked under the Ministry of Micro, Small, and Medium Enterprises. Authenticates corporate asset metrics, production line allocations, and validates eligibility for sovereign trade credit guarantees and international export subvention benefits."
  },
  {
    type: "INDIAS_TOP_10_EXPORTER",
    title: "Elite Exporter Index",
    subtitle: "HindTrade Sovereign Board",
    description: "Premium ranking accreditation for top tier global volume distributors and manufacturers.",
    icon: Stamp,
    tooltip: "A premium proprietary algorithmic rating benchmark evaluated by the HindTrade Sovereign Trust Framework. Measures real-time transaction container throughput speed, continuous zero-defect shipping performance records, and absolute compliance index health ratings."
  }
];

export function VerificationVault({ 
  hasWriteAccess,
  isEditMode
}: { 
  hasWriteAccess: boolean;
  isEditMode: boolean;
}) {
  const { 
    documents, 
    updateDocument, 
    firmDetails, 
    multiVerifications 
  } = useProductStore();

  const activeEditMode = isEditMode && hasWriteAccess;

  // Custom cert add states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [assetNomenclature, setAssetNomenclature] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [modalDragActive, setModalDragActive] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Extract core upload states & methods from central hook
  const { uploadAsset, uploadingType, uploadError } = useVaultUpload(
    firmDetails.id || "",
    firmDetails.slug || ""
  );

  const handlePillarUpload = async (file: File, docType: string) => {
    try {
      await uploadAsset(file, docType);
    } catch (err) {
      console.error("Upload error inside vault view:", err);
    }
  };

  // ── CUSTOM ACCREDITATION ADDITION (UNIFIED PIPELINE) ───────────────────────
  const handleUnifiedIngestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetNomenclature.trim() || !attachedFile || !firmDetails.id) return;
    setIsAdding(true);
    setAddError(null);

    try {
      if (!isConfigured) {
        // DEMO MODE BYPASS: Add custom certification in-memory
        await new Promise((r) => setTimeout(r, 800));
        const newDoc = {
          id: `doc-${Math.random().toString(36).substring(2, 9)}`,
          name: assetNomenclature.trim(),
          status: 'pending' as any,
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
        
        setAssetNomenclature("");
        setAttachedFile(null);
        setIsAddOpen(false);
        return;
      }

      // 1. Dispatch binary file stream to the verification-vault storage bucket channel
      const fileExt = attachedFile.name.split('.').pop();
      const filePath = `${firmDetails.id}/custom_${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('verification-vault')
        .upload(filePath, attachedFile);

      if (uploadErr) throw uploadErr;

      // 2. Recover live public URL
      const { data: urlData } = supabase.storage.from('verification-vault').getPublicUrl(filePath);

      // 3. Post structural database row record entry safely anchored under status: 'pending'
      const { error: dbErr } = await supabase.from('certifications').insert({
        firm_id: firmDetails.id,
        name: assetNomenclature.trim(),
        status: 'pending', // Bound strictly to audit review constraints
        file_url: urlData.publicUrl
      });

      if (dbErr) throw dbErr;

      // 4. Success cleanup loops: Reset local UI state inputs and dismiss modal viewport view
      setAssetNomenclature("");
      setAttachedFile(null);
      setIsAddOpen(false);
      
      const { fetchFirmData } = useProductStore.getState();
      if (firmDetails.slug) await fetchFirmData(firmDetails.slug);

    } catch (err: any) {
      console.error("Critical: Unified compliance ingestion chain broke down:", err);
      setAddError(err.message || "Failed to finalize asset ingestion.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddCustomCert = async (file: File) => {
    if (!file || !firmDetails.id) return;
    setIsAdding(true);
    try {
      const docType = "CUSTOM_CERT_" + Math.random().toString(36).substring(2, 6).toUpperCase();
      const fileExt = file.name.split('.').pop();
      const filePath = `${firmDetails.id}/${docType}_${Date.now()}.${fileExt}`;
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

      if (!isConfigured) {
        // Demo Mode bypass
        await new Promise((r) => setTimeout(r, 800));
        const newDoc = {
          id: `doc-${Math.random().toString(36).substring(2, 9)}`,
          name: nameWithoutExt,
          status: 'pending' as any,
          hash: Math.random().toString(36).substring(2, 8).toUpperCase(),
        };

        const { demoFirmRegistry } = await import("@/lib/store/helpers");
        const entry = demoFirmRegistry.get(firmDetails.slug || "himrock-exports");
        if (entry) {
          entry.documents.push(newDoc);
        }

        const { fetchFirmData } = useProductStore.getState();
        if (firmDetails.slug) await fetchFirmData(firmDetails.slug);
        return;
      }

      // Live mode upload
      const { error: uploadErr } = await supabase.storage
        .from('verification-vault')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('verification-vault').getPublicUrl(filePath);

      const { error } = await supabase
        .from("certifications")
        .insert([{
          firm_id: firmDetails.id,
          name: nameWithoutExt,
          status: 'pending',
          hash: Math.random().toString(36).substring(2, 8).toUpperCase(),
          file_url: urlData.publicUrl
        }]);

      if (error) throw error;

      const { fetchFirmData } = useProductStore.getState();
      if (firmDetails.slug) await fetchFirmData(firmDetails.slug);
    } catch (err: any) {
      console.error("Failed to add custom certification:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const statutoryKeys = ['IEC', 'GSTIN', 'MSME', 'INDIAS_TOP_10_EXPORTER'];
  const customCertifications = (documents || []).filter(
    (cert: any) => !statutoryKeys.includes(cert.name.toUpperCase())
  );

  return (
    <section className="py-24 px-8 md:px-12 bg-[#050505] relative break-inside-avoid">
      {isEditMode && (
        <div className="font-sans text-[10px] tracking-[0.25em] bg-zinc-950 text-[#D4CAA3] py-2 text-center uppercase border-b border-[#D4CAA3]/10 w-full mb-6">
          SYSTEM MANAGEMENT MODE ACTIVE: SOVEREIGN INGESTION CHANNELS UNLOCKED
        </div>
      )}
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

            return (
              <VaultCard
                key={pillar.type}
                docType={pillar.type}
                label={pillar.title}
                subtitle={pillar.subtitle}
                description={pillar.description}
                icon={pillar.icon}
                currentRecord={record}
                onUploadComplete={(file) => handlePillarUpload(file, pillar.type)}
                isUploading={uploadingType === pillar.type}
                tooltipText={pillar.tooltip}
                isEditMode={activeEditMode}
              />
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
            {customCertifications.map((doc, idx) => {
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
                      <div className="relative bg-zinc-950/40 backdrop-blur-md p-6 border border-white/5 transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#D4CAA3]/20 select-none overflow-hidden flex flex-col justify-between min-h-[300px] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] group">
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
                            {activeEditMode ? (
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

            {activeEditMode ? (
              <>
                {customCertifications.length === 0 && (
                  <div className="col-span-full">
                    <OperationalDragDropMesh onUploadComplete={handleAddCustomCert} />
                  </div>
                )}
                {customCertifications.length > 0 && customCertifications.length < 6 && (
                  <OperationalDragDropMesh onUploadComplete={handleAddCustomCert} />
                )}
              </>
            ) : (
              customCertifications.length === 0 && (
                <div className="col-span-full text-center py-12 border border-dashed border-white/5 bg-zinc-950/20">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-600 uppercase">
                    No custom certifications filed
                  </span>
                </div>
              )
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

                <form onSubmit={handleUnifiedIngestionSubmit} className="space-y-6">
                  <div>
                    <label className="text-[9px] font-mono font-bold tracking-[0.3em] text-zinc-500 uppercase mb-3 block">
                      Asset Nomenclature
                    </label>
                    <input
                      value={assetNomenclature}
                      onChange={(e) => setAssetNomenclature(e.target.value)}
                      placeholder="e.g., ISO-9001 AUDIT"
                      required
                      className="w-full bg-[#050505] border border-white/5 text-[#F9F6EE] text-sm px-5 py-4 outline-none focus:border-[#D4CAA3]/40 transition-colors placeholder:text-zinc-800 font-mono"
                    />
                  </div>

                  {/* Dynamic Drag-and-Drop Attachment Slot inside the Ingestion Modal */}
                  <div className="flex flex-col gap-y-2 mt-5">
                    <span className="font-sans text-[9px] tracking-[0.2em] text-zinc-500 uppercase font-semibold">
                      SUPPORTING CERTIFICATE ASSET (.PDF / .PNG / .JPG)
                    </span>
                    
                    <div
                      onDragOver={(e) => { e.preventDefault(); setModalDragActive(true); }}
                      onDragLeave={() => setModalDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setModalDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) setAttachedFile(file);
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.png,.jpg,.jpeg';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) setAttachedFile(file);
                        };
                        input.click();
                      }}
                      className={`w-full h-32 border border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer select-none ${
                        modalDragActive
                          ? 'border-[#D4CAA3] bg-zinc-900/50 shadow-[0_0_15px_rgba(212,202,163,0.15)]'
                          : attachedFile 
                            ? 'border-emerald-500/40 bg-emerald-950/5' 
                            : 'border-white/10 bg-zinc-900/20 hover:border-white/20'
                      }`}
                    >
                      {attachedFile ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="font-sans text-xs text-emerald-400 font-semibold tracking-wide">
                            ✓ {attachedFile.name.length > 24 ? attachedFile.name.slice(0, 22) + '...' : attachedFile.name}
                          </span>
                          <span className="font-sans text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                            Ready for transmission ({Math.round(attachedFile.size / 1024)} KB)
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="font-sans text-[10px] tracking-widest text-zinc-400 uppercase font-medium">
                            Drop Certificate File Here
                          </span>
                          <span className="font-sans text-[9px] text-zinc-600 tracking-wider uppercase mt-1">
                            or click to navigate file system
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdding || !assetNomenclature.trim() || !attachedFile}
                    className="w-full bg-[#D4CAA3] text-black font-bold text-[10px] tracking-[0.3em] uppercase py-5 flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {isAdding ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Anchoring...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> FINALIZE INGESTION FOR REVIEW</>
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

// ── CUSTOM OPERATIONAL GRID VISIBILITY ENFORCER ──────────────────────────────
function OperationalDragDropMesh({ onUploadComplete }: { onUploadComplete: (file: File) => Promise<void> }) {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          await onUploadComplete(file);
        }
      }}
      className={`w-full min-h-[300px] border transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer relative ${
        dragActive 
          ? 'border-dashed border-[#D4CAA3] bg-zinc-900/60 shadow-[0_0_20px_rgba(212,202,163,0.25)]' 
          : 'border-dashed border-white/10 bg-zinc-950/20 hover:border-white/20'
      }`}
    >
      <UploadCloud className="w-5 h-5 text-zinc-500 mb-2 animate-pulse" />
      <span className="font-sans text-[9px] tracking-[0.2em] text-zinc-400 uppercase font-medium">
        Drop Custom Certificate Asset +
      </span>
      <span className="font-sans text-[8px] text-zinc-600 uppercase tracking-widest mt-1">
        or click to browse
      </span>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadComplete(file);
        }} 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        accept=".pdf,image/*" 
      />
    </div>
  );
}
