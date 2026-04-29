"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide06 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 06 · The Sovereign Pipeline</div>
      </div>

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] opacity-[0.04] z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/images/LOGO.png"
          alt="Konark Chakra"
          className="w-full h-full object-contain invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5]"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[85vh] md:h-[80vh]">

        {/* Headline & Narrative */}
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
            style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
          >
            The Sovereign Workflow: Zero-to-One Execution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#E5E5E5] font-sans font-extralight"
          >
            From fragmented identity to 100% legally-defensible trade infrastructure.
          </motion.p>
        </div>

        {/* The 4-Step Linear Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 items-center relative mb-4">
          {/* Absolute arrows between columns (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[calc(25%-12px)] -translate-y-1/2 text-[#D4CAA3] text-xl z-20 opacity-60 animate-pulse">
            →
          </div>
          <div className="hidden md:block absolute top-1/2 left-[calc(50%-12px)] -translate-y-1/2 text-[#D4CAA3] text-xl z-20 opacity-60 animate-pulse">
            →
          </div>
          <div className="hidden md:block absolute top-1/2 left-[calc(75%-12px)] -translate-y-1/2 text-[#D4CAA3] text-xl z-20 opacity-60 animate-pulse">
            →
          </div>
          
          {/* Step 01 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-md p-6 h-[280px] flex flex-col justify-between relative group hover:border-[#D4CAA3]/60 transition-all duration-300"
          >
            <div>
              <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-2 uppercase opacity-60 font-normal">Step 01</div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-3">Verified Digital Identity</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                SME registers via GST/IEC. We generate a LinkedIn-style Trade Card, creating instant institutional trust for global buyers.
              </p>
            </div>
            <div className="text-xs tracking-wider text-[#D4CAA3] font-sans font-normal uppercase mt-4">
              "Identity Wedge."
            </div>
          </motion.div>

          {/* Step 02 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-md p-6 h-[280px] flex flex-col justify-between relative group hover:border-[#D4CAA3]/60 transition-all duration-300"
          >
            <div>
              <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-2 uppercase opacity-60 font-normal">Step 02</div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-3">NIT-Powered Digitization</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Physical catalogs/PDFs are ingested into a Private Vector DB via our vetted student network. Legacy data becomes AI-ready in 24 hours.
              </p>
            </div>
            <div className="text-xs tracking-wider text-[#D4CAA3] font-sans font-normal uppercase mt-4">
              "Zero-Friction Ingestion."
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-md p-6 h-[280px] flex flex-col justify-between relative group hover:border-[#D4CAA3]/60 transition-all duration-300"
          >
            <div>
              <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-2 uppercase opacity-60 font-normal">Step 03</div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-3">Agent Ekayan Activation</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Agent runs a live GRI 1-6 audit on the entire inventory. Every product receives a deterministic, court-admissible HSN classification.
              </p>
            </div>
            <div className="text-xs tracking-wider text-[#D4CAA3] font-sans font-normal uppercase mt-4">
              "GRI 1-6 Hardening."
            </div>
          </motion.div>

          {/* Step 04 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-md p-6 h-[280px] flex flex-col justify-between relative group hover:border-[#D4CAA3]/60 transition-all duration-300"
          >
            <div>
              <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-2 uppercase opacity-60 font-normal">Step 04</div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-3">Autonomous Deal Execution</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Generating audit-ready proforma invoices and defense packets. TAT reduced from 21 days to 3 minutes.
              </p>
            </div>
            <div className="text-xs tracking-wider text-[#D4CAA3] font-sans font-normal uppercase mt-4">
              "100% Legally Defensible."
            </div>
          </motion.div>
        </div>

        {/* Strategic Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center border-t border-[#D4CAA3]/10 pt-4 mb-2"
        >
          <p className="text-xs font-sans font-extralight text-[#D4CAA3] tracking-wide">
            Strategic Wedge: We acquire on classification urgency → Own the Identity → Expand to full Export OS.
          </p>
        </motion.div>

      </div>
    </section>
  );
});

Slide06.displayName = "Slide06";

export default Slide06;
