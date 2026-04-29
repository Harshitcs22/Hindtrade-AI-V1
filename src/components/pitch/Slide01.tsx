"use client";

import React from "react";
import { motion } from "framer-motion";

export const Slide01 = React.memo(() => {
  return (
    <motion.section
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]"
    >
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 01 · Intro & Thesis</div>
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
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 text-center z-10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            textShadow: [
              "0 0 20px rgba(212, 202, 163, 0.45), 0 0 40px rgba(212, 202, 163, 0.2)",
              "0 0 10px rgba(212, 202, 163, 0.2), 0 0 20px rgba(212, 202, 163, 0.1)",
              "0 0 20px rgba(212, 202, 163, 0.45), 0 0 40px rgba(212, 202, 163, 0.2)"
            ]
          }}
          transition={{
            opacity: { duration: 0.8 },
            textShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-4xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-[1.2] tracking-tight max-w-3xl mx-auto"
          style={{ textShadow: "0 0 30px rgba(249, 246, 238, 0.2)" }}
        >
          THE OPERATING SYSTEM FOR SOVEREIGN TRADE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-xl text-[#E5E5E5] font-sans font-light max-w-3xl mb-8 leading-snug"
        >
          India exports $450B annually. Zero exporters have a verifiable digital identity. Every shipment is a liability event waiting to happen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex space-x-4"
        >
          <span className="border-[0.5px] border-[#D4CAA3]/50 shadow-[0_0_10px_rgba(212,202,163,0.2)] px-4 py-1.5 rounded-none text-[10px] font-sans tracking-[0.2em] text-[#D4CAA3] uppercase bg-[#D4CAA3]/5">
            NEURO-SYMBOLIC AI
          </span>
          <span className="border-[0.5px] border-[#D4CAA3]/50 shadow-[0_0_10px_rgba(212,202,163,0.2)] px-4 py-1.5 rounded-none text-[10px] font-sans tracking-[0.2em] text-[#D4CAA3] uppercase bg-[#D4CAA3]/5">
            GRI 1-6 ENGINE
          </span>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#D4CAA3]/30 border-t border-[#D4CAA3]/20 pt-4 text-left">
          <div className="px-2">
            <div className="text-zinc-600 text-[8px] tracking-[0.2em] mb-1 font-sans font-semibold uppercase">FOUNDER</div>
            <div className="text-zinc-300 text-[10px] tracking-wider font-sans font-medium">Harshit Choudhary · NIT Jalandhar</div>
          </div>
          <div className="px-2">
            <div className="text-zinc-600 text-[8px] tracking-[0.2em] mb-1 font-sans font-semibold uppercase">MISSION</div>
            <div className="text-zinc-300 text-[10px] tracking-wider font-sans font-medium">Build the Digital Trust Layer for 1.3M Indian SME Exporters</div>
          </div>
          <div className="px-2">
            <div className="text-zinc-600 text-[8px] tracking-[0.2em] mb-1 font-sans font-semibold uppercase">ASK</div>
            <div className="text-zinc-300 text-[10px] tracking-wider font-sans font-medium">NITJ TBI Incubation + Seed Grant</div>
          </div>
          <div className="px-2">
            <div className="text-zinc-600 text-[8px] tracking-[0.2em] mb-1 font-sans font-semibold uppercase">STAGE</div>
            <div className="text-zinc-300 text-[10px] tracking-wider font-sans font-medium">Pre-Seed / Incubation</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

Slide01.displayName = "Slide01";

export default Slide01;
