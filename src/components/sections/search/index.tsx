import React from 'react';
import { useInventoryFilter } from './hooks/useInventoryFilter';
import { SearchControlCenter } from './SearchControlCenter';
import { TaxonomyScrollStrip } from './TaxonomyScrollStrip';
import { CustomsIndexSidebar } from './CustomsIndexSidebar';
import { EnterpriseFilterBar } from './EnterpriseFilterBar';
import { InventoryCardGrid } from './InventoryCardGrid';
import { TAXONOMY_STRIP, FILTER_CHIPS, CUSTOMS_TAXONOMY } from '../showcase/constants';

export const DigitalInventorySearch: React.FC = () => {
  // CRITICAL FIX: Explicitly lock the landing page showcase context onto 'akshay-exports'
  // Do NOT sniff paths here because on the home page root (/) there is no slug in the URL!
  const currentSlug = 'akshay-exports';

  const {
    searchMode,
    setSearchMode,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectedFilters,
    toggleFilterChip,
    expandedChapter,
    setExpandedChapter,
    filteredInventory
  } = useInventoryFilter(currentSlug);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
      
      {/* SECTION HEADER BLOCK */}
      <div className="space-y-3 max-w-4xl">
        <p className="font-mono text-[9px] tracking-[0.35em] text-[#D4CAA3] uppercase">
          Institutional Inventory Network
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight uppercase">
          Digital Inventory Operating Layer
        </h2>
        <p className="font-sans text-xs text-zinc-500 tracking-wide leading-relaxed max-w-2xl">
          AI-indexed exporter inventory structured natively through customs classification taxonomy, end-to-end cryptographic traceability systems, and procurement-grade verification matrices.
        </p>
      </div>

      {/* SEARCH CORE BAR */}
      <SearchControlCenter 
        searchMode={searchMode}
        searchQuery={searchQuery}
        onSearchModeChange={setSearchMode}
        onSearchQueryChange={setSearchQuery}
      />

      {/* HORIZONTAL TAXONOMY STRIP */}
      <TaxonomyScrollStrip 
        categories={TAXONOMY_STRIP}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      {/* WORKSPACE LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* LEFT COLUMN: CHAPTER index accordion */}
        <CustomsIndexSidebar 
          taxonomy={CUSTOMS_TAXONOMY}
          expandedChapter={expandedChapter}
          onChapterToggle={setExpandedChapter}
          onSubheadingSelect={(code) => { setSearchMode('HSN'); setSearchQuery(code); }}
          onSearchModeChange={setSearchMode}
        />

        {/* RIGHT COLUMN: FILTERS AND PRODUCTS GRID */}
        <main className="lg:col-span-9 space-y-6">
          <EnterpriseFilterBar 
            chips={FILTER_CHIPS}
            selectedFilters={selectedFilters}
            onFilterToggle={toggleFilterChip}
          />

          <InventoryCardGrid 
            products={filteredInventory}
          />
        </main>

      </div>
    </section>
  );
};
