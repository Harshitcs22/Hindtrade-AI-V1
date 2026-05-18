import React from 'react';

export const PdfDefenseFeature: React.FC = () => {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-white/5 bg-[#0A0A0A]">

      {/* Left Side: Copy & Features */}
      <div className="order-2 md:order-1 flex flex-col justify-center">
        <div className="text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-4 uppercase font-medium">Statutory Traceability</div>
        <h3 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] mb-6 leading-tight">
          Audit-Ready Defense Packets.
        </h3>
        <p className="text-slate-400 mb-8 text-base md:text-lg leading-relaxed font-sans font-light">
          Don't just get a code; get the legal defense. Ekayan compiles the complete GRI reasoning, positive/negative exclusions, and legal citations into a downloadable, audit-grade PDF report.
        </p>

        {/* List of features */}
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
            <div>
              <h4 className="text-white/90 font-serif text-sm">8-Digit Tariff Mapping</h4>
              <p className="text-zinc-500 text-xs font-light mt-0.5">Precise classification matching the ITC-HS 2022 Schedules.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
            <div>
              <h4 className="text-white/90 font-serif text-sm">Positive & Negative Path Rationale</h4>
              <p className="text-zinc-500 text-xs font-light mt-0.5">Documented proof of why exclusions were bypassed.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-[#D4CAA3] mr-3 mt-0.5">✦</span>
            <div>
              <h4 className="text-white/90 font-serif text-sm">Legal Citations & Anchors</h4>
              <p className="text-zinc-500 text-xs font-light mt-0.5">Direct references to the Customs Tariff Act 1975.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Right Side: Stacked PDF Mockups */}
      <div className="order-1 md:order-2 relative w-full h-[400px] md:h-[500px] flex justify-center items-center group">
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-[#D4CAA3]/5 blur-3xl rounded-full scale-75 pointer-events-none"></div>

        {/* Back Document (Page 2 - Detailed GRI Steps) */}
        <div className="absolute right-0 top-10 w-4/5 border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-black opacity-60 transform transition-all duration-500 group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:rotate-[-2deg]">
          <img
            src="/images/pdf-page2.png"
            alt="GRI Sequence Report Page 2"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Front Document (Page 1 - Header & Resolution) */}
        <div className="absolute left-0 bottom-10 w-4/5 border border-white/20 rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] transform transition-all duration-500 group-hover:translate-y-2 group-hover:translate-x-2 group-hover:rotate-[1deg] z-10">
          <img
            src="/images/pdf-page1.png"
            alt="Statutory Audit Report Page 1"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

    </section>
  );
};
