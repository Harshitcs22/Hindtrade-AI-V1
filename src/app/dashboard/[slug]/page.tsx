"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShowroomHeader } from "@/components/dashboard/ShowroomHeader";
import { BusinessSignals } from "@/components/dashboard/BusinessSignals";
import { AIRiskWidget } from "@/components/dashboard/AIRiskWidget";
import { InstitutionalOverview } from "@/components/dashboard/InstitutionalOverview";
import { VerificationVault } from "@/components/dashboard/VerificationVault";
import { ProductGrid } from "@/components/dashboard/ProductGrid";
import { ProductStoryModal } from "@/components/dashboard/ProductStoryModal";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { ExporterCard } from "@/components/dashboard/ExporterCard";
import { ProductIngestionModal } from "@/components/dashboard/ProductIngestionModal";
import { TradeMapDashboard } from "@/components/dashboard/TradeMapDashboard";
import { PartnerReviews } from "@/components/dashboard/PartnerReviews";
import { useProductStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Shield, Sparkles, ArrowRight, Loader2,
  CheckCircle2, Lock, ShieldCheck,
} from "lucide-react";

// ─── ONBOARDING STEPPER DATA ─────────────────────────────────────────────────
const STEPS = [
  {
    id: "verification",
    number: "01",
    title: "Verification",
    desc: "Add at least 2 certifications to the Audit Vault (IEC, GST, MSME, etc.).",
    action: "Open Vault",
  },
  {
    id: "inventory",
    number: "02",
    title: "Inventory Ingestion",
    desc: "Add your first export-grade product to the Digital Showroom.",
    action: "Add Product",
  },
  {
    id: "agent",
    number: "03",
    title: "Deploy Agent",
    desc: "Activate Agent Ekayan for 24/7 autonomous procurement assistance.",
    action: "Talk to AI",
  },
];

export default function DynamicDashboardPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const {
    fetchFirmData, isLoading, error,
    firmDetails, inventory, documents,
    isEditMode, toggleEditMode,
  } = useProductStore();

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (slug) fetchFirmData(slug);
  }, [slug, fetchFirmData]);

  // ─── ONBOARDING LOGIC ──────────────────────────────────────────────────────
  const step1Done = documents.filter(
    (d) => d.status === "verified" || d.status === "VERIFIED" || d.status === "ACTIVE"
  ).length >= 2;
  const step2Done = inventory.length >= 1;
  const step3Unlocked = step1Done && step2Done;
  const showOnboarding = !step2Done;

  const handleStepAction = (id: string) => {
    if (id === "verification") {
      if (!isEditMode) toggleEditMode();
      document.querySelector("[data-section='vault']")?.scrollIntoView({ behavior: "smooth" });
    } else if (id === "inventory") {
      setIsProductModalOpen(true);
    } else if (id === "agent") {
      if (step3Unlocked) setIsAIOpen(true);
    }
  };

  // ─── LOADING STATE (Only for initial decryption) ──────────────────────────
  if (isLoading && !firmDetails.slug) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#D4CAA3]/10 blur-3xl rounded-full scale-150" />
          <Loader2 className="w-12 h-12 text-[#D4CAA3] animate-spin relative z-10" />
        </div>
        <div className="text-center relative z-10">
          <p className="text-[#D4CAA3] font-mono tracking-[0.3em] text-[10px] uppercase animate-pulse">
            Initializing Sovereign Terminal
          </p>
          <p className="text-zinc-600 font-mono tracking-widest text-[9px] mt-2 uppercase">
            Decrypting Firm Vault: {slug}
          </p>
        </div>
      </div>
    );
  }

  // ─── ERROR / NOT FOUND STATE ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full scale-150" />
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center relative z-10">
            <Shield className="w-10 h-10 text-red-500/50" />
          </div>
        </div>
        <h1 className="text-3xl font-serif text-[#F9F6EE] mb-4">Sovereign Identity Not Found</h1>
        <p className="text-zinc-500 max-w-md mb-10 font-light text-sm leading-relaxed">
          The identifier <span className="text-[#D4CAA3] font-mono">/{slug}</span> does not
          exist in our registry.
        </p>
        <button
          onClick={() => router.push("/")}
          className="group bg-[#D4CAA3] text-black px-10 py-4 font-bold uppercase tracking-[0.15em] text-xs flex items-center gap-3 hover:bg-white transition-colors"
        >
          Return to Registry
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-[#F9F6EE] selection:bg-[#D4CAA3] selection:text-black antialiased">

      {/* ═══ 1. SHOWROOM HEADER (Hero + Identity Ribbon + Actions) ═══ */}
      <ShowroomHeader onOpenAI={() => setIsAIOpen(true)} />

      {/* ═══ 2. LIVE EXPORT SIGNALS ═══ */}
      <BusinessSignals />

      {/* ═══ 3. INSTITUTIONAL OVERVIEW (Manufacturing Philosophy) ═══ */}
      <InstitutionalOverview />

      {/* ═══ 4. TRADE MAP DASHBOARD (Global Reach) ═══ */}
      <TradeMapDashboard />

      {/* ═══ 5. VERIFICATION VAULT ═══ */}
      <div data-section="vault">
        <VerificationVault />
      </div>

      {/* ═══ 6. CONTENT: ONBOARDING or INVENTORY (Digital Inventory) ═══ */}
      {showOnboarding ? (
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#D4CAA3]/20 bg-[#111111] p-10 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4CAA3]/[0.02] to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 mb-2 relative z-10">
              <Sparkles className="w-8 h-8 text-[#D4CAA3] opacity-50" />
              <h3 className="text-2xl font-serif">Welcome, {firmDetails.name || "Exporter"}</h3>
            </div>
            <p className="text-slate-400 max-w-xl mb-12 font-light leading-relaxed relative z-10 text-sm">
              Complete the sequence below to activate Agent Ekayan and begin receiving global procurement inquiries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-10 relative z-10">
              {STEPS.map(({ id, number, title, desc, action }, idx) => {
                const isDone = id === "verification" ? step1Done : id === "inventory" ? step2Done : false;
                const isUnlocked =
                  id === "verification" ||
                  (id === "inventory" && step1Done) ||
                  (id === "agent" && step3Unlocked);
                const isCurrent = !isDone && isUnlocked;

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-6 border transition-all
                      ${isDone
                        ? "border-[#DEFF9A]/30 bg-[#DEFF9A]/5"
                        : isCurrent
                        ? "border-[#D4CAA3]/40 bg-[#D4CAA3]/5"
                        : "border-white/5 bg-black/20 opacity-50"
                      }`}
                  >
                    {isDone && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-4 h-4 text-[#DEFF9A]" />
                      </div>
                    )}
                    {!isDone && !isUnlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-3.5 h-3.5 text-zinc-700" />
                      </div>
                    )}

                    <div className={`text-[10px] mb-3 font-mono tracking-widest ${isDone ? "text-[#DEFF9A]" : "text-[#D4CAA3]"}`}>
                      {isDone ? "✓ COMPLETE" : `STEP ${number}`}
                    </div>
                    <h4 className="font-bold text-sm mb-1.5 uppercase tracking-wider text-[#F9F6EE]">{title}</h4>
                    <p className="text-xs text-zinc-500 font-light mb-4 leading-relaxed">{desc}</p>

                    {id === "verification" && (
                      <div className="flex items-center gap-1 mb-4">
                        {[0, 1].map((i) => (
                          <div key={i} className={`h-1 flex-1 ${
                            documents.filter(d => d.status === "verified" || d.status === "VERIFIED").length > i
                              ? "bg-[#DEFF9A]"
                              : "bg-white/10"
                          }`} />
                        ))}
                        <span className="text-[9px] font-mono text-zinc-600 ml-1">
                          {Math.min(documents.filter(d => d.status === "verified" || d.status === "VERIFIED").length, 2)}/2
                        </span>
                      </div>
                    )}

                    {isUnlocked && !isDone && (
                      <button
                        onClick={() => handleStepAction(id)}
                        className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4CAA3] hover:text-white transition-colors group"
                      >
                        {action}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      ) : (
        <ProductGrid onManage={() => setIsProductModalOpen(true)} />
      )}

      {/* ═══ 7. EXPORTER CARD (Trade Card) ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <ExporterCard onOpenAI={() => step3Unlocked && setIsAIOpen(true)} />
      </section>

      {/* ═══ 8. PARTNER REVIEWS (Social Proof) ═══ */}
      <PartnerReviews />

      {/* ═══ 9. AI RISK ASSESSMENT (AI Analysis - LAST) ═══ */}
      <AIRiskWidget />

      {/* ═══ MODALS & OVERLAYS ═══ */}
      <ProductStoryModal onOpenAI={() => setIsAIOpen(true)} />

      <ProductIngestionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        firmId={firmDetails.id || ""}
      />

      <AISidebar isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

    </div>
  );
}
