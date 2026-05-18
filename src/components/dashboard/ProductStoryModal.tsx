"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Fingerprint, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { useProductStore } from "@/lib/store";
import { CinematicFrame } from "@/components/ui/CinematicFrame";
import { MonoLabel } from "@/components/ui/MonoLabel";

export function ProductStoryModal({ onOpenAI, onSeeHsnAudit }: { onOpenAI: () => void; onSeeHsnAudit: (product: any) => void }) {
  const { activeProductId, inventory, setActiveProduct, isEditMode, deleteProduct } = useProductStore();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const activeProduct = inventory.find(p => p.id === activeProductId);

  React.useEffect(() => {
    if (activeProduct) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeProduct]);

  if (!activeProduct) return null;

  const handleDelete = async () => {
    if (!activeProduct.id) {
      console.error("Aborting deletion: Execution context missing valid target UUID token.");
      return;
    }

    const confirmed = confirm(
      `SOVEREIGN PROTOCOL: PERMANENT ASSET DECOMMISSIONING\n\n` +
      `You are about to remove ${activeProduct.name.toUpperCase()} (HSN: ${activeProduct.hsn}) from the active digital inventory.\n\n` +
      `THIS ACTION IS IRREVERSIBLE AND WILL BE LOGGED ON THE INSTITUTIONAL LEDGER.\n\n` +
      `Proceed with decommissioning?`
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteProduct(activeProduct.id);
        setActiveProduct(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] w-screen h-screen flex items-center justify-center overflow-hidden">
        
        {/* High-Gloss Matte Black Backdrop Shield */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300 pointer-events-auto"
          onClick={() => setActiveProduct(null)} 
        />

        {/* Centered Modal Workspace Core Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-y-auto bg-zinc-950 border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] rounded-none transition-transform duration-300 scale-100"
        >
          {/* Close Button */}
          <button 
            onClick={() => setActiveProduct(null)}
            className="absolute top-6 right-6 z-[160] w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#D4CAA3] text-white hover:text-black border border-white/10 transition-all rounded-full group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>

          {/* Left Side: Product Showcase */}
          <div className="w-full md:w-3/5 h-1/2 md:h-full relative border-b md:border-b-0 md:border-r border-white/5 bg-black">
            <CinematicFrame className="w-full h-full">
              <motion.img 
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent p-12 flex flex-col justify-end">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-3">
                    <MonoLabel variant="gold" className="px-3 py-1 border border-[#D4CAA3]/30 text-xs bg-black/80">
                      HSN {activeProduct.hsn}
                    </MonoLabel>
                    <div className="flex items-center gap-2 text-[#D4CAA3] text-[10px] tracking-widest uppercase font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Statutory Compliant
                    </div>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-serif text-[#F9F6EE] leading-tight tracking-tighter">
                    {activeProduct.name}
                  </h2>
                </div>
              </div>
            </CinematicFrame>
          </div>

          {/* Right Side: Narrative & AI */}
          <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col bg-[#0D0D0D]">
            <div className="p-10 md:p-12 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border border-[#D4CAA3]/20 flex items-center justify-center">
                   <Fingerprint className="w-5 h-5 text-[#D4CAA3]" />
                </div>
                <h3 className="text-[10px] tracking-[0.4em] font-sans text-[#D4CAA3] uppercase font-black">
                  Traceability Narrative
                </h3>
              </div>
              
              <p className="text-xs text-zinc-500 font-light leading-relaxed mb-12 border-l border-[#D4CAA3]/20 pl-6 italic">
                Our Traceability Narrative provides a cryptographically secured audit trail of this asset's physical journey—from raw material sourcing to final export-ready QC.
              </p>

              <div className="space-y-10 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#D4CAA3]/40 to-transparent" />
                
                {(activeProduct.materials || []).map((step: any, idx: number) => {
                  const textToDisplay = typeof step === 'string' 
                    ? step 
                    : step && typeof step === 'object' && 'name' in step 
                      ? step.name 
                      : '';

                  if (!textToDisplay) return null;

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      viewport={{ once: true }}
                      className="relative pl-12 group"
                    >
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full border border-[#D4CAA3]/30 bg-[#0D0D0D] flex items-center justify-center z-10 group-hover:border-[#D4CAA3] transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4CAA3]" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-[#D4CAA3]/50 mb-2 tracking-widest">MILESTONE 0{idx + 1}</div>
                        <div className="text-sm font-sans text-[#F9F6EE]/90 font-light group-hover:text-white transition-colors leading-snug uppercase tracking-wider">{textToDisplay}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sovereign Trade & Logistics Ledger */}
              <div className="mt-8 pt-6 border-t border-white/5 text-left">
                <h3 className="font-sans text-[9px] tracking-[0.25em] text-zinc-500 uppercase font-bold mb-4">
                  ARTICLE IV - GLOBAL PROCUREMENT PARAMETERS
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1: Financial & Terms */}
                  <div className="space-y-3 p-3.5 bg-zinc-900/40 border border-white/5">
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">INCOTERMS RULE</span>
                      <span className="font-sans text-xs text-white font-medium">{activeProduct.trade_terms?.incoterms || "FOB Jalandhar"}</span>
                    </div>
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">MINIMUM ORDER QUANTITY (MOQ)</span>
                      <span className="font-sans text-xs text-white font-medium">{activeProduct.trade_terms?.moq || "500 Units"}</span>
                    </div>
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">PAYMENT / CREDIT SECURITY</span>
                      <span className="font-sans text-xs text-[#D4CAA3] font-medium">{activeProduct.trade_terms?.payment_terms || "Irrevocable L/C 60 Days"}</span>
                    </div>
                  </div>

                  {/* Column 2: Maritime Logistics */}
                  <div className="space-y-3 p-3.5 bg-zinc-900/40 border border-white/5">
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">PORT OF LOADING (ORIGIN)</span>
                      <span className="font-sans text-xs text-white font-medium">{activeProduct.trade_terms?.port_of_loading || "Mundra Port (INMUN1)"}</span>
                    </div>
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">LOGISTICS HANDLING CARRIER</span>
                      <span className="font-sans text-xs text-white font-medium">{activeProduct.trade_terms?.logistics_partner || "DHL Forwarding / Maersk"}</span>
                    </div>
                    <div>
                      <span className="block font-sans text-[8px] text-zinc-500 tracking-wider uppercase">MANUFACTURING LEAD TIME</span>
                      <span className="font-sans text-xs text-white font-medium">{activeProduct.trade_terms?.lead_time_days || "45"} Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Layer */}
            <div className="p-8 bg-[#0A0A0A] border-t border-white/5 flex flex-col gap-4">
              {/* Elite GRI Audit Vault Activation Node */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSeeHsnAudit(activeProduct);
                }}
                className="w-full py-3 mb-3 bg-zinc-950 border border-[#D4CAA3]/40 text-[#D4CAA3] font-sans text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#D4CAA3] hover:text-black hover:shadow-[0_0_15px_rgba(212,202,163,0.3)] transition-all duration-300"
              >
                🔍 VIEW FULL HSN COMPLIANCE AUDIT TRACE
              </button>

              <button 
                onClick={onOpenAI}
                className="w-full group relative overflow-hidden bg-white text-black font-bold tracking-[0.2em] text-xs py-5 px-8 uppercase flex items-center justify-center gap-3 transition-all hover:bg-[#D4CAA3]"
              >
                <Search className="w-4 h-4" />
                Inquire with Sales Head
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </button>

              {isEditMode && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-500/5 border border-red-500/20 text-red-500/60 font-mono text-[10px] tracking-[0.3em] py-4 uppercase flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group/del"
                >
                  {isDeleting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> DECOMMISSIONING...</>
                  ) : (
                    <><Trash2 className="w-3.5 h-3.5" /> Decommission Asset</>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

