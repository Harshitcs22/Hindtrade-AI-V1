import React from 'react';

export const RoiBanner: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-center border-b border-white/5">
      {/* Subtle glowing orb in the center background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-[#D4CAA3]/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#F9F6EE] mb-8 leading-tight tracking-tight">
          Engineered to save time, reduce manual workforce, and build the verifiable digital trust global buyers demand.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm md:text-base font-sans tracking-widest uppercase text-zinc-500 font-medium">
          <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> Zero Manual Entry</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> 100% Legal Defensibility</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-2"><span className="text-[#D4CAA3]">✦</span> Verified Global Trust</span>
        </div>
      </div>
    </section>
  );
};
