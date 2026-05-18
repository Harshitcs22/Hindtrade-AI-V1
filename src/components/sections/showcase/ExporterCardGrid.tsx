import React from 'react';
import { ExporterProfile } from './types';

interface ExporterCardGridProps {
  profiles: ExporterProfile[];
}

export const ExporterCardGrid: React.FC<ExporterCardGridProps> = ({ profiles }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
      <div className="text-center space-y-4 mb-16">
        <p className="font-sans text-[10px] tracking-[0.3em] font-semibold text-[#D4CAA3] uppercase">
          Live Verifications Engine
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white tracking-tight uppercase">
          Onboarded Trade Network Nodes.
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/40 to-transparent mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center max-w-5xl mx-auto">
        {profiles.map((profile) => (
          <div 
            key={profile.id}
            className="w-full bg-[#0E0E10]/95 border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between hover:border-white/10 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Luxury Metallic Glare Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4CAA3]/10 border border-[#D4CAA3]/20 flex items-center justify-center font-serif text-[10px] font-bold text-[#D4CAA3] rounded-[4px]">H</div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[9px] tracking-[0.18em] font-semibold text-zinc-400 uppercase">Verified Exporter</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-sans text-[8px] tracking-[0.1em] text-emerald-500 uppercase font-medium">Live</span>
                  </div>
                </div>
                <span className="font-sans text-[9px] tracking-widest text-zinc-500 font-bold uppercase">{profile.countryCode}</span>
              </div>

              <div className="text-center space-y-1 mb-6">
                <h3 className="font-sans text-xl md:text-2xl tracking-[0.1em] font-light text-white uppercase group-hover:text-[#D4CAA3] transition-colors duration-300">{profile.name}</h3>
                <p className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Est. {profile.established}</p>
              </div>

              <div className="space-y-3 border-b border-white/5 pb-5 mb-5 font-sans text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-600 tracking-[0.15em] uppercase text-[9px] w-20 shrink-0">Deals In</span>
                  <span className="text-zinc-300 tracking-wide text-right flex-1 font-light truncate pl-4">{profile.dealsIn}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-600 tracking-[0.15em] uppercase text-[9px] w-20 shrink-0">Markets</span>
                  <span className="text-zinc-300 tracking-wider text-right flex-1 font-light uppercase">{profile.markets}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center items-center py-1 mb-5">
                <div className="space-y-0.5">
                  <p className="font-sans text-[8px] tracking-[0.15em] text-zinc-600 uppercase">Shipments</p>
                  <p className="font-sans text-lg font-light text-white">{profile.shipments}</p>
                </div>
                <div className="space-y-0.5 border-x border-white/5">
                  <p className="font-sans text-[8px] tracking-[0.15em] text-zinc-600 uppercase">Experience</p>
                  <p className="font-sans text-lg font-light text-white">{profile.experience}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-sans text-[8px] tracking-[0.15em] text-zinc-600 uppercase">Net Worth</p>
                  <p className="font-sans text-lg font-normal text-[#D4CAA3]">{profile.netWorth}</p>
                </div>
              </div>

              {/* Exporter Badge Row */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {profile.badges.map((badge, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-0.5 bg-white/[0.02] border border-white/10 text-[7px] font-sans tracking-[0.15em] uppercase text-zinc-400 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/5 w-full mt-auto">
              <div className="font-mono text-[8px] text-zinc-600 tracking-normal select-text truncate max-w-[240px]">
                ID: {profile.id.slice(0, 8)}... | <span className="text-[#D4CAA3] font-sans uppercase text-[8px] tracking-widest font-semibold">Verified Registry</span>
              </div>
              <a 
                href={`/company/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-sans text-[9px] tracking-[0.18em] font-bold uppercase hover:bg-[#D4CAA3] transition-all duration-300 flex items-center justify-center space-x-1"
              >
                <span>View Profile</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
