"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShowroomHeader } from "@/components/dashboard/header/ShowroomHeader";
import { BusinessSignals } from "@/components/dashboard/BusinessSignals";
import { AIRiskWidget } from "@/components/dashboard/AIRiskWidget";
import { InstitutionalOverview } from "@/components/dashboard/InstitutionalOverview";
import { InstitutionalBio } from "@/components/dashboard/InstitutionalBio";
import { VerificationVault } from "@/components/dashboard/VerificationVault";
import { ProductGrid } from "@/components/dashboard/ProductGrid";
import { ProductStoryModal } from "@/components/dashboard/ProductStoryModal";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { ExporterCard } from "@/components/dashboard/ExporterCard";
import { TradeMapDashboard } from "@/components/dashboard/TradeMapDashboard";
import { PartnerReviews } from "@/components/dashboard/PartnerReviews";
import { HsnAuditVaultModal } from "@/components/dashboard/HsnAuditVaultModal";
import { useProductStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Shield, Sparkles, ArrowRight, Loader2,
  CheckCircle2, Lock,
} from "lucide-react";

// Onboarding Steps
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

export default function AdminProfileConsole() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  // YC Spec Administrative Gate Check
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(true);

  const [isEditModeActive, setIsEditModeActive] = useState(true);

  const {
    fetchFirmData,
    fetchDashboardData,
    setUpRealtimeListeners,
    tearDownRealtimeListeners,
    isLoading,
    error,
    firmDetails,
    inventory,
    documents,
  } = useProductStore();

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedStoryAuditProduct, setSelectedStoryAuditProduct] = useState<any | null>(null);
  const [isStoryAuditOpen, setIsStoryAuditOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchFirmData(slug);
      fetchDashboardData(slug).then(() => {
        setUpRealtimeListeners();
      });
    }

    return () => {
      tearDownRealtimeListeners();
    };
  }, [slug, fetchFirmData, fetchDashboardData, setUpRealtimeListeners, tearDownRealtimeListeners]);

  // Onboarding progress
  const step1Done = documents.filter(
    (d) => d.status === "verified" || d.status === "VERIFIED" || d.status === "ACTIVE"
  ).length >= 2;
  const step2Done = inventory.length >= 1;
  const step3Unlocked = step1Done && step2Done;
  const showOnboarding = !step2Done;

  const handleStepAction = (id: string) => {
    if (id === "verification") {
      document.querySelector("[data-section='vault']")?.scrollIntoView({ behavior: "smooth" });
    } else if (id === "inventory") {
      router.push(`/dashboard/inventory/manage`);
    } else if (id === "agent") {
      if (step3Unlocked) setIsAIOpen(true);
    }
  };

  // Loading
  if (isLoading && !firmDetails.slug) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-150" />
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin relative z-10" />
        </div>
        <div className="text-center relative z-10">
          <p className="text-amber-500 font-mono tracking-[0.3em] text-[10px] uppercase animate-pulse">
            Loading Administrative Console
          </p>
          <p className="text-zinc-600 font-mono tracking-widest text-[9px] mt-2 uppercase">
            Decrypting Sovereign Core: {slug}
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized guard fallback
  if (!isAuthenticatedAdmin) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-8">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-serif text-white mb-2">Access Denied</h1>
        <p className="text-zinc-500 text-xs max-w-sm mb-8">
          Administrative clearance required to view this ledger module.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-white text-black px-8 py-3 text-[10px] font-mono tracking-widest uppercase hover:bg-zinc-200 transition-colors"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] font-sans text-[#F9F6EE] selection:bg-[#D4CAA3] selection:text-black antialiased">
      {/* Administrative Active Header Strip */}
      <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-6 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <p className="font-mono text-[9px] tracking-[0.25em] text-amber-500 uppercase">
            Administrative Root Operations Console
          </p>
        </div>
        <span className="font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
          SECURE CHANNEL • ACTIVE
        </span>
      </div>

      {/* Showroom Header (Edit Controls Active) */}
      <ShowroomHeader 
        onOpenAI={() => setIsAIOpen(true)} 
        hasWriteAccess={true} 
        isEditMode={isEditModeActive}
        setIsEditMode={setIsEditModeActive}
      />

      {/* Business Signals */}
      <BusinessSignals />

      {/* Institutional Bio */}
      <InstitutionalBio />

      {/* Institutional Overview */}
      <InstitutionalOverview />

      {/* Trade Map Dashboard */}
      <TradeMapDashboard />

      {/* Verification Vault (Interactive upload modes active) */}
      <div data-section="vault">
        <VerificationVault hasWriteAccess={true} isEditMode={isEditModeActive} />
      </div>

      {/* Stepper or Product Grid */}
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
              <h3 className="text-2xl font-serif">Welcome, Admin</h3>
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
        <ProductGrid
          onManage={() => {
            router.push(`/dashboard/inventory/manage`);
          }}
          onEditInit={(product) => router.push(`/dashboard/inventory/manage?id=${product.id}`)}
        />
      )}

      {/* Trade Card */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <ExporterCard onOpenAI={() => setIsAIOpen(true)} />
      </section>

      {/* Social Proof */}
      <PartnerReviews />

      {/* AI Risk Assessment */}
      <AIRiskWidget />

      {/* Modals & Sidebars */}
      <ProductStoryModal 
        onOpenAI={() => setIsAIOpen(true)} 
        onSeeHsnAudit={(prod) => {
          setSelectedStoryAuditProduct(prod);
          setIsStoryAuditOpen(true);
        }}
      />

      <HsnAuditVaultModal
        isOpen={isStoryAuditOpen}
        onClose={() => {
          setIsStoryAuditOpen(false);
          setSelectedStoryAuditProduct(null);
        }}
        product={selectedStoryAuditProduct}
      />

      <AISidebar isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
