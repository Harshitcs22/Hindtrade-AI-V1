import React from 'react';
import { useRouter } from 'next/navigation';

export const HeroFooter: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto space-y-6 w-full mt-auto">
      {/* Descriptive Procurement Metadata Layout */}
      <p className="font-sans text-xs md:text-sm tracking-[0.2em] text-zinc-200 max-w-4xl mx-auto leading-[2.2] uppercase font-light drop-shadow-[0_2px_14px_rgba(0,0,0,1)]">
        The institutional verified layer connecting <span className="text-white font-medium">Indian manufacturing</span> with global trade through verification, compliance, and traceable commerce—creating absolute execution ease for domestic and global buyers alike.
      </p>

      {/* Premium Execution Terminal CTA Triggers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <button 
          onClick={() => router.push('/auth/signup')}
          className="px-8 py-3.5 bg-white text-black font-sans text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-[#D4CAA3] transition-all duration-300 rounded-none"
        >
          EXPLORE DIGITAL SHOWROOM
        </button>
        <button 
          onClick={() => router.push('/audit-vault')}
          className="px-8 py-3.5 bg-zinc-950/90 text-zinc-400 border border-white/10 font-sans text-[10px] tracking-[0.25em] font-bold uppercase hover:text-white hover:border-white transition-all duration-300 rounded-none backdrop-blur-md"
        >
          LAUNCH GRI AUDIT ENGINE
        </button>
      </div>
    </div>
  );
};
