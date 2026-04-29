"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide05 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 05 · Sovereign Stack</div>
      </div>

      {/* Soft gold radial gradient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4CAA3]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[80vh]">

        {/* Headline */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
            style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
          >
            The Three-Layer Sovereign Infrastructure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#E5E5E5] font-sans font-extralight"
          >
            Identity → Compliance → Documentation. Each layer compounds the moat of the next.
          </motion.p>
        </div>

        {/* The Stack */}
        <div className="flex flex-col space-y-4 max-w-3xl mx-auto w-full mb-6">
          {/* Layer 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-6 p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] hover:border-[#D4CAA3]/40 transition-colors duration-300"
          >
            <div className="text-3xl font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] opacity-60">01</div>
            <div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-1">Layer 1: Identity (Autonomous Trade Card)</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                <span className="text-[#D4CAA3]">The "Network Entry Wedge."</span> A verifiable business passport (IEC + GST + History). Instant trust with global buyers.
              </p>
            </div>
          </motion.div>

          {/* Layer 2 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center space-x-6 p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] hover:border-[#D4CAA3]/40 transition-colors duration-300"
          >
            <div className="text-3xl font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] opacity-60">02</div>
            <div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-1">Layer 2: Intelligence (Agent Ekayan)</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                <span className="text-[#D4CAA3]">The "Compliance Engine."</span> RAG-powered inventory understanding. Live GRI audits on every product.
              </p>
            </div>
          </motion.div>

          {/* Layer 3 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center space-x-6 p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] hover:border-[#D4CAA3]/40 transition-colors duration-300"
          >
            <div className="text-3xl font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] opacity-60">03</div>
            <div>
              <h3 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-1">Layer 3: Execution (Zero-Touch Documentation)</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                <span className="text-[#D4CAA3]">The "Efficiency Layer."</span> Auto-generation of customs-proof proforma invoices and packing lists.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Slide05.displayName = "Slide05";

export default Slide05;
