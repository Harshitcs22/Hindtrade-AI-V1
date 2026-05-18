import React from 'react';

export const EkayanFeature: React.FC = () => {
  return (
    <section className="py-32 md:py-40 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5 md:flex-row-reverse bg-[#0A0A0A]">

      {/* Left Side: Real Dashboard Screenshot */}
      <div className="order-2 md:order-1 relative group w-full flex justify-center">
        {/* Decorative glow behind the image */}
        <div className="absolute inset-0 bg-[#D4CAA3]/10 blur-3xl rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="relative w-full max-w-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80">
          <img
            src="/images/ekayan-engine.png"
            alt="Agent Ekayan Statutory Classification Instrument"
            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Right Side: Copy & Explanation */}
      <div className="order-1 md:order-2 flex flex-col justify-center">
        <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Meet Agent Ekayan</div>
        <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
          Statutory Classification. Zero Guesswork.
        </h3>
        <p className="text-slate-400 mb-6 text-base md:text-lg leading-relaxed font-sans font-light">
          Standard AI guesses. Agent Ekayan reasons. It applies deterministic General Rules of Interpretation (GRI 1–6) to your product catalogs, ensuring every HSN code is legally defensible.
        </p>
        <div className="space-y-4 border-l border-white/10 pl-5">
          <div>
            <h4 className="text-white/90 font-serif text-sm mb-1">Noun Extraction & Legal Note Audit</h4>
            <p className="text-zinc-500 text-xs font-light">Ekayan scans chapter exclusions and legal notes before making a decision.</p>
          </div>
          <div>
            <h4 className="text-white/90 font-serif text-sm mb-1">GRI Sequence Application</h4>
            <p className="text-zinc-500 text-xs font-light">Strict adherence to statutory hierarchy, providing a full legal trace for every classification.</p>
          </div>
        </div>
      </div>

    </section>
  );
};
