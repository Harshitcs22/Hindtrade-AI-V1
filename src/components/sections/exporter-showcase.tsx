'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ExporterProfile {
  id: string;
  name: string;
  established: number;
  dealsIn: string;
  markets: string;
  shipments: string;
  experience: string;
  netWorth: string;
  isLive: boolean;
  countryCode: string;
  badges: string[];
  slug: string;
}

const ONBOARDED_PROFILES: ExporterProfile[] = [
  {
    id: "92C07E2E-B337-4072-B685-E907412BDD1A",
    name: "Akshay Exports",
    established: 1975,
    dealsIn: "sports goods and sportswear",
    markets: "23 Countries",
    shipments: "100+",
    experience: "51 Yrs",
    netWorth: "50cr",
    isLive: true,
    countryCode: "IN",
    badges: ["Gst Registered", "Iec Holder"],
    slug: "akshay-exports"
  },
  {
    id: "4A118D3F-F112-4981-A542-C109483FD22B",
    name: "Himrock Exports",
    established: 1998,
    dealsIn: "light engineering components & forging",
    markets: "14 Countries",
    shipments: "85+",
    experience: "28 Yrs",
    netWorth: "32cr",
    isLive: true,
    countryCode: "IN",
    badges: ["Gst Registered", "Oea Certified"],
    slug: "himrock-exports"
  }
];

export const ExporterShowcase: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-[#0A0A0A] overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading Context Layer */}
        <div className="text-center space-y-4 mb-16">
          <p className="font-sans text-[10px] tracking-[0.3em] font-semibold text-[#D4CAA3] uppercase">
            Live Verifications Engine
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
            Onboarded Trade Network Nodes.
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/40 to-transparent mx-auto" />
        </div>

        {/* Responsive Flex/Grid Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center max-w-5xl mx-auto">
          {ONBOARDED_PROFILES.map((profile) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative w-full max-w-2xl mx-auto group text-left flex flex-col"
            >
              {/* Premium Trade Card Component - Exact clone from Landing Page / Dashboard */}
              <div className="relative w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000000] border border-white/10 rounded-2xl py-6 px-8 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden group flex flex-col justify-between">

                {/* Luxury Metallic Glare Effect (Visible on hover) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Sleeker Logo Box */}
                      <div className="w-6 h-6 bg-gradient-to-br from-[#D4CAA3] to-[#8C825A] text-[#0A0A0A] flex items-center justify-center font-serif text-xs font-bold rounded-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                        H
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-zinc-400 text-[9px] font-sans tracking-[0.2em] font-normal uppercase">
                          VERIFIED EXPORTER
                        </span>
                        {profile.isLive && (
                          <span className="flex items-center text-emerald-500/80 text-[7px] font-sans tracking-widest font-medium uppercase">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_4px_#10b981]"></span>
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-zinc-600 font-sans text-[9px] font-normal tracking-[0.2em] uppercase">
                      {profile.countryCode}
                    </div>
                  </div>

                  {/* Title - Ultra Luxury Spacing */}
                  <div className="text-center mt-2 mb-4">
                    <h3 className="text-xl md:text-[22px] font-sans font-light tracking-[0.3em] text-white/95 uppercase">
                      {profile.name}
                    </h3>
                    <div className="text-[#D4CAA3]/70 text-[8px] tracking-[0.3em] font-sans mt-2">
                      EST. {profile.established}
                    </div>
                  </div>

                  {/* Business Profile - Dense & Sleek */}
                  <div className="border-y border-white/5 py-3 mb-4 font-sans text-[10px] font-light tracking-widest flex flex-col gap-2 px-1">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase text-[8px]">DEALS IN</span>
                      <span className="text-zinc-300 font-normal text-right">{profile.dealsIn}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase text-[8px]">MARKETS</span>
                      <span className="text-zinc-300 font-normal text-right uppercase">{profile.markets}</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div>
                      <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">SHIPMENTS</div>
                      <div className="text-white/90 text-sm md:text-base font-sans font-medium">{profile.shipments}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">EXPERIENCE</div>
                      <div className="text-white/90 text-sm md:text-base font-sans font-medium">{profile.experience}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[8px] tracking-[0.2em] uppercase mb-1 font-sans">NET WORTH</div>
                      <div className="text-[#D4CAA3] text-sm md:text-base font-sans font-medium">{profile.netWorth}</div>
                    </div>
                  </div>

                  {/* Pill Badges - Thinner borders, smaller text */}
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {profile.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="bg-white/[0.02] text-zinc-400 border border-white/10 px-3 py-1 text-[7px] font-sans tracking-[0.2em] uppercase font-light rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer & CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-white/5 w-full mt-auto">
                  <div className="text-zinc-500 text-[8px] font-sans tracking-[0.15em] uppercase truncate max-w-[280px]">
                    ID: {profile.id} <span className="mx-1 text-zinc-700">|</span> <span className="text-[#D4CAA3]/90 font-normal">VERIFIED</span>
                  </div>
                  <a
                    href={`/company/${profile.slug}`} // CRITICAL FIX: Ensures public traffic never leaks into admin root dashboard
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2 bg-white text-black font-sans text-[9px] tracking-[0.18em] font-bold uppercase hover:bg-[#D4CAA3] transition-all duration-300 flex items-center justify-center space-x-1.5 group shrink-0"
                  >
                    <span>View Profile</span>
                    <span className="text-[10px] transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
