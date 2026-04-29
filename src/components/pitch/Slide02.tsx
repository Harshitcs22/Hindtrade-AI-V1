"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide02 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 02 · Category Creator</div>
      </div>

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] opacity-[0.04] z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/images/LOGO.png"
          alt="Konark Chakra"
          className="w-full h-full object-contain invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5]"
        />
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-20 text-center z-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] mb-6 uppercase"
        >
          THE END OF UNVERIFIED LEADS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
          style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
        >
          Not just another B2B marketplace.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-4xl md:text-6xl font-[family-name:var(--font-cormorant)] font-light tracking-[0.15em] uppercase mb-8"
        >
          <span className="text-[#D4CAA3]">A VERIFIED </span>
          <motion.span
            className="text-[#D4CAA3] inline-block"
            initial={{ textShadow: "0 0 0px rgba(212, 202, 163, 0)" }}
            whileInView={{ textShadow: "0 0 30px rgba(212, 202, 163, 0.6)" }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            SOVEREIGN NETWORK.
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-sm md:text-base text-[#E5E5E5] font-sans font-extralight max-w-2xl leading-relaxed"
        >
          Moving from fragmented static directories to a unified infrastructure of trust and automated compliance.
        </motion.p>
      </div>
    </section>
  );
});

Slide02.displayName = "Slide02";

export default Slide02;
