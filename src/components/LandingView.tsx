"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle, Shield, ArrowUpRight, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingView({ onViewDashboard }: { onViewDashboard: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F6EE] font-sans flex flex-col antialiased">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <img 
              src="/images/LOGO.png" 
              alt="Konark Chakra" 
              className="h-8 w-8 invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5] object-contain"
            />
            <div className="font-sans text-xl font-extralight tracking-[0.18em] text-[#F9F6EE]/90">
              HINDTRADE AI
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10 text-sm font-medium text-slate-400">
            <a href="#engine" className="hover:text-[#D4CAA3] transition-colors">Engine</a>
            <a href="#network" className="hover:text-[#D4CAA3] transition-colors">Network</a>
            <Link href="/audit-vault" className="hover:text-[#D4CAA3] transition-colors font-semibold text-[#D4CAA3]">Audit Vault</Link>
            <a href="#docs" className="hover:text-[#D4CAA3] transition-colors">Docs</a>
            <Link href="/pitch" className="border border-white/10 hover:border-[#D4CAA3] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-slate-300 hover:text-[#D4CAA3] bg-transparent transition-all duration-300 uppercase">
              Institutional Pitch
            </Link>
          </nav>
          <Button
            onClick={onViewDashboard}
            className="bg-[#D4CAA3] text-[#0A0A0A] hover:bg-[#c5b992] font-semibold rounded-none px-6 h-11 text-sm transition-all hover:scale-[1.02]"
          >
            Deploy Agent
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-[#0A0A0A] flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge className="bg-transparent text-[#D4CAA3] border border-white/20 mb-8 font-sans tracking-[0.25em] px-4 py-1.5 rounded-none text-[10px] uppercase font-semibold">
            NEURO-SYMBOLIC · GRI 1–6 ENGINE
          </Badge>
          <h1 className="text-6xl md:text-7xl font-serif text-[#F9F6EE] mb-8 leading-[1.1] tracking-tight max-w-4xl mx-auto">
            The Operating System for Sovereign Trade.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-sans font-light">
            HindTrade AI is establishing the digital trust layer for global SMEs. We provide the autonomous solution that secures every shipment with verified documentation, classifications, and eliminates customs liability unifying trust and compliance before your freight moves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#D4CAA3] text-[#0A0A0A] hover:bg-[#c5b992] font-semibold text-base px-10 py-6 rounded-none transition-all hover:scale-[1.02]"
            >
              Request Access
            </Button>
            <Link href="/audit-vault" className="border border-[#D4CAA3]/30 hover:border-[#D4CAA3] text-[#D4CAA3] hover:bg-[#D4CAA3]/5 font-semibold text-base px-10 py-4 rounded-none transition-all duration-300 flex items-center justify-center">
              Access Audit Vault ↗
            </Link>
          </div>

          {/* Narrative Text */}
          <div className="mt-16 mb-8 text-center">
            <p className="text-slate-500 text-sm font-sans mb-2 font-medium">A unified identity layer for SMEs.</p>
            <p className="text-[#F9F6EE] text-base md:text-lg font-sans font-semibold">Public Visibility. Locked Contacts. Verified Trust.</p>
          </div>


          {/* Premium Trade Card Component */}
          <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000000] border border-white/10 rounded-2xl py-6 px-8 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden group text-left">

            {/* Luxury Metallic Glare Effect (Visible on hover) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Sleeker Logo Box */}
                <div className="w-6 h-6 bg-gradient-to-br from-[#D4CAA3] to-[#8C825A] text-[#0A0A0A] flex items-center justify-center font-serif text-xs font-bold rounded-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  H
                </div>
                <div className="flex items-center space-x-2">
                  {/* Fixed: Ultra-thin, tracked out font instead of bold */}
                  <span className="text-zinc-400 text-[9px] font-sans tracking-[0.2em] font-normal uppercase">
                    VERIFIED EXPORTER
                  </span>
                  <span className="flex items-center text-emerald-500/80 text-[7px] font-sans tracking-widest font-medium uppercase">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_4px_#10b981]"></span>
                    LIVE
                  </span>
                </div>
              </div>
              <div className="text-zinc-600 font-sans text-[9px] font-normal tracking-[0.2em] uppercase">IN</div>
            </div>

            {/* Title - Ultra Luxury Spacing */}
            <div className="text-center mt-2 mb-4">
              <h2 className="text-xl md:text-[22px] font-sans font-light tracking-[0.3em] text-white/95 uppercase">
                HIMROCK EXPORTS
              </h2>
              <div className="text-[#D4CAA3]/70 text-[8px] tracking-[0.3em] font-sans mt-2">
                EST. 1980
              </div>
            </div>

            {/* Business Profile - Dense & Sleek */}
            <div className="border-y border-white/5 py-3 mb-4 font-sans text-[10px] font-light tracking-widest flex flex-col gap-2 px-1">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase text-[8px]">DEALS IN</span>
                <span className="text-zinc-300 font-normal text-right">Sports Goods, Premium Leather</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 uppercase text-[8px]">MARKETS</span>
                <span className="text-zinc-300 font-normal text-right">USA, United Kingdom, UAE</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div>
                <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">SHIPMENTS</div>
                <div className="text-white/90 text-sm md:text-base font-sans font-medium">120+</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">EXPERIENCE</div>
                <div className="text-white/90 text-sm md:text-base font-sans font-medium">12 Yrs</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">NET WORTH</div>
                <div className="text-[#D4CAA3] text-sm md:text-base font-sans font-medium">₹12 Cr</div>
              </div>
            </div>

            {/* Pill Badges - Thinner borders, smaller text */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              <span className="bg-white/[0.02] text-zinc-400 border border-white/10 px-3 py-1 text-[7px] font-sans tracking-[0.2em] uppercase font-light rounded-full">
                GST REGISTERED
              </span>
              <span className="bg-white/[0.02] text-zinc-400 border border-white/10 px-3 py-1 text-[7px] font-sans tracking-[0.2em] uppercase font-light rounded-full">
                IEC HOLDER
              </span>
            </div>

            {/* Footer & CTA */}
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div className="text-zinc-500 text-[8px] font-sans tracking-[0.15em] uppercase">
                UDIN: 24059182AABCV1928 <span className="mx-1 text-zinc-700">|</span> <span className="text-[#D4CAA3]/90 font-normal">VERIFIED</span>
              </div>
              <button className="bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,202,163,0.15)]">
                Talk to AI <span className="text-lg leading-none mt-[-2px]">✦</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Technical Moat Section */}
      <section className="py-24 md:py-32 bg-[#0F0F0F] border-y border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#D4CAA3]/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Hero Quote */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-[34px] font-serif text-[#F9F6EE] mb-6 leading-snug">
              "Wrong HSN codes don’t just delay shipments. They trigger seizures, fines, and permanent audit flags."
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-sans font-light">
              Indian exporters lose ₹3–12 lakh per misclassified shipment. HindTrade AI closes that liability gap, while completely automating the manual lead-to-deal cycle.
            </p>
          </div>

          {/* 3-Card Tech Moat Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group">
              <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Sales Bottleneck</div>
              <h3 className="text-xl font-serif text-white/90 mb-3">Static Catalogs & Manual Chaos</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                Traditional B2B relies on dead PDFs and human-dependent quotations, extending the lead-to-deal cycle to weeks.
              </p>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The AI Solution</div>
                <p className="text-xs text-zinc-300 font-light"> SME ingest their data into a <span className="text-white font-medium">Vector DB</span>. Our RAG-powered agents negotiate and quote autonomously 24/7.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/30 to-transparent"></div>
              <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Compliance Risk</div>
              <h3 className="text-xl font-serif text-white/90 mb-3">Probabilistic Guesswork</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                Generative AI hallucinates. Standard LLMs cannot be trusted with statutory customs documentation or HSN mapping.
              </p>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The Tech Moat</div>
                <p className="text-xs text-zinc-300 font-light">A proprietary <span className="text-white font-medium">Neuro-Symbolic Engine</span> that applies deterministic GRI 1-6 rules for 100% legal defensibility.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group">
              <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Trust Deficit</div>
              <h3 className="text-xl font-serif text-white/90 mb-3">Fragmented Identity</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                International buyers don't trust WhatsApp screenshots. Verification is scattered across DGFT, CBIC, and offline audits.
              </p>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The Network Layer</div>
                <p className="text-xs text-zinc-300 font-light">A <span className="text-white font-medium">Unified Digital Trust Layer</span> that aggregates dynamic government data into one verifiable institutional profile.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Infrastructure Section (Appended below Problem Statement) */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-3 uppercase font-medium">The Solution Ecosystem</div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#F9F6EE] tracking-tight">
                Core Infrastructure
              </h2>
            </div>
            <p className="text-sm text-zinc-400 font-light max-w-sm text-left md:text-right">
              A complete operating system to manage digital identity, autonomous compliance, and global growth for Indian SMEs.
            </p>
          </div>

          {/* 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1: Trade Card */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🪪</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">Autonomous Trade Card</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Your verified "LinkedIn-style" business passport. A dynamic, public-facing profile that aggregates your IEC, GST, and operational history to build instant trust with global buyers.
              </p>
            </div>

            {/* Card 2: Ekayan Agent */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4CAA3]/20 to-transparent border border-[#D4CAA3]/30 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🧠</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">Agent Ekayan</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Our proprietary Neuro-Symbolic AI. Ekayan autonomously classifies your products using strict statutory GRI 1-6 rules, ensuring 100% defensible HSN codes.
              </p>
            </div>

            {/* Card 3: Auto Doc Gen */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">📄</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">Zero-Touch Documentation</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Generate customs-proof proforma invoices, packing lists, and statutory defense packets instantly. Eliminate manual data entry and re-keying errors.
              </p>
            </div>

            {/* Card 4: Expert Network (CHA) */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🚢</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">CHA Network</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Direct, integrated access to verified Customs House Agents (CHAs) for physical freight clearance and seamless logistics execution.
              </p>
            </div>

            {/* Card 5: Student Designers */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">👨‍💻</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">Digital Asset Acceleration</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                No website? No problem. Hire vetted engineering and design talent directly from NITs to build your stunning digital portfolio for a flat fee.
              </p>
            </div>

            {/* Card 6: Global Demand */}
            <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🌍</div>
              <h3 className="text-lg font-serif text-white/90 mb-3">Global Demand Signals</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Your Trade Card isn't just a static profile. Agent Ekayan actively matches your verified inventory with anonymized global buyer RFQs in real-time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ROI Value Prop Banner (Appended below Core Infrastructure) */}
      <section className="py-20 md:py-32 bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-center border-b border-white/5">
        {/* Subtle glowing orb in the center background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-[#D4CAA3]/5 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#F9F6EE] mb-8 leading-tight tracking-tight">
            Engineered to save time, reduce manual workforce, and build the verifiable digital trust global buyers demand.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm md:text-base font-sans tracking-widest uppercase text-zinc-500 font-medium">
            <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> Zero Manual Entry</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> 100% Legal Defensibility</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> Verified Global Trust</span>
          </div>
        </div>
      </section>

      {/* Feature 1: Autonomous Trade Card & Agent Network (Replacing old Digital Trust Layer) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 border-b border-white/5">
        
        {/* Top Copy Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">The End of Unverified Leads</div>
          <h3 className="text-3xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-tight">
            Not just another B2B marketplace. <br /> A Verified Sovereign Network.
          </h3>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed font-sans font-light">
            Legacy platforms are cluttered with dead catalogs and unverified buyers. HindTrade AI shifts you to an autonomous model. You get a "LinkedIn-style" Trade Card verified by CA/DGFT data, and a dedicated AI agent trained on your specific inventory to close deals 24/7.
          </p>
        </div>

        {/* Bottom Split: Real Screenshots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: The Profile & Timeline Image */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute inset-0 bg-[#D4CAA3]/5 blur-2xl rounded-xl scale-95 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>
            <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80 bg-[#0A0A0A]">
              <div className="bg-[#111111] border-b border-white/10 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs text-zinc-500 font-sans tracking-wider">trade-card-jalandhar-sports</span>
              </div>
              <img 
                src="/images/profile-view.png" 
                alt="Verified Supplier Profile and AI Agent" 
                className="w-full h-auto object-cover opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Right Panel: The Catalog Image & Context */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/60 bg-[#0A0A0A] transform transition-transform hover:-translate-y-1">
              <img 
                src="/images/catalog-view.png" 
                alt="Ingested Catalog and HSN Mapping" 
                className="w-full h-auto object-cover opacity-90"
              />
            </div>
            
            {/* Explanation Cards */}
            <div className="space-y-4">
              <div className="bg-[#111111] border-l-2 border-[#D4CAA3] p-5 rounded-r-lg">
                <h4 className="text-white/90 font-serif text-base mb-1">RAG-Powered Inventory</h4>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">Your catalogs are ingested into a private Vector DB. When buyers ask for products, your agent knows your exact MOQ, pricing, and specs.</p>
              </div>
              <div className="bg-[#111111] border-l-2 border-[#22D3EE]/50 p-5 rounded-r-lg">
                <h4 className="text-white/90 font-serif text-base mb-1">Live Statutory Trace</h4>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">Notice the HSN tags on every product? The agent runs a live GRI audit before ever sending a quote to a buyer.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature 2: Agent Ekayan & Statutory Engine */}
      <section className="py-32 md:py-40 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5 md:flex-row-reverse">

        {/* Left Side: Real Dashboard Screenshot */}
        <div className="order-2 md:order-1 relative group w-full flex justify-center">
          {/* Decorative glow behind the image */}
          <div className="absolute inset-0 bg-[#D4CAA3]/10 blur-3xl rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative w-full max-w-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80">
            {/* Note for Developer: In production, ensure this image is in the public folder (e.g., src="/images/ekayan-engine.jpg") */}
            <img
              src="/images/ekayan-engine.png"
              alt="Agent Ekayan Statutory Classification Instrument"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right Side: Copy & Explanation */}
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Meet Agent Ekayan</div>
          <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
            Statutory Classification. Zero Guesswork.
          </h3>
          <p className="text-slate-400 mb-6 text-base md:text-lg leading-relaxed font-sans font-light">
            Standard AI guesses. Agent Ekayan reasons. It applies deterministic General Rules of Interpretation (GRI 1–6) to your product catalogs, ensuring every HSN code is legally defensible.
          </p>
          <div className="space-y-4 border-l border-white/10 pl-5">
            <div>
              <h4 className="text-white/90 font-serif text-sm mb-1">Noun Extraction & Legal Note Audit</h4>
              <p className="text-zinc-500 text-xs font-light">Ekayan scans chapter exclusions and legal notes before making a decision.</p>
            </div>
            <div>
              <h4 className="text-white/90 font-serif text-sm mb-1">GRI Sequence Application</h4>
              <p className="text-zinc-500 text-xs font-light">Strict adherence to statutory hierarchy, providing a full legal trace for every classification.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Feature 3: Audit-Ready PDF Defense Packets (Appended Section) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5">

        {/* Left Side: Copy & Features */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Statutory Traceability</div>
          <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
            Audit-Ready Defense Packets.
          </h3>
          <p className="text-slate-400 mb-8 text-base md:text-lg leading-relaxed font-sans font-light">
            Don't just get a code; get the legal defense. Ekayan compiles the complete GRI reasoning, positive/negative exclusions, and legal citations into a downloadable, audit-grade PDF report.
          </p>

          {/* List of features */}
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
              <div>
                <h4 className="text-white/90 font-serif text-sm">8-Digit Tariff Mapping</h4>
                <p className="text-zinc-500 text-xs font-light mt-0.5">Precise classification matching the ITC-HS 2022 Schedules.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
              <div>
                <h4 className="text-white/90 font-serif text-sm">Positive & Negative Path Rationale</h4>
                <p className="text-zinc-500 text-xs font-light mt-0.5">Documented proof of why exclusions were bypassed.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
              <div>
                <h4 className="text-white/90 font-serif text-sm">Legal Citations & Anchors</h4>
                <p className="text-zinc-500 text-xs font-light mt-0.5">Direct references to the Customs Tariff Act 1975.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side: Stacked PDF Mockups */}
        <div className="order-1 md:order-2 relative w-full h-[400px] md:h-[500px] flex justify-center items-center group">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-[#D4CAA3]/5 blur-3xl rounded-full scale-75 pointer-events-none"></div>

          {/* Back Document (Page 2 - Detailed GRI Steps) */}
          <div className="absolute right-0 top-10 w-4/5 border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-black opacity-60 transform transition-all duration-500 group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:rotate-[-2deg]">
            <img
              src="/images/pdf-page2.png"
              alt="GRI Sequence Report Page 2"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Front Document (Page 1 - Header & Resolution) */}
          <div className="absolute left-0 bottom-10 w-4/5 border border-white/20 rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] transform transition-all duration-500 group-hover:translate-y-2 group-hover:translate-x-2 group-hover:rotate-[1deg] z-10">
            <img
              src="/images/pdf-page1.png"
              alt="Statutory Audit Report Page 1"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </section>

      {/* Feature 4: AI Document Processing (Appended Section) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5 md:flex-row-reverse">

        {/* Left Side: Mockups (The 'Process Flow' and 'Invoice Extraction') */}
        <div className="order-2 md:order-1 relative w-full flex flex-col items-center gap-8">
          {/* Top: Process Flow Image */}
          <div className="w-full max-w-md border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/50 bg-[#0A0A0A] p-2">
            <img
              src="/images/doc-flow.png"
              alt="Document Processing Flow"
              className="w-full h-auto object-contain filter invert opacity-90"
            />
          </div>

          {/* Bottom: Invoice Extraction Image */}
          <div className="w-full max-w-md border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80 bg-[#111111] transform transition-transform hover:scale-[1.02]">
            {/* Subtle overlay to fit the dark theme since the original image is very bright */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#0A0A0A]/20 pointer-events-none mix-blend-multiply"></div>
              <img
                src="/images/doc-extraction.png"
                alt="AI Invoice Extraction"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Copy & Explanation */}
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Data Ingestion Engine</div>
          <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
            AI-Assisted Document Processing.
          </h3>
          <p className="text-slate-400 mb-6 text-base md:text-lg leading-relaxed font-sans font-light">
            Instantly digitize your entire trade operation. HindTrade AI autonomously classifies and extracts structured data from your physical paperwork, bridging the gap between legacy formats and the digital trust layer.
          </p>

          {/* Feature Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#111111] border border-white/5 p-5 rounded-lg">
              <h4 className="text-white/90 font-serif text-sm mb-2">Universal Extraction</h4>
              <p className="text-zinc-500 text-xs font-light">Process Letters of Credit (LC), Bills of Lading (BOL), Invoices, and Packing Lists instantly.</p>
            </div>
            <div className="bg-[#111111] border border-white/5 p-5 rounded-lg">
              <h4 className="text-white/90 font-serif text-sm mb-2">Batch Processing</h4>
              <p className="text-zinc-500 text-xs font-light">Handle multiple file formats and massive batch uploads efficiently without manual sorting.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Feature 5: Expert Hub / Student Network (Appended Section) */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] border-b border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4CAA3]/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-black">
            {/* Decorative top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
              
              {/* Left Side: Copy */}
              <div className="flex-1">
                <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Expert Hub & Digital Acceleration</div>
                <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-5 leading-tight">
                  No Digital Footprint? <br /> Let India's Top Engineering Talent Build It.
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans font-light max-w-2xl">
                  HindTrade AI requires structured data to operate autonomously. If your SME relies entirely on physical paperwork, hire vetted engineering and design talent from NITs to digitize your inventory and build a stunning custom web portfolio.
                </p>

                {/* Pricing & Value Metrics */}
                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4CAA3] font-serif text-lg">₹</div>
                    <div>
                      <div className="text-white/90 font-medium">Flat ₹1,000</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-wider">One-time setup fee</div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4CAA3] text-lg">⚡</div>
                    <div>
                      <div className="text-white/90 font-medium">Deployed Free</div>
                      <div className="text-zinc-500 text-[10px] uppercase tracking-wider">Zero hosting costs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: CTA Button */}
              <div className="w-full lg:w-auto shrink-0">
                <button className="w-full lg:w-auto bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-xs tracking-[0.15em] uppercase px-8 py-5 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,202,163,0.15)] hover:scale-[1.02]">
                  Hire Student Developer <span className="text-lg leading-none mt-[-2px]">↗</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* Final CTA & Footer (Appended Section) */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4CAA3]/5 blur-[120px] rounded-t-full pointer-events-none"></div>
        
        {/* Main CTA Block */}
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
          <div className="inline-block border border-[#D4CAA3]/30 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-6 uppercase font-light bg-[#D4CAA3]/5">FOUNDING COHORT NOW OPEN</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F9F6EE] mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            Secure Your Status as a Founding Member.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans font-light max-w-2xl mx-auto mb-10">
            We are onboarding the first 20 elite exporters to define the new standard of Indian trade. Founding members receive lifetime fee protection and priority Agent Ekayan deployment. Public access waitlist begins Q4 2026.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-sm tracking-[0.1em] uppercase px-10 py-5 rounded-sm transition-all shadow-[0_0_20px_rgba(212,202,163,0.15)] hover:scale-[1.02]"
            >
              GET EARLY ACCESS ↗
            </button>
            <button className="text-[#F9F6EE] hover:text-[#D4CAA3] font-sans font-light text-sm tracking-wider uppercase border-b border-transparent hover:border-[#D4CAA3] transition-all pb-1">
              View Member Benefits
            </button>
          </div>
        </div>

        {/* Standard Footer Links */}
        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Branding */}
          <div className="flex items-center gap-8">
            <div className="font-serif text-xl font-bold tracking-tight text-[#F9F6EE]">
              HINDTRADE AI
            </div>
            <div className="hidden md:flex gap-6 text-xs font-sans text-zinc-500 font-light tracking-wider">
              <a href="#engine" className="hover:text-white transition-colors">Engine</a>
              <a href="#network" className="hover:text-white transition-colors">Network</a>
              <a href="#docs" className="hover:text-white transition-colors">Docs</a>
              <a href="#beta" className="hover:text-[#D4CAA3] transition-colors">Beta Program</a>
            </div>
          </div>

          {/* Right: Copyright & Socials */}
          <div className="flex items-center gap-6 text-xs font-sans text-zinc-600">
            <span>© 2026 HindTrade AI. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">X (Twitter)</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[15px] p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#000000] border border-[#DEFF9A]/20 p-8 md:p-10 max-w-lg w-full relative shadow-[0_0_50px_rgba(222,255,154,0.05)]"
              >
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSubmitted(false);
                  }}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {!isSubmitted ? (
                  <>
                    <h3 className="text-2xl md:text-3xl font-serif text-[#F9F6EE] mb-2 tracking-tight">
                      Secure Your Status as a Founding Member
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 font-sans tracking-wide mb-8">
                      Join the elite 20 exporters defining the new standard of Indian Trade.
                    </p>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setIsSubmitting(true);
                        setTimeout(() => {
                          setIsSubmitting(false);
                          setIsSubmitted(true);
                        }, 2000);
                      }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col">
                        <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Organization / MSME Name</label>
                        <input 
                          type="text" 
                          required
                          className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Professional Email</label>
                        <input 
                          type="email" 
                          required
                          className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Primary Export Category</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g., Sports Goods, Textiles"
                          className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors placeholder-zinc-700"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#DEFF9A] text-[#000000] font-sans font-bold text-xs tracking-[0.2em] uppercase py-4 mt-4 shadow-[0_0_20px_rgba(222,255,154,0.3)] hover:shadow-[0_0_30px_rgba(222,255,154,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? "PROCESSING" : "RESERVE MY SPOT"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center text-center space-y-6">
                    <div className="w-12 h-12 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-serif text-[#F9F6EE]">Access Granted</h4>
                      <div className="relative pt-4 flex flex-col items-center">
                        <div className="text-[10px] font-sans tracking-[0.25em] text-[#DEFF9A] uppercase font-bold animate-pulse">
                          Identity Verified
                        </div>
                        <div className="text-[9px] font-sans tracking-[0.2em] text-zinc-500 uppercase mt-1">
                          Priority Queue Assigned
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
