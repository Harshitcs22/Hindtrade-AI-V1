"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide09 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 09 · Market & Competition</div>
      </div>

      {/* Soft gold radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4CAA3]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Watermark (Centered Konark Chakra) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] opacity-[0.04] z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/images/LOGO.png"
          alt="Konark Chakra"
          className="w-full h-full object-contain invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5]"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[85vh] md:h-[80vh]">

        {/* Headline & Thesis */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
            style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
          >
            $450B Export Market. Zero Neuro-Symbolic Compliance Infrastructure.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm text-[#E5E5E5] font-sans font-extralight italic max-w-4xl mx-auto leading-relaxed"
          >
            "Existing B2B platforms are static directories. Compliance tools are manual. LLM-based tools hallucinate. The neuro-symbolic statutory reasoning category does not yet exist."
          </motion.p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-6 items-center">

          {/* Left Column: TAM/SAM/SOM Funnel */}
          <div className="flex flex-col justify-center">
            <div className="text-[10px] tracking-wider text-[#D4CAA3] font-sans font-medium uppercase mb-6 text-center md:text-left">
              MARKET SIZE: THE SOVEREIGN FUNNEL
            </div>
            
            <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto md:mx-0">
              {/* TAM */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full p-6 border-[0.5px] border-[#D4CAA3]/30 bg-[#D4CAA3]/5 text-center relative"
              >
                <div className="text-[10px] tracking-wider text-zinc-500 uppercase font-sans">TAM (Total Addressable Market)</div>
                <div className="text-2xl md:text-3xl font-[family-name:var(--font-cormorant)] text-[#D4CAA3] font-light mt-1">$450B</div>
                <div className="text-xs text-zinc-400 font-sans mt-1">India's Merchandise Export Market (1.3M registered SME exporters)</div>
              </motion.div>
              
              {/* SAM */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-[85%] p-4 border-[0.5px] border-[#D4CAA3]/30 bg-[#D4CAA3]/3 text-center relative"
              >
                <div className="text-[10px] tracking-wider text-zinc-500 uppercase font-sans">SAM (Serviceable Addressable Market)</div>
                <div className="text-2xl font-[family-name:var(--font-cormorant)] text-[#D4CAA3] font-light mt-1">~300,000</div>
                <div className="text-xs text-zinc-400 font-sans mt-1">Active exporters with recurring classification + documentation needs</div>
              </motion.div>
              
              {/* SOM */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="w-[70%] p-4 border-[0.5px] border-[#D4CAA3]/30 bg-[#D4CAA3]/1 text-center relative"
              >
                <div className="text-[10px] tracking-wider text-zinc-500 uppercase font-sans">SOM (Serviceable Obtainable Market)</div>
                <div className="text-xl md:text-2xl font-[family-name:var(--font-cormorant)] text-[#D4CAA3] font-light mt-1">20 → 500 → 5,000</div>
                <div className="text-[10px] text-zinc-400 font-sans mt-1">20 founding cohort → 500 by EOY → 5K by Y2</div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Competitive Landscape */}
          <div className="flex flex-col justify-center">
            <div className="text-[10px] tracking-wider text-[#D4CAA3] font-sans font-medium uppercase mb-6 text-center md:text-left">
              COMPETITIVE LANDSCAPE
            </div>

            <div className="flex flex-col space-y-4 font-sans text-xs">
              {/* Competitor 1 */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01]"
              >
                <div className="text-[#D4CAA3] font-medium mb-1">IndiaMart / TradeIndia</div>
                <p className="text-zinc-400 font-extralight leading-relaxed">
                  Static directories. No compliance. No AI. No identity verification. Dead catalog problem.
                </p>
              </motion.div>

              {/* Competitor 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01]"
              >
                <div className="text-[#D4CAA3] font-medium mb-1">General LLM Tools (ChatGPT/Gemini)</div>
                <p className="text-zinc-400 font-extralight leading-relaxed">
                  Probabilistic. Legally indefensible. Our wedge: <span className="italic font-light text-zinc-300">"You wouldn't use ChatGPT to file your tax return."</span>
                </p>
              </motion.div>

              {/* Competitor 3 */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01]"
              >
                <div className="text-[#D4CAA3] font-medium mb-1">Traditional CHAs (Customs Brokers)</div>
                <p className="text-zinc-400 font-extralight leading-relaxed">
                  Human-dependent, slow, expensive, no scale. Our CHA Network converts them into platform partners, not competition.
                </p>
              </motion.div>

              {/* Competitor 4 (HindTrade AI) */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="p-4 border-[0.5px] border-[#D4CAA3]/50 bg-[#D4CAA3]/5 shadow-[0_0_20px_rgba(212,202,163,0.1)]"
              >
                <div className="text-[#D4CAA3] font-bold mb-1 flex items-center justify-between">
                  <span>HindTrade AI</span>
                  <span className="text-[8px] border border-[#D4CAA3]/50 px-1.5 py-0.5 uppercase tracking-widest font-normal">Our Wedge</span>
                </div>
                <p className="text-[#E5E5E5] font-light leading-relaxed">
                  The only deterministic, GRI-compliant, audit-ready classification engine with integrated SME identity. Category creator.
                </p>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Bottom Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex justify-center items-center gap-4 border-t border-[#D4CAA3]/10 pt-4 mb-4"
        >
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium uppercase">
            Category Creator
          </span>
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium uppercase">
            1.3M SME TAM
          </span>
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium uppercase">
            Zero Direct Competitors
          </span>
        </motion.div>

      </div>
    </section>
  );
});

Slide09.displayName = "Slide09";

export default Slide09;
