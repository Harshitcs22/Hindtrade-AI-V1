import React from 'react';

export const DocProcessingFeature: React.FC = () => {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5 md:flex-row-reverse bg-[#0A0A0A]">

      {/* Left Side: Mockups (The 'Process Flow' and 'Invoice Extraction') */}
      <div className="order-2 md:order-1 relative w-full flex flex-col items-center gap-8">
        {/* Top: Process Flow Image */}
        <div className="w-full max-w-md border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/50 bg-[#0A0A0A] p-2">
          <img
            src="/images/doc-flow.png"
            alt="Document Processing Flow"
            className="w-full h-auto object-contain filter invert opacity-90"
          />
        </div>

        {/* Bottom: Invoice Extraction Image */}
        <div className="w-full max-w-md border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80 bg-[#111111] transform transition-transform hover:scale-[1.02]">
          <div className="relative">
            <div className="absolute inset-0 bg-[#0A0A0A]/20 pointer-events-none mix-blend-multiply"></div>
            <img
              src="/images/doc-extraction.png"
              alt="AI Invoice Extraction"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Copy & Explanation */}
      <div className="order-1 md:order-2 flex flex-col justify-center">
        <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Data Ingestion Engine</div>
        <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
          AI-Assisted Document Processing.
        </h3>
        <p className="text-slate-400 mb-6 text-base md:text-lg leading-relaxed font-sans font-light">
          Instantly digitize your entire trade operation. HindTrade AI autonomously classifies and extracts structured data from your physical paperwork, bridging the gap between legacy formats and the digital trust layer.
        </p>

        {/* Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#111111] border border-white/5 p-5 rounded-lg">
            <h4 className="text-white/90 font-serif text-sm mb-2">Universal Extraction</h4>
            <p className="text-zinc-500 text-xs font-light">Process Letters of Credit (LC), Bills of Lading (BOL), Invoices, and Packing Lists instantly.</p>
          </div>
          <div className="bg-[#111111] border border-white/5 p-5 rounded-lg">
            <h4 className="text-white/90 font-serif text-sm mb-2">Batch Processing</h4>
            <p className="text-zinc-500 text-xs font-light">Handle multiple file formats and massive batch uploads efficiently without manual sorting.</p>
          </div>
        </div>
      </div>

    </section>
  );
};
