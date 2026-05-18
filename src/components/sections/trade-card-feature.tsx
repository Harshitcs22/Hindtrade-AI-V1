import React from 'react';

export const TradeCardFeature: React.FC = () => {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 border-b border-white/5 bg-[#0A0A0A]">

      {/* Top Copy Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
        <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">The End of Unverified Leads</div>
        <h3 className="text-3xl md:text-5xl font-serif text-[#F9F6EE] mb-6 leading-tight">
          Not just another B2B marketplace. <br /> A Verified Sovereign Network.
        </h3>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed font-sans font-light">
          Legacy platforms are cluttered with dead catalogs and unverified buyers. HindTrade AI shifts you to an autonomous model. You get a "LinkedIn-style" Trade Card verified by CA/DGFT data, and a dedicated AI agent trained on your specific inventory to close deals 24/7.
        </p>
      </div>

      {/* Bottom Split: Real Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Panel: The Profile & Timeline Image */}
        <div className="lg:col-span-7 relative group">
          <div className="absolute inset-0 bg-[#D4CAA3]/5 blur-2xl rounded-xl scale-95 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>
          <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80 bg-[#0A0A0A]">
            <div className="bg-[#111111] border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs text-zinc-500 font-sans tracking-wider">trade-card-jalandhar-sports</span>
            </div>
            <img
              src="/images/profile-view.png"
              alt="Verified Supplier Profile and AI Agent"
              className="w-full h-auto object-cover opacity-95 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Panel: The Catalog Image & Context */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/60 bg-[#0A0A0A] transform transition-transform hover:-translate-y-1">
            <img
              src="/images/catalog-view.png"
              alt="Ingested Catalog and HSN Mapping"
              className="w-full h-auto object-cover opacity-90"
            />
          </div>

          {/* Explanation Cards */}
          <div className="space-y-4">
            <div className="bg-[#111111] border-l-2 border-[#D4CAA3] p-5 rounded-r-lg">
              <h4 className="text-white/90 font-serif text-base mb-1">RAG-Powered Inventory</h4>
              <p className="text-zinc-400 text-xs font-light leading-relaxed">Your catalogs are ingested into a private Vector DB. When buyers ask for products, your agent knows your exact MOQ, pricing, and specs.</p>
            </div>
            <div className="bg-[#111111] border-l-2 border-[#22D3EE]/50 p-5 rounded-r-lg">
              <h4 className="text-white/90 font-serif text-base mb-1">Live Statutory Trace</h4>
              <p className="text-zinc-400 text-xs font-light leading-relaxed">Notice the HSN tags on every product? The agent runs a live GRI audit before ever sending a quote to a buyer.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
