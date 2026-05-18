import React from 'react';

export const HeroHeader: React.FC = () => {
  return (
    <div className="relative z-20 flex flex-col items-center text-center max-w-7xl mx-auto space-y-3.5 w-full">
      {/* Luxury Kinetic Micro Banner Line */}
      <div className="relative block overflow-hidden py-1">
        <span 
          className="inline-block uppercase text-[9px] sm:text-[10px] font-semibold text-[#D4CAA3] opacity-0 antialiased tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          style={{
            animation: 'appleLuxuryBannerReveal 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '0.65em',
          }}
        >
          ABSOLUTE SHIPMENT ACCOUNTABILITY.
        </span>
      </div>

      {/* Sovereign Title - Rigid Single-Line Rule */}
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
        Trade Trust Operating System.
      </h1>

      {/* Precision Axis Split Rule */}
      <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent mt-0.5" />
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes appleLuxuryBannerReveal {
          0% { opacity: 0; transform: translate3d(0, 30px, 0); filter: blur(3px); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
        }
      `}} />
    </div>
  );
};
