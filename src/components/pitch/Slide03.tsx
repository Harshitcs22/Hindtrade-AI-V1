"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide03 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 03 · The Triple Crisis</div>
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
      <div className="max-w-7xl w-full mx-auto px-20 z-10 flex flex-col justify-between h-[85vh] md:h-[80vh]">

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
            The Invisible Exporter: A Triple Crisis.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#E5E5E5] font-sans font-extralight max-w-3xl mx-auto leading-relaxed"
          >
            1.3M SMEs are digitally invisible, legally vulnerable, and operationally paralyzed.
          </motion.p>
        </div>

        {/* 3-Column Failure Mode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] p-8 flex flex-col justify-between h-80 relative hover:border-[#D4CAA3]/50 transition-all duration-500 group"
          >
            <div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-4">Institutional Invisibility</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Zero verifiable digital footprint. Exporters rely on WhatsApp screenshots and dead catalogs, failing every global 'Know Your Business' (KYB) check.
              </p>
            </div>
            <div>
              <div className="text-lg font-sans font-normal text-[#D4CAA3] mb-1 tracking-wider group-hover:text-white transition-colors duration-500">DIGITALLY INVISIBLE</div>
              <div className="text-[9px] tracking-wider text-zinc-500 uppercase font-sans font-extralight">The Identity Void</div>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] p-8 flex flex-col justify-between h-80 relative hover:border-[#D4CAA3]/50 transition-all duration-500 group"
          >
            <div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-4">The ₹12L Liability Gap</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Probabilistic guessing of HSN codes leads to seizures and permanent audit flags. Standard LLMs hallucinate; manual checkers fail.
              </p>
            </div>
            <div>
              <div className="text-lg font-sans font-normal text-[#EF4444]/80 mb-1 tracking-wider" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.2)" }}>₹3L - ₹12L LOSS</div>
              <div className="text-[9px] tracking-wider text-zinc-500 uppercase font-sans font-extralight">The Compliance Abyss</div>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] p-8 flex flex-col justify-between h-80 relative hover:border-[#D4CAA3]/50 transition-all duration-500 group"
          >
            <div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-4">The 21-Day Deal Cycle</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed">
                Legacy paperwork creates a sales bottleneck. 70% of engineering/admin bandwidth is burnt on zero-value data re-entry.
              </p>
            </div>
            <div>
              <div className="text-lg font-sans font-normal text-[#D4CAA3] mb-1 tracking-wider group-hover:text-white transition-colors duration-500">70% BANDWIDTH DRAIN</div>
              <div className="text-[9px] tracking-wider text-zinc-500 uppercase font-sans font-extralight">The Operational Debt</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Context */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center border-t border-[#D4CAA3]/10 pt-4"
        >
          <p className="text-xs font-sans font-extralight text-[#E5E5E5]">
            <span className="text-[#D4CAA3] font-normal">Compounding Liability:</span> Resolving this requires a deterministic trust architecture.
          </p>
        </motion.div>

      </div>
    </section>
  );
});

Slide03.displayName = "Slide03";

export default Slide03;
