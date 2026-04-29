"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Slide08 = React.memo(() => {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Top Navigation */}
      <div className="absolute top-8 left-20 right-20 flex justify-between items-center z-20 text-xs tracking-[0.15em] font-[family-name:var(--font-cormorant)] font-light uppercase">
        <div className="text-[#D4CAA3]">HINDTRADE AI</div>
        <div className="text-[#D4CAA3]">Slide 08 · Legacy Trust</div>
      </div>

      {/* Soft gold radial gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4CAA3]/5 blur-[120px] rounded-full pointer-events-none z-0" />

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
            Legacy Trust. National Excellence.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm text-[#E5E5E5] font-sans font-extralight italic max-w-3xl mx-auto leading-relaxed"
          >
            "Betting a 60-year legacy on a new-age Sovereign OS. Mayor Group (Est. 1960) is not just a pilot; it’s an active operational deployment."
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

          {/* The Anchor Client */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between h-[200px]"
          >
            <div>
              <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-2 uppercase opacity-60 font-normal">Anchor Client</div>
              <h3 className="text-xl font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-2">Mayor Group (Est. 1960)</h3>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed mb-4">
                Operating in 30+ nations. Secured NDA and active deployment of HindTrade AI to automate compliance across global sports goods pipelines.
              </p>
            </div>
            <Link
              href="https://mayorfuturistic.vercel.app"
              target="_blank"
              className="text-xs text-[#D4CAA3] font-sans font-extralight flex items-center space-x-2 border-t border-[#D4CAA3]/10 pt-3 group hover:text-[#F9F6EE] transition-colors duration-300"
            >
              <span>Live Portfolio: mayorfuturistic.vercel.app</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
            </Link>
          </motion.div>

          {/* The Prestige Triple-Threat (Awards Section) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 border-[0.5px] border-[#D4CAA3]/20 bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between h-[200px]"
          >
            <div className="text-[#D4CAA3] text-xs font-sans tracking-[0.15em] mb-4 uppercase opacity-60 font-normal">National Recognition</div>
            <div className="flex flex-col space-y-2">
              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(212,202,163,0)", "0 0 15px rgba(212,202,163,0.2)", "0 0 0px rgba(212,202,163,0)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                className="flex items-center space-x-3 p-2 border border-white/5 bg-white/[0.02]"
              >
                <span className="text-lg">🏅</span>
                <div>
                  <div className="text-xs text-[#E5E5E5] font-sans font-normal">THE PRESIDENT OF INDIA</div>
                  <div className="text-[10px] text-zinc-500 font-sans font-extralight">Export Excellence</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(212,202,163,0)", "0 0 15px rgba(212,202,163,0.2)", "0 0 0px rgba(212,202,163,0)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="flex items-center space-x-3 p-2 border border-white/5 bg-white/[0.02]"
              >
                <span className="text-lg">🏅</span>
                <div>
                  <div className="text-xs text-[#E5E5E5] font-sans font-normal">THE PRIME MINISTER OF INDIA</div>
                  <div className="text-[10px] text-zinc-500 font-sans font-extralight">National Excellence</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* The Global Roadmap (Road to Dubai) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full border-[0.5px] border-[#D4CAA3]/20 bg-[#D4CAA3]/5 p-6 flex flex-col md:flex-row items-center justify-between mb-4"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-2xl animate-pulse">🌍</span>
            <div>
              <h4 className="text-base font-[family-name:var(--font-cormorant)] font-light text-[#D4CAA3] tracking-[0.1em] uppercase mb-1">Official Selection: GITEX North Star Dubai (Dec 2026)</h4>
              <p className="text-xs text-[#E5E5E5] font-sans font-extralight leading-relaxed max-w-2xl">
                Founder Discipline: Prioritizing market visits and Beta deployment over generic incubators to ensure product-market fit before the global stage.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
});

Slide08.displayName = "Slide08";

export default Slide08;
