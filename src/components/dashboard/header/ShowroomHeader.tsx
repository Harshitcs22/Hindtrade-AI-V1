"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings2,
  ShieldCheck,
  CheckCircle2,
  ImageIcon,
  X,
  AlertTriangle,
  ChevronRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useProductStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { VerificationBadges } from "../VerificationBadges";
import { ReadinessGauge } from "./ReadinessGauge";
import { ComplianceStrip } from "./ComplianceStrip";
import { IdentitySection } from "./IdentitySection";
import { ActionDeck } from "./ActionDeck";

function calcReadiness(
  iec_status: string,
  inventoryCount: number,
  trust_score: number,
  docCount: number
): { score: number; missing: string[] } {
  let score = 0;
  const missing: string[] = [];

  if (iec_status === "VERIFIED") score += 25;
  else missing.push("IEC Registration - not yet verified");

  if (inventoryCount > 0) score += 25;
  else missing.push("Add at least 1 product to the Digital Inventory");

  if (trust_score >= 60) score += 35;
  else missing.push(`Complete firm profile - current trust: ${trust_score}%`);

  if (docCount >= 2) score += 15;
  else missing.push(`Verification Vault - needs ${2 - docCount} more certificate(s)`);

  return { score: Math.min(score, 100), missing };
}

export function ShowroomHeader({ onOpenAI }: { onOpenAI?: () => void }) {
  const {
    isEditMode,
    toggleEditMode,
    firmDetails,
    updateProfileStats,
    inventory,
    documents,
    multiFirm,
    multiVerifications,
  } = useProductStore();

  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isPendingMutation, setIsPendingMutation] = useState(false);
  const mutationQueueRef = useRef<Array<{ field: string; value: string }>>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showCompliance, setShowCompliance] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
  );
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { score: readiness, missing: complianceGaps } = calcReadiness(
    firmDetails.iec_status,
    inventory.length,
    firmDetails.trust_score,
    documents.length
  );

  const circumference = 2 * Math.PI * 15.9155;
  const offset = circumference - (readiness / 100) * circumference;
  const dialColor = readiness >= 75 ? "#DEFF9A" : readiness >= 50 ? "#D4CAA3" : "#EF4444";

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (clearErrorTimerRef.current) clearTimeout(clearErrorTimerRef.current);
    };
  }, []);

  const handleFieldSync = useCallback(
    async (fieldName: string, rawValue: string) => {
      if (!firmDetails?.slug) {
        console.warn("No firm slug available; mutation blocked.");
        return;
      }

      const trimmed = rawValue.trim();

      let currentValue: any = firmDetails[fieldName as keyof typeof firmDetails];
      if (fieldName === "moq") {
        currentValue = firmDetails.domestic_presence?.moq;
      } else if (fieldName === "customs_chapter") {
        currentValue = firmDetails.domestic_presence?.customs_chapter;
      }
      if (currentValue === trimmed || (typeof currentValue === "number" && String(currentValue) === trimmed)) {
        return;
      }

      let finalValue: any = trimmed;
      if (fieldName === "years_in_trade" || fieldName === "established" || fieldName === "trust_score") {
        const parsed = parseInt(trimmed, 10);
        if (isNaN(parsed)) {
          setSaveState("error");
          if (clearErrorTimerRef.current) clearTimeout(clearErrorTimerRef.current);
          clearErrorTimerRef.current = setTimeout(() => setSaveState("idle"), 2000);
          console.error(`[Schema Validation] ${fieldName} must be a valid integer. Received: ${trimmed}`);
          return;
        }
        finalValue = parsed;
      }

      if (isPendingMutation) {
        mutationQueueRef.current.push({ field: fieldName, value: finalValue });
        return;
      }

      setSaveState("saving");
      setIsPendingMutation(true);

      try {
        await updateProfileStats({ [fieldName]: finalValue } as any);
        setSaveState("success");

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSaveState("idle"), 1500);

        if (mutationQueueRef.current.length > 0) {
          const next = mutationQueueRef.current.shift();
          if (next) {
            setTimeout(() => {
              void handleFieldSync(next.field, String(next.value));
            }, 100);
          }
        }
      } catch (error) {
        console.error("Critical Mutation Failure:", error);
        setSaveState("error");
        if (clearErrorTimerRef.current) clearTimeout(clearErrorTimerRef.current);
        clearErrorTimerRef.current = setTimeout(() => setSaveState("idle"), 2000);
      } finally {
        setIsPendingMutation(false);
      }
    },
    [firmDetails, updateProfileStats, isPendingMutation]
  );

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firmDetails.id) return;
    setBannerUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const path = `banners/${firmDetails.id}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("firm_assets").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("firm_assets").getPublicUrl(path);

      setBannerUrl(publicUrl);
      await supabase.from("firms").update({ banner_url: publicUrl }).eq("id", firmDetails.id);
    } catch (err) {
      console.error("[Banner upload]", err);
    } finally {
      setBannerUploading(false);
    }
  };

  return (
    <section className="relative w-full border-b border-white/5 bg-[#0A0A0A]">
      <div className="h-[380px] md:h-[480px] w-full relative overflow-hidden">
        <div className="scan-line z-10" />

        <img
          src={bannerUrl}
          alt="Firm Banner"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-35 mix-blend-luminosity transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />

        <div className="absolute top-6 left-6 z-30">
          <ComplianceStrip iecStatus={firmDetails.iec_status} identityAnchored={firmDetails.identity_anchored ?? false} />
        </div>

        {isEditMode && (
          <button
            onClick={() => bannerInputRef.current?.click()}
            disabled={bannerUploading}
            className="absolute top-6 right-24 z-30 flex items-center gap-2 bg-black/70 border border-[#D4CAA3]/30 hover:border-[#D4CAA3]/70 text-[#D4CAA3] text-[10px] font-mono tracking-widest uppercase px-4 py-2.5 backdrop-blur-md transition-all"
          >
            {bannerUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5" /> Change Banner
              </>
            )}
          </button>
        )}
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />

        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <AnimatePresence>
            {saveState !== "idle" && (
              <motion.div
                initial={{ opacity: 0, x: 16, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 16, y: -8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase px-4 py-2.5 backdrop-blur-md border transition-all
                  ${saveState === "saving"
                    ? "text-white/50 border-white/10 bg-white/5 animate-pulse"
                    : saveState === "success"
                      ? "text-[#F9F6EE] border-[#D4CAA3]/40 bg-[#D4CAA3]/10"
                      : "text-red-400 border-red-500/40 bg-red-500/5"
                  }`}
              >
                {saveState === "saving" ? (
                  <>
                    <span className="inline-block w-1 h-1 bg-white/50 rounded-full animate-ping"></span>
                    <span>// SYNCING TERMINAL DATA...</span>
                  </>
                ) : saveState === "success" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>✓ ALL CHANGES ANCHORED.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>⚠ SOVEREIGN MUTATION REJECTED.</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-4 py-2.5 border border-white/10">
            <Settings2 className={`w-3.5 h-3.5 transition-colors ${isEditMode ? "text-[#D4CAA3]" : "text-zinc-600"}`} />
            <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase">Edit</span>
            <Switch checked={isEditMode} onCheckedChange={toggleEditMode} className="scale-75 ml-1" />
          </div>

          <button
            onClick={() => setShowCompliance(true)}
            className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2.5 border border-white/10 hover:border-[#D4CAA3]/40 transition-all group trust-glow"
          >
            <ReadinessGauge trustScore={readiness} />
            <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-[#D4CAA3] transition-colors" />
          </button>
        </div>

        <div className="ShowroomHeader_bottom absolute bottom-0 left-0 px-8 lg:px-12 flex flex-col gap-8 w-full mt-8 pb-8 border-b border-white/5 z-20">
          <div className="space-y-3 max-w-4xl w-full">
            {multiFirm ? (
              <VerificationBadges
                iecStatus={multiFirm.iec_status}
                identityAnchored={multiFirm.identity_anchored}
                trustScore={multiFirm.sovereign_trust_score}
                verifications={multiVerifications}
              />
            ) : (
              <div className="flex items-center flex-wrap gap-3">
                <Badge className="bg-[#DEFF9A]/10 text-[#DEFF9A] border-[#DEFF9A]/20 rounded-none px-3 py-1 text-[10px] tracking-widest font-mono">
                  TRUST SCORE: {firmDetails.trust_score}%
                </Badge>
                <div className="flex items-center gap-1.5 text-[#F9F6EE] text-[10px] tracking-widest font-mono uppercase px-2 py-1 border border-white/20 bg-white/5">
                  <ShieldCheck className="w-3 h-3" />
                  Identity Anchored
                </div>
              </div>
            )}

            <IdentitySection firmDetails={firmDetails} isEditMode={isEditMode} handleFieldSync={handleFieldSync} />
            <ActionDeck onChatOpen={onOpenAI} isPending={isPendingMutation} slug={firmDetails.slug} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCompliance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/60 to-transparent" />

              <button
                onClick={() => setShowCompliance(false)}
                className="absolute top-5 right-5 text-zinc-600 hover:text-[#D4CAA3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={dialColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-mono font-bold" style={{ color: dialColor }}>
                        {readiness}%
                      </span>
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

                <div className="space-y-2">
                  <div className="text-[9px] font-mono tracking-[0.25em] text-zinc-600 uppercase mb-3">Compliance Checklist</div>

                  {[
                    { label: "IEC Status verified", done: firmDetails.iec_status === "VERIFIED" },
                    { label: "Product inventory seeded", done: inventory.length > 0 },
                    {
                      label: "2+ certifications added",
                      done: documents.filter((d) => d.status === "verified" || d.status === "VERIFIED").length >= 2,
                    },
                    { label: "Firm profile complete", done: firmDetails.trust_score >= 50 },
                  ].map(({ label, done }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 p-3 border transition-colors ${done ? "border-[#DEFF9A]/15 bg-[#DEFF9A]/5" : "border-white/5 bg-[#111111]"
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#DEFF9A]/20" : "bg-white/5"}`}>
                        {done ? (
                          <CheckCircle2 className="w-3 h-3 text-[#DEFF9A]" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-zinc-600" />
                        )}
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
                          <span className="text-[#D4CAA3] mt-0.5 shrink-0">→</span>
                          {g}
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
