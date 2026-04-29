"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server, MapPin, Users, Calendar, ArrowRight } from "lucide-react";

export const Slide11 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 11 · The Sovereign Ask</div>
      </div>

      {/* Soft gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4CAA3]/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-10 md:px-20 z-10 flex flex-col justify-between h-[85vh]">
        
        {/* Headline & Thesis */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.2em] uppercase font-light mb-4"
          >
            THE SOVEREIGN DEPLOYMENT: THE ASK
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm text-[#D4CAA3] font-sans font-light italic tracking-wide max-w-2xl mx-auto"
          >
            "We are not asking for permission to build. We are asking for the fuel to deploy what already works."
          </motion.p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-stretch flex-grow">
          
          {/* Column 1: The Infrastructure (The Fuel) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.01] p-6 flex flex-col justify-between backdrop-blur-sm"
          >
            <div>
              <div className="text-xs tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <Server className="w-4 h-4" /> INCUBATION & COMPUTE
              </div>
              
              <div className="space-y-4 font-sans text-xs text-zinc-300 font-extralight leading-relaxed">
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">NITJ TBI Seat</span>
                  Full-time infrastructure support at NIT Jalandhar.
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Seed Grant</span>
                  Directed towards Vector DB scaling and GRI 1-6 hardening to 100% statutory coverage.
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">AI Compute Credits</span>
                  Funding for GPU/Server overheads for Agent Ekayan’s 24/7 lead handling.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: On-Ground Alpha (The 0-1 Execution) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.02] p-6 flex flex-col justify-between backdrop-blur-sm"
          >
            <div>
              <div className="text-xs tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> THE LOCAL ADVANTAGE
              </div>
              
              <div className="space-y-4 font-sans text-xs text-zinc-300 font-extralight leading-relaxed">
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Giant Exporter Access</span>
                  Direct on-ground research and validation with Jalandhar/Ludhiana’s legacy giants (Mayor Group & others).
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Buyer Interaction</span>
                  Real-world testing with global buyers to refine the "Trade Card" trust signals.
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">NITJ Synergy</span>
                  Hardening the 0-1 engine right here in the heart of the sports and textile export hub.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: The Founding Cohort (The Launch) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.01] p-6 flex flex-col justify-between backdrop-blur-sm"
          >
            <div>
              <div className="text-xs tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <Users className="w-4 h-4" /> 20 ELITE EXPORTERS
              </div>
              
              <div className="space-y-4 font-sans text-xs text-zinc-300 font-extralight leading-relaxed">
                <div className="p-3 bg-[#D4CAA3]/5 border border-[#D4CAA3]/20">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Sovereign Waitlist</span>
                  First 20 SMEs receive Lifetime Fee Protection and priority deployment.
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Urgency</span>
                  Public access waitlist opens Q4 2026.
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[#F9F6EE] font-medium block mb-1">Revenue Validation</span>
                  Converting the founding 20 into immediate operational case studies.
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Section: 18-Month Milestones (Horizontal Timeline) */}
        {/* Bottom Section: ISGE Expo Announcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="border-t border-white/10 pt-6 mb-6 text-center flex flex-col items-center justify-center"
        >
          <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-2 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> UPCOMING DEPLOYMENT
          </div>
          <div className="text-xl md:text-2xl font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.1em] font-light uppercase">
            ISGE EXPO
          </div>
          <div className="text-sm text-[#D4CAA3] font-sans font-extralight mt-1 tracking-wider">
            7-10 May, 2026 @ NIT Jalandhar
          </div>
        </motion.div>

        {/* Final Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-center border-t border-white/5 pt-4 mb-4"
        >
          <span className="text-xs md:text-sm font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.2em] font-light uppercase">
            BUILDING THE TRUST LAYER FOR A $5T ECONOMY. RIGHT HERE AT NIT JALANDHAR.
          </span>
        </motion.div>

      </div>
    </section>
  );
});

Slide11.displayName = "Slide11";

export default Slide11;
