import React from 'react';

export const ExpertHubFeature: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A] border-b border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4CAA3]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-black">
          {/* Decorative top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">

            {/* Left Side: Copy */}
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Expert Hub & Digital Acceleration</div>
              <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-5 leading-tight">
                No Digital Footprint? <br /> Let India's Top Engineering Talent Build It.
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans font-light max-w-2xl">
                HindTrade AI requires structured data to operate autonomously. If your SME relies entirely on physical paperwork, hire vetted engineering and design talent from NITs to digitize your inventory and build a stunning custom web portfolio.
              </p>

              {/* Pricing & Value Metrics */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4CAA3] font-serif text-lg">₹</div>
                  <div>
                    <div className="text-white/90 font-medium">Flat ₹1,000</div>
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wider">One-time setup fee</div>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4CAA3] text-lg">⚡</div>
                  <div>
                    <div className="text-white/90 font-medium">Deployed Free</div>
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wider">Zero hosting costs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: CTA Button */}
            <div className="w-full lg:w-auto shrink-0">
              <button className="w-full lg:w-auto bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-xs tracking-[0.15em] uppercase px-8 py-5 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,202,163,0.15)] hover:scale-[1.02]">
                Hire Student Developer <span className="text-lg leading-none mt-[-2px]">↗</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
