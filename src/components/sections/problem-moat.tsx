import React from 'react';

export const ProblemMoat: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#0F0F0F] border-y border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#D4CAA3]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Hero Quote */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-[34px] font-serif text-[#F9F6EE] mb-6 leading-snug">
            "Wrong HSN codes don’t just delay shipments. They trigger seizures, fines, and permanent audit flags."
          </h2>
          <p className="text-sm md:text-base text-zinc-400 font-sans font-light">
            Indian exporters lose ₹3–12 lakh per misclassified shipment. HindTrade AI closes that liability gap, while completely automating the manual lead-to-deal cycle.
          </p>
        </div>

        {/* 3-Card Tech Moat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group">
            <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Sales Bottleneck</div>
            <h3 className="text-xl font-serif text-white/90 mb-3">Static Catalogs & Manual Chaos</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              Traditional B2B relies on dead PDFs and human-dependent quotations, extending the lead-to-deal cycle to weeks.
            </p>
            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The AI Solution</div>
              <p className="text-xs text-zinc-300 font-light"> SME ingest their data into a <span className="text-white font-medium">Vector DB</span>. Our RAG-powered agents negotiate and quote autonomously 24/7.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/30 to-transparent"></div>
            <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Compliance Risk</div>
            <h3 className="text-xl font-serif text-white/90 mb-3">Probabilistic Guesswork</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              Generative AI hallucinates. Standard LLMs cannot be trusted with statutory customs documentation or HSN mapping.
            </p>
            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The Tech Moat</div>
              <p className="text-xs text-zinc-300 font-light">A proprietary <span className="text-white font-medium">Neuro-Symbolic Engine</span> that applies deterministic GRI 1-6 rules for 100% legal defensibility.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-colors group">
            <div className="text-xs tracking-[0.2em] font-sans text-zinc-500 mb-4 uppercase">Trust Deficit</div>
            <h3 className="text-xl font-serif text-white/90 mb-3">Fragmented Identity</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              International buyers don't trust WhatsApp screenshots. Verification is scattered across DGFT, CBIC, and offline audits.
            </p>
            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-[#D4CAA3] mb-1 font-medium">The Network Layer</div>
              <p className="text-xs text-zinc-300 font-light">A <span className="text-white font-medium">Unified Digital Trust Layer</span> that aggregates dynamic government data into one verifiable institutional profile.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
