"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";

export const Slide10 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 10 · Sovereign Growth Architecture</div>
      </div>

      {/* Soft gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4CAA3]/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Watermark (Centered Konark Chakra) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-[0.03] z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/images/LOGO.png"
          alt="Konark Chakra"
          className="w-full h-full object-contain invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5]"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl w-full mx-auto px-10 md:px-20 z-10 flex flex-col justify-between h-[80vh]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.2em] uppercase font-light"
          >
            THE ECONOMICS OF SOVEREIGN TRADE
          </motion.h2>
        </div>

        {/* Bento Grid (Asymmetric 3 Columns mapped to 4-col grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-stretch flex-grow">
          
          {/* Column 1: The Wedge (Unit Economics) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.01] p-6 flex flex-col justify-between relative backdrop-blur-sm"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <Target className="w-3 h-3" /> MONETIZATION & ALPHA
              </div>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <CheckCircle className="w-4 h-4 text-[#D4CAA3] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#F9F6EE] font-medium">MSME Sovereign</span>
                    <span className="text-[#D4CAA3] block mt-0.5">₹5,000/mo</span>
                    <p className="text-zinc-400 font-extralight mt-1">Digital Identity + Agent Ekayan Basic.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <CheckCircle className="w-4 h-4 text-[#D4CAA3] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#F9F6EE] font-medium">Enterprise Custom</span>
                    <span className="text-[#D4CAA3] block mt-0.5">₹15k - 20k/mo</span>
                    <p className="text-zinc-400 font-extralight mt-1">High-volume manufacturing clusters.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <CheckCircle className="w-4 h-4 text-[#D4CAA3] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#F9F6EE] font-medium">Transactional</span>
                    <span className="text-[#D4CAA3] block mt-0.5">₹100/Report</span>
                    <p className="text-zinc-400 font-extralight mt-1">Per-HSN Statutory Audit Reports (Zero Marginal Cost).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-[10px] font-sans font-extralight text-zinc-500 italic mb-2">
                "Leveraging NIT Student Network for low-burn data ingestion."
              </p>
              <div className="text-xs font-sans font-medium text-[#D4CAA3] mt-2">
                0% Commission on Deals. Killing Middlemen Tax.
              </div>
            </div>
          </motion.div>

          {/* Column 2: The Scale (Financial Matrix) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.02] p-6 flex flex-col justify-between relative backdrop-blur-sm"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> HYPER-GROWTH PROJECTIONS
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 font-light text-[10px] tracking-wider uppercase">
                      <th className="py-2 font-normal">Users</th>
                      <th className="py-2 font-normal">ARR (Sub)</th>
                      <th className="py-2 font-normal">Gross Profit</th>
                      <th className="py-2 font-normal text-right">Valuation (20x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-extralight text-zinc-300">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-[#F9F6EE]">10</td>
                      <td className="py-3">₹6L - 18L</td>
                      <td className="py-3 text-[#D4CAA3]">88%</td>
                      <td className="py-3 text-right">₹3Cr+</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-[#F9F6EE]">100</td>
                      <td className="py-3">₹60L - 1.8Cr</td>
                      <td className="py-3 text-[#D4CAA3]">92%</td>
                      <td className="py-3 text-right">₹30Cr+</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-[#F9F6EE]">1,000</td>
                      <td className="py-3">₹6Cr - 18Cr</td>
                      <td className="py-3 text-[#D4CAA3]">96%</td>
                      <td className="py-3 text-right">₹300Cr+</td>
                    </tr>
                    <tr className="bg-[#D4CAA3]/5 border-y border-[#D4CAA3]/20 hover:bg-[#D4CAA3]/10 transition-colors">
                      <td className="py-3 font-semibold text-[#F9F6EE]">10,000</td>
                      <td className="py-3 font-semibold text-[#F9F6EE]">₹180Cr+</td>
                      <td className="py-3 font-semibold text-[#D4CAA3]">98%</td>
                      <td className="py-3 font-semibold text-right text-[#F9F6EE]">$400M+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-right">
              <span className="text-[8px] border border-[#D4CAA3]/30 px-1.5 py-0.5 uppercase tracking-widest text-[#D4CAA3] bg-[#D4CAA3]/5 font-sans">
                Unicorn Path
              </span>
            </div>
          </motion.div>

          {/* Column 3: The Vision (Sovereign Ecosystem) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-1 border-[0.5px] border-[#D4CAA3]/10 bg-white/[0.01] p-6 flex flex-col justify-between relative backdrop-blur-sm"
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#D4CAA3] font-sans font-semibold uppercase mb-6 flex items-center gap-2">
                <Zap className="w-3 h-3" /> FUTURE ECOSYSTEM
              </div>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">Precedent Analysis</span>
                  <p className="text-zinc-300 font-extralight italic leading-relaxed">
                    "Mirroring Stripe/Shopify (Acquire on Urgency → Expand to full OS)."
                  </p>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <ArrowRight className="w-3 h-3 text-[#D4CAA3] mt-1 flex-shrink-0" />
                  <p className="text-zinc-300 font-extralight">
                    <span className="text-[#F9F6EE] font-normal block">CHA Leads</span>
                    Monetizing ready-to-export SME funnel to Custom House Agents.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 text-[#D4CAA3] mt-1 flex-shrink-0" />
                  <p className="text-zinc-300 font-extralight">
                    <span className="text-[#F9F6EE] font-normal block">Logistics Integration</span>
                    Real-time bidding (1-2% convenience fee on deals).
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 text-[#D4CAA3] mt-1 flex-shrink-0" />
                  <p className="text-zinc-300 font-extralight">
                    <span className="text-[#F9F6EE] font-normal block">API Licensing</span>
                    Agent Ekayan as the compliance API for global platforms.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 opacity-0">
              {/* Spacer for alignment */}
            </div>
          </motion.div>

        </div>

        {/* Footer Zinger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center border-t border-white/5 pt-6 mb-4"
        >
          <span className="text-lg md:text-xl font-[family-name:var(--font-cormorant)] text-[#F9F6EE] tracking-[0.2em] font-light uppercase">
            CAPTURING JUST 0.01% OF INDIA’S GLOBAL EXPORT MARKET.
          </span>
        </motion.div>

      </div>
    </section>
  );
});

Slide10.displayName = "Slide10";

export default Slide10;
