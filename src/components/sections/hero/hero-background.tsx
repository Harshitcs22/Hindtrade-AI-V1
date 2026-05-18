import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <>
      {/* Locked Sovereign Asset - Full Canvas Un-Dimmed Visibility */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-100 transition-all duration-500 filter brightness-100 contrast-100 scale-110 origin-center"
        style={{
          backgroundImage: `url('/images/pexels-fatih-turan-63325184-12810604.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: '62% 70%',
        }}
      />
      {/* Cinematic Contrast Vignette Overlay Shields */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/95 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/20 via-transparent to-[#0A0A0A]/20 z-10 pointer-events-none" />
    </>
  );
};
