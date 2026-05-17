"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Fingerprint, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { useProductStore } from "@/lib/store";
import { CinematicFrame } from "@/components/ui/CinematicFrame";
import { MonoLabel } from "@/components/ui/MonoLabel";

export function ProductStoryModal({ onOpenAI }: { onOpenAI: () => void }) {
  const { activeProductId, inventory, setActiveProduct, isEditMode, deleteProduct } = useProductStore();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const activeProduct = inventory.find(p => p.id === activeProductId);

  if (!activeProduct) return null;

  const handleDelete = async () => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#0A0A0A] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden relative rounded-sm"
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
                
                {activeProduct.materials.map((step, idx) => (
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
                      <div className="text-sm font-sans text-[#F9F6EE]/90 font-light group-hover:text-white transition-colors leading-snug uppercase tracking-wider">{step}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions Layer */}
            <div className="p-8 bg-[#0A0A0A] border-t border-white/5 flex flex-col gap-4">
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
      </motion.div>
    </AnimatePresence>
  );
}

