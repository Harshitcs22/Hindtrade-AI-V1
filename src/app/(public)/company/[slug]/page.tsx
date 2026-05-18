"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
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
import { Loader2, Shield, ArrowRight } from "lucide-react";

// THE STATIC ISOLATION REGISTRY FOR INSTANT VERIFIED LEDGER LOOKUPS
const PROFILE_DATA_REGISTRY: Record<string, { name: string; est: string; dealsIn: string }> = {
  'akshay-exports': { name: "Akshay Exports", est: "1975", dealsIn: "sports goods and sportswear" },
  'himrock-exports': { name: "Himrock Exports", est: "1998", dealsIn: "light engineering components & forging" }
};

export default function PublicCompanyProfile() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  // HARD ISOLATION FIX: Instantly block undefined or invalid slugs to prevent any profile crossover leak
  const companyRegistryEntry = PROFILE_DATA_REGISTRY[slug];
  if (slug && !companyRegistryEntry) {
    notFound();
  }

  const {
    fetchFirmData,
    fetchDashboardData,
    isLoading,
    error,
    firmDetails,
  } = useProductStore();

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedStoryAuditProduct, setSelectedStoryAuditProduct] = useState<any | null>(null);
  const [isStoryAuditOpen, setIsStoryAuditOpen] = useState(false);

  // Pure data ingestion hook - completely decoupled from any global edit-mode mutators
  useEffect(() => {
    if (slug) {
      fetchFirmData(slug);
      fetchDashboardData(slug);
    }
  }, [slug, fetchFirmData, fetchDashboardData]);

  // Loading indicator with premium styling
  if (isLoading && !firmDetails.slug) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#D4CAA3]/10 blur-3xl rounded-full scale-150" />
          <Loader2 className="w-12 h-12 text-[#D4CAA3] animate-spin relative z-10" />
        </div>
        <div className="text-center relative z-10">
          <p className="text-[#D4CAA3] font-mono tracking-[0.3em] text-[10px] uppercase animate-pulse">
            Resolving Public Ledger Node
          </p>
          <p className="text-zinc-600 font-mono tracking-widest text-[9px] mt-2 uppercase">
            Decrypting Sovereign Records: {slug}
          </p>
        </div>
      </div>
    );
  }

  // Error boundary fallback
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full scale-150" />
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center relative z-10">
            <Shield className="w-10 h-10 text-red-500/50" />
          </div>
        </div>
        <h1 className="text-3xl font-serif text-[#F9F6EE] mb-4">Ledger Entity Not Found</h1>
        <p className="text-zinc-500 max-w-md mb-10 font-light text-sm leading-relaxed">
          The public profile for <span className="text-[#D4CAA3] font-mono">/company/{slug}</span> does not exist in our sovereign registry.
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
      {/* Informative Security Header Banner */}
      <div className="w-full bg-[#D4CAA3]/5 border-b border-[#D4CAA3]/10 py-2.5 text-center relative z-50">
        <p className="font-mono text-[9px] tracking-[0.25em] text-[#D4CAA3] uppercase">
          ✦ Sovereign Public Ledger Node: Read-Only Verified Access ✦
        </p>
      </div>

      {/* Showroom Header (Read-Only Badge Fallback automatically active) */}
      <ShowroomHeader 
        onOpenAI={() => setIsAIOpen(true)} 
        hasWriteAccess={false} 
        isEditMode={false}
        setIsEditMode={() => {}}
      />

      {/* Business Signals */}
      <BusinessSignals />

      {/* Institutional Bio */}
      <InstitutionalBio />

      {/* Institutional Overview */}
      <InstitutionalOverview />

      {/* Trade Map Dashboard */}
      <TradeMapDashboard />

      {/* Verification Vault (Upload and custom add functions fully stripped for public guest view) */}
      <div data-section="vault">
        <VerificationVault hasWriteAccess={false} isEditMode={false} />
      </div>

      {/* Digital Inventory Product Grid (Forced to Read-Only mode) */}
      <ProductGrid />

      {/* Exporter Card */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <ExporterCard onOpenAI={() => setIsAIOpen(true)} />
      </section>

      {/* Partner Reviews */}
      <PartnerReviews />

      {/* AI Risk Assessment */}
      <AIRiskWidget />

      {/* Modals */}
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
