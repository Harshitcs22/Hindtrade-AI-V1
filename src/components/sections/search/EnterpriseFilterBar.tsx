import React from 'react';

interface EnterpriseFilterBarProps {
  chips: string[];
  selectedFilters: string[];
  onFilterToggle: (chip: string) => void;
}

export const EnterpriseFilterBar: React.FC<EnterpriseFilterBarProps> = ({
  chips,
  selectedFilters,
  onFilterToggle
}) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center">
      {chips.map((chip) => {
        const isActive = selectedFilters.includes(chip);
        return (
          <button
            key={chip}
            onClick={() => onFilterToggle(chip)}
            className={`px-3 py-1.5 font-sans text-[9px] font-medium tracking-widest uppercase transition-all duration-200 border ${
              isActive 
                ? 'bg-[#D4CAA3] text-black border-[#D4CAA3] font-bold shadow-[0_0_15px_rgba(212,202,163,0.2)]' 
                : 'bg-transparent text-zinc-500 border-white/5 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
};
