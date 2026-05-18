'use client';

import React from 'react';

interface SearchControlCenterProps {
  searchMode: 'PRODUCT' | 'HSN';
  searchQuery: string;
  onSearchModeChange: (mode: 'PRODUCT' | 'HSN') => void;
  onSearchQueryChange: (query: string) => void;
}

export const SearchControlCenter: React.FC<SearchControlCenterProps> = ({
  searchMode,
  searchQuery,
  onSearchModeChange,
  onSearchQueryChange
}) => {
  return (
    <div className="w-full bg-[#0E0E10] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden group">
      
      {/* Decorative Branding Line Guard */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/30 to-transparent" />

      {/* Mode Switches: Bold Core Matrix Header */}
      <div className="flex border-b border-white/5 max-w-sm font-mono text-[10px] tracking-[0.25em] font-bold">
        <button 
          onClick={() => { onSearchModeChange('PRODUCT'); onSearchQueryChange(''); }}
          className={`flex-1 pb-4 text-center transition-all uppercase ${searchMode === 'PRODUCT' ? 'text-[#D4CAA3] border-b-2 border-[#D4CAA3] scale-102 font-extrabold' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          ✦ DIRECT PRODUCT LEDGER
        </button>
        <button 
          onClick={() => { onSearchModeChange('HSN'); onSearchQueryChange(''); }}
          className={`flex-1 pb-4 text-center transition-all uppercase ${searchMode === 'HSN' ? 'text-[#D4CAA3] border-b-2 border-[#D4CAA3] scale-102 font-extrabold' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          ✦ CUSTOMS HSN INDEX
        </button>
      </div>

      {/* Main Massive Search Engine Bar */}
      <div className="relative w-full flex items-center group/input">
        <span className="absolute left-5 text-zinc-500 text-base font-mono transition-transform group-focus-within/input:scale-110">
          🔍
        </span>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={searchMode === 'PRODUCT' ? "Type product key parameters (e.g., Cricket Ball, Match Hockey Stick, Power Trainer)..." : "Specify numeric customs classification code (e.g., 9506, 9506.91)..."}
          className="w-full bg-zinc-950 border border-white/10 rounded-xl py-5 pl-14 pr-6 text-sm font-sans font-medium text-white tracking-wide placeholder-zinc-600 focus:outline-none focus:border-[#D4CAA3]/50 focus:shadow-[0_0_30px_rgba(212,202,163,0.05)] transition-all duration-300 antialiased"
        />
      </div>

      {/* Suggested Quick Target Tokens Strip */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
        <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase font-bold">PROCURABLE SYSTEM TAGS:</span>
        {["cricket ball", "hockey equipment", "9506", "gym trainer", "football matrix"].map((tag, idx) => (
          <button 
            key={idx}
            onClick={() => onSearchQueryChange(tag)}
            className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-md text-zinc-400 font-sans text-[11px] font-medium tracking-wide hover:border-[#D4CAA3] hover:text-white hover:bg-zinc-900 transition-all duration-200"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};
