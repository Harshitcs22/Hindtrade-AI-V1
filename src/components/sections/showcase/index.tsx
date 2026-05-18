import React, { useEffect } from 'react';
import { ExporterCard } from '@/components/dashboard/ExporterCard';
import { DigitalInventorySearch } from '../search';
import { METRICS_STRIP } from './constants';
import { useProductStore } from '@/lib/store';

export const ExporterShowcase: React.FC = () => {
  const fetchFirmData = useProductStore((s: any) => s.fetchFirmData);

  useEffect(() => {
    // Load the primary live firm for the showcase (demo fallback when Supabase not configured)
    if (fetchFirmData) fetchFirmData('akshay-exports');
  }, [fetchFirmData]);

  return (
    <div className="w-full bg-[#0A0A0A] select-none antialiased relative z-20">
      {/* BLOCK 01: VERIFIED EXPORTER NODE (LIVE CANONICAL CARD) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <ExporterCard onOpenAI={() => {}} />
      </div>

      {/* HORIZONTAL SYSTEM AXIS DIVIDER FLUSH ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* HIGH-DENSITY METRICS STRIP CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 border border-white/5 backdrop-blur-md">
          {METRICS_STRIP.map((metric, i) => (
            <div key={i} className="bg-[#0E0E10]/80 p-5 space-y-1">
              <p className="font-mono text-[8px] tracking-widest text-zinc-500 uppercase">{metric.label}</p>
              <p className="font-serif text-2xl text-white font-medium tracking-wide">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCK 02: DIGITAL INVENTORY OPERATING LAYER (SEARCHABLE TRADE INTELLIGENCE) */}
      <DigitalInventorySearch />

    </div>
  );
};
