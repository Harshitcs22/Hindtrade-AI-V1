import React from 'react';

export const CoreInfrastructure: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A] border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-3 uppercase font-medium">The Solution Ecosystem</div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F9F6EE] tracking-tight">
              Core Infrastructure
            </h2>
          </div>
          <p className="text-sm text-zinc-400 font-light max-w-sm text-left md:text-right">
            A complete operating system to manage digital identity, autonomous compliance, and global growth for Indian SMEs.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Trade Card */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🪪</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">Autonomous Trade Card</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Your verified "LinkedIn-style" business passport. A dynamic, public-facing profile that aggregates your IEC, GST, and operational history to build instant trust with global buyers.
            </p>
          </div>

          {/* Card 2: Ekayan Agent */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4CAA3]/20 to-transparent border border-[#D4CAA3]/30 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🧠</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">Agent Ekayan</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Our proprietary Neuro-Symbolic AI. Ekayan autonomously classifies your products using strict statutory GRI 1-6 rules, ensuring 100% defensible HSN codes.
            </p>
          </div>

          {/* Card 3: Auto Doc Gen */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">📄</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">Zero-Touch Documentation</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Generate customs-proof proforma invoices, packing lists, and statutory defense packets instantly. Eliminate manual data entry and re-keying errors.
            </p>
          </div>

          {/* Card 4: CHA Network */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🚢</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">CHA Network</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Direct, integrated access to verified Customs House Agents (CHAs) for physical freight clearance and seamless logistics execution.
            </p>
          </div>

          {/* Card 5: Student Designers */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">👨‍💻</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">Digital Asset Acceleration</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              No website? No problem. Hire vetted engineering and design talent directly from NITs to build your stunning digital portfolio for a flat fee.
            </p>
          </div>

          {/* Card 6: Global Demand */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-xl hover:border-white/10 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl mb-6 shadow-inner">🌍</div>
            <h3 className="text-lg font-serif text-white/90 mb-3">Global Demand Signals</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Your Trade Card isn't just a static profile. Agent Ekayan actively matches your verified inventory with anonymized global buyer RFQs in real-time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
