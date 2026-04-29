"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Database, FileCheck, Award } from "lucide-react";

export const Slide10B = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 10B · Mission ISGE</div>
      </div>

      {/* Soft gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4CAA3]/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Content Container */}
      <div className="max-w-5xl w-full mx-auto px-10 md:px-20 z-10 flex flex-col justify-between h-[85vh]">
        
        {/* Headline & Subtitle */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.25em] uppercase font-light mb-2"
          >
            MISSION ISGE: THE SOVEREIGN DEPLOYMENT
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm text-[#D4CAA3] font-sans font-light tracking-[0.2em] uppercase mb-6"
          >
            7-10 MAY, 2026 @ NIT JALANDHAR
          </motion.div>

          {/* Core Mission Statement (Gold Border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="border-[0.5px] border-[#D4CAA3]/30 bg-[#D4CAA3]/5 px-8 py-4 max-w-2xl mx-auto backdrop-blur-sm"
          >
            <p className="text-sm md:text-base font-[family-name:var(--font-cormorant)] text-[#F9F6EE] italic tracking-wide">
              "To transition from laboratory-hardened logic to on-ground trade execution."
            </p>
          </motion.div>
        </div>

        {/* 3 Strategic Objectives (Clean List/Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch flex-grow">
          
          {/* Objective 01 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-[0.5px] border-white/10 bg-white/[0.01] p-5 flex flex-col justify-between backdrop-blur-sm relative group hover:border-[#D4CAA3]/30 transition-colors"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-4 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> OBJECTIVE 01
              </div>
              <h3 className="text-sm font-sans font-medium text-[#F9F6EE] mb-3">
                Live Ingestion & Hardening
              </h3>
              <p className="text-xs text-zinc-400 font-extralight leading-relaxed mb-4">
                <span className="text-zinc-300 font-light block mb-1">Action:</span>
                On-the-spot digitization of 100+ physical product catalogs from Jalandhar/Ludhiana exporters into our Private Vector DB.
              </p>
            </div>
            <div className="border-t border-white/5 pt-3 mt-auto">
              <p className="text-[10px] text-[#D4CAA3] font-sans font-light">
                <span className="font-medium uppercase tracking-wider block text-[8px] text-zinc-500 mb-0.5">Goal</span>
                Hardening Agent Ekayan’s reasoning against real-world, messy trade data.
              </p>
            </div>
          </motion.div>

          {/* Objective 02 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-[0.5px] border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between backdrop-blur-sm relative group hover:border-[#D4CAA3]/30 transition-colors"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-4 flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5" /> OBJECTIVE 02
              </div>
              <h3 className="text-sm font-sans font-medium text-[#F9F6EE] mb-3">
                The HSN Liability Audit
              </h3>
              <p className="text-xs text-zinc-400 font-extralight leading-relaxed mb-4">
                <span className="text-zinc-300 font-light block mb-1">Action:</span>
                Conducting 50+ live Statutory Compliance Audits.
              </p>
            </div>
            <div className="border-t border-white/5 pt-3 mt-auto">
              <p className="text-[10px] text-[#D4CAA3] font-sans font-light">
                <span className="font-medium uppercase tracking-wider block text-[8px] text-zinc-500 mb-0.5">Goal</span>
                Identifying high-stakes HSN misclassifications for MSMEs to demonstrate immediate ROI of the Sovereign OS.
              </p>
            </div>
          </motion.div>

          {/* Objective 03 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-[0.5px] border-white/10 bg-white/[0.01] p-5 flex flex-col justify-between backdrop-blur-sm relative group hover:border-[#D4CAA3]/30 transition-colors"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> OBJECTIVE 03
              </div>
              <h3 className="text-sm font-sans font-medium text-[#F9F6EE] mb-3">
                The Founding Cohort Lock-in
              </h3>
              <p className="text-xs text-zinc-400 font-extralight leading-relaxed mb-4">
                <span className="text-zinc-300 font-light block mb-1">Action:</span>
                Finalizing the 20 Elite Exporters for the Founding Cohort.
              </p>
            </div>
            <div className="border-t border-white/5 pt-3 mt-auto">
              <p className="text-[10px] text-[#D4CAA3] font-sans font-light">
                <span className="font-medium uppercase tracking-wider block text-[8px] text-zinc-500 mb-0.5">Goal</span>
                Issuing the first batch of Verified Trade Cards to be used in live interactions with global buyers at the Expo.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Founder's Note (Glassmorphism Box) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/[0.02] border border-white/5 p-4 backdrop-blur-md text-center max-w-3xl mx-auto mb-4"
        >
          <p className="text-xs font-sans font-extralight text-[#F9F6EE] leading-relaxed tracking-wide">
            "ISGE Expo is our 0-1 Battleground. We are here to prove that Digital Trust is not a concept—it's a verifiable, audit-ready infrastructure."
          </p>
        </motion.div>

      </div>
    </section>
  );
});

Slide10B.displayName = "Slide10B";

export default Slide10B;
