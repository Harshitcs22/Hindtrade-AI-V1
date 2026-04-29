"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide04 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 04 · Agent Ekayan</div>
      </div>

      {/* Soft gold radial gradient in top-right corner */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4CAA3]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] opacity-[0.04] z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/images/LOGO.png"
          alt="Konark Chakra"
          className="w-full h-full object-contain invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5]"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[80vh]">

        {/* Top Impact Bar */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
            style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
          >
            Deterministic Reasoning. Not Probabilistic Guesswork.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#E5E5E5] font-sans font-extralight italic"
          >
            "From 21 days of manual chaos to 3 minutes of legally-defensible precision."
          </motion.p>
        </div>

        {/* Two-Column Contrast Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Left Column: The Risk */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 bg-white/[0.01] border-[0.5px] border-red-900/20"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border-[0.5px] border-red-500/30 flex items-center justify-center text-red-400 text-sm">
                ⚠️
              </div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light text-[#E5E5E5] tracking-[0.1em] uppercase">Standard LLMs</h3>
            </div>
            <p className="text-xs md:text-sm text-zinc-400 font-sans font-extralight leading-relaxed">
              Probabilistic pattern matching. Statistically plausible but legally indefensible. High risk of HSN hallucination.
            </p>
          </motion.div>

          {/* Right Column: The Moat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 bg-white/[0.02] border-[0.5px] border-[#D4CAA3]/20"
            style={{ boxShadow: "0 0 30px rgba(212, 202, 163, 0.05)" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border-[0.5px] border-[#D4CAA3]/30 flex items-center justify-center text-[#D4CAA3] text-sm">
                🛡️
              </div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase">Agent Ekayan</h3>
            </div>
            <p className="text-xs md:text-sm text-[#E5E5E5] font-sans font-extralight leading-relaxed">
              Proprietary Neuro-Symbolic Engine. Applies deterministic GRI 1-6 rule sequences—the statutory logic of a customs commissioner.
            </p>
          </motion.div>
        </div>

        {/* Output Highlight (Boxed Section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-[0.5px] border-[#D4CAA3]/20 bg-[#D4CAA3]/5 p-6 flex items-center space-x-6"
        >
          <div className="text-[#D4CAA3] text-3xl opacity-80">📄</div>
          <div>
            <h4 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-1">Audit-Ready Defense Packets</h4>
            <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
              Not just an AI suggestion. A court-admissible PDF containing full GRI reasoning, 8-digit ITC-HS 2022 mapping, and direct citations to the Customs Tariff Act 1975.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
});

Slide04.displayName = "Slide04";

export default Slide04;
