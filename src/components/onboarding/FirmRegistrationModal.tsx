"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, CheckCircle, Building2 } from "lucide-react";
import { useProductStore } from "@/lib/store";

export function FirmRegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { createFirm } = useProductStore();
  const [firmName, setFirmName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedSlug = firmName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const slug = await createFirm(firmName.trim());
      if (slug) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/${slug}`);
        }, 2000);
      } else {
        setError("Failed to register. The firm name may already be taken.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFirmName("");
      setError(null);
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0A0A0A] border border-[#D4CAA3]/20 w-full max-w-lg relative overflow-hidden shadow-[0_0_80px_rgba(212,202,163,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/60 to-transparent" />

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-zinc-600 hover:text-[#D4CAA3] transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10">
              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#D4CAA3]/10 border border-[#D4CAA3]/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#D4CAA3]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-[#F9F6EE] tracking-tight">
                        Register Your Firm
                      </h3>
                      <p className="text-[9px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase">
                        Sovereign Identity Protocol
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-light mt-4 mb-8 leading-relaxed">
                    Initialize your sovereign terminal on the HindTrade
                    network. Your unique dashboard will be deployed at{" "}
                    <span className="text-[#D4CAA3] font-mono">
                      /dashboard/{generatedSlug || "your-firm"}
                    </span>
                  </p>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-6 font-mono">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-3">
                        Firm / Organization Name
                      </label>
                      <input
                        type="text"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        placeholder="e.g., Akshays Exports"
                        required
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                      {firmName.trim() && (
                        <div className="mt-2 text-[10px] font-mono text-zinc-600">
                          SLUG:{" "}
                          <span className="text-[#D4CAA3]">
                            {generatedSlug}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!firmName.trim() || isSubmitting}
                      className="w-full bg-[#D4CAA3] text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deploying Sovereign Terminal...
                        </>
                      ) : (
                        <>
                          Register & Deploy
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="py-8 flex flex-col items-center text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                    }}
                    className="w-16 h-16 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#D4CAA3]" />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif text-[#F9F6EE]">
                      Sovereign Terminal Deployed
                    </h4>
                    <p className="text-xs text-zinc-500 font-mono">
                      Redirecting to{" "}
                      <span className="text-[#D4CAA3]">
                        /dashboard/{generatedSlug}
                      </span>
                    </p>
                  </div>
                  <div className="text-[10px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase animate-pulse">
                    Initializing Agent Ekayan...
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
