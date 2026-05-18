import React from 'react';
import { ChapterNode } from '../showcase/types';

interface CustomsIndexSidebarProps {
  taxonomy: ChapterNode[];
  expandedChapter: string | null;
  onChapterToggle: (code: string | null) => void;
  onSubheadingSelect: (subcode: string) => void;
  onSearchModeChange: (mode: 'PRODUCT' | 'HSN') => void;
}

export const CustomsIndexSidebar: React.FC<CustomsIndexSidebarProps> = ({
  taxonomy,
  expandedChapter,
  onChapterToggle,
  onSubheadingSelect,
  onSearchModeChange
}) => {
  return (
    <aside className="lg:col-span-3 bg-[#0E0E10]/80 border border-white/5 rounded-xl p-5 space-y-5 h-auto sticky top-6">
      <div className="border-b border-white/5 pb-3">
        <p className="font-mono text-[8px] tracking-widest text-[#D4CAA3] font-bold">CUSTOMS INDEX</p>
        <h3 className="font-serif text-sm text-white tracking-wide uppercase mt-0.5">Chapter 95 Classification</h3>
      </div>
      <div className="space-y-4">
        {taxonomy.map((chapter) => (
          <div key={chapter.code} className="space-y-2">
            <button 
              onClick={() => onChapterToggle(expandedChapter === chapter.code ? null : chapter.code)}
              className="w-full flex items-center justify-between font-mono text-[10px] text-zinc-300 tracking-wider font-semibold py-1 hover:text-white transition-colors border-b border-white/5"
            >
              <span>{chapter.code} — {chapter.title}</span>
              <span className="text-[8px] text-zinc-500">{expandedChapter === chapter.code ? '▼' : '▶'}</span>
            </button>
            {expandedChapter === chapter.code && (
              <div className="pl-3 space-y-1.5 transition-all">
                {chapter.subheadings.map((sub) => (
                  <button
                    key={sub.code}
                    onClick={() => {
                      onSearchModeChange('HSN');
                      onSubheadingSelect(sub.code);
                    }}
                    className="w-full flex items-center justify-between font-sans text-[11px] text-zinc-500 hover:text-[#D4CAA3] transition-colors text-left py-0.5"
                  >
                    <span className="truncate pr-2">{sub.label}</span>
                    <span className="font-mono text-[9px] text-zinc-600 tracking-normal shrink-0">{sub.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
