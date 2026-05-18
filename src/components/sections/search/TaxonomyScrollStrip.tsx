import React from 'react';

interface TaxonomyScrollStripProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export const TaxonomyScrollStrip: React.FC<TaxonomyScrollStripProps> = ({
  categories,
  activeCategory,
  onCategorySelect
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b border-white/5 pb-2 flex space-x-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategorySelect(cat)}
          className={`pb-3 font-sans text-[10px] tracking-[0.2em] font-semibold uppercase shrink-0 transition-colors ${
            activeCategory === cat 
              ? 'text-[#D4CAA3] border-b border-[#D4CAA3]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
