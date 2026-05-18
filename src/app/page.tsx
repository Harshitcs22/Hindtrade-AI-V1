'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroBackground } from '@/components/sections/hero/hero-background';
import { HeroHeader } from '@/components/sections/hero/hero-header';
import { HeroFooter } from '@/components/sections/hero/hero-footer';
import { ExporterShowcase } from '@/components/sections/exporter-showcase';
import { ProblemMoat } from '@/components/sections/problem-moat';
import { CoreInfrastructure } from '@/components/sections/core-infrastructure';
import { RoiBanner } from '@/components/sections/roi-banner';
import { TradeCardFeature } from '@/components/sections/trade-card-feature';
import { EkayanFeature } from '@/components/sections/ekayan-feature';
import { PdfDefenseFeature } from '@/components/sections/pdf-defense-feature';
import { DocProcessingFeature } from '@/components/sections/doc-processing-feature';
import { ExpertHubFeature } from '@/components/sections/expert-hub-feature';
import { LandingFooter } from '@/components/sections/landing-footer';

export default function LandingPage() {
  const handleViewDashboard = () => {
    // Navigate or trace dashboard requests
    console.log("Dashboard requested");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F6EE] font-sans flex flex-col antialiased">
      {/* Header */}
      <Header />

      {/* Core Hero Frame */}
      <main className="relative w-full min-h-screen flex flex-col justify-between bg-[#0A0A0A] overflow-hidden select-none px-4 pt-14 md:pt-16 pb-16 antialiased">
        {/* Core Photographic Foundation */}
        <HeroBackground />

        {/* Top Elevation Content Group */}
        <HeroHeader />

        {/* Lower Elevation Content Group */}
        <HeroFooter />
      </main>

      {/* B2B Verified Identity Showcase */}
      <ExporterShowcase />

      {/* Problems & Industry Moats */}
      <ProblemMoat />

      {/* Solution Ecosystem Architecture */}
      <CoreInfrastructure />

      {/* ROI Proof Matrix */}
      <RoiBanner />

      {/* Feature Walkthrough Layers */}
      <TradeCardFeature />
      <EkayanFeature />
      <PdfDefenseFeature />
      <DocProcessingFeature />
      <ExpertHubFeature />

      {/* Action Footer & Application Intake Modal */}
      <LandingFooter />
    </div>
  );
}
