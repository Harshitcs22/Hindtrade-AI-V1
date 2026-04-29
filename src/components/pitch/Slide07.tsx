"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide07 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 07 · The Wedge Strategy</div>
      </div>

      {/* Soft gold radial gradient */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4CAA3]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[85vh] md:h-[80vh]">

        {/* Headline & Thesis */}
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
            style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
          >
            The Wedge Strategy
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.15em] uppercase mb-4"
          >
            Classification as the Low-CAC Entry Point.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm text-[#E5E5E5] font-sans font-extralight italic max-w-2xl mx-auto leading-relaxed"
          >
            "Every exporter classifies products. It's a universal, recurring, high-stakes pain point. We enter there — and expand to own the entire trade stack."
          </motion.p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-4">

          {/* The Gateway Play */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-sm"
          >
            <h4 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-3">The "Gateway" Play</h4>
            <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed mb-4">
              HSN classification is compliance-mandatory and legally consequential. We acquire customers on classification urgency (Low-CAC), then expand into the full OS.
            </p>
            <div className="text-[10px] text-zinc-500 font-sans italic border-t border-[#D4CAA3]/10 pt-3">
              Strategic Precedent: Mirroring the growth playbooks of Shopify and Stripe.
            </div>
          </motion.div>

          {/* The Expansion Arc (Revenue Funnel) */}
          <div className="flex flex-col space-y-3">
            {/* Tier 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-4 border-[0.5px] border-[#D4CAA3]/30 bg-[#D4CAA3]/5 flex justify-between items-center group hover:border-[#D4CAA3]/60 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#D4CAA3] text-sm font-[family-name:var(--font-cormorant)] font-light">01</span>
                <span className="text-[#D4CAA3] font-[family-name:var(--font-cormorant)] font-light text-sm tracking-[0.05em] uppercase">Classification-as-a-Service</span>
              </div>
              <span className="text-xs text-[#D4CAA3] font-sans font-normal">Recurring Usage</span>
            </motion.div>

            {/* Tier 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-[#D4CAA3]/3 flex justify-between items-center group hover:border-[#D4CAA3]/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#D4CAA3] opacity-60 text-sm font-[family-name:var(--font-cormorant)] font-light">02</span>
                <span className="text-[#D4CAA3] opacity-80 font-[family-name:var(--font-cormorant)] font-light text-sm tracking-[0.05em] uppercase">Trade Card + Platform Presence</span>
              </div>
              <span className="text-xs text-zinc-400 font-sans font-extralight">Annual SaaS</span>
            </motion.div>

            {/* Tier 3 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <span className="text-zinc-500 text-sm font-[family-name:var(--font-cormorant)] font-light">03</span>
                <span className="text-zinc-300 opacity-60 font-[family-name:var(--font-cormorant)] font-light text-sm tracking-[0.05em] uppercase">Document Automation + Logistics</span>
              </div>
              <span className="text-xs text-zinc-500 font-sans font-extralight">Rev-Share</span>
            </motion.div>

            {/* Tier 4 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="p-4 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.005] flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <span className="text-zinc-600 text-sm font-[family-name:var(--font-cormorant)] font-light">04</span>
                <span className="text-zinc-400 opacity-40 font-[family-name:var(--font-cormorant)] font-light text-sm tracking-[0.05em] uppercase">Global Demand Signals</span>
              </div>
              <span className="text-xs text-zinc-600 font-sans font-extralight">Take-Rate</span>
            </motion.div>
          </div>

        </div>

        {/* Bottom Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex justify-center items-center gap-4 border-t border-[#D4CAA3]/10 pt-4 mb-4"
        >
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium">
            LOW-CAC WEDGE
          </span>
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium">
            PLATFORM EXPANSION
          </span>
          <span className="border border-[#D4CAA3]/30 px-3 py-1 text-[10px] tracking-wider text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans font-medium">
            TAKE-RATE MODEL
          </span>
        </motion.div>

      </div>
    </section>
  );
});

Slide07.displayName = "Slide07";

export default Slide07;
