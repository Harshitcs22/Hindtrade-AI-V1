import { useState, useMemo, useEffect } from 'react';
import { ProductAsset } from '@/components/sections/showcase/types';
import { useProductStore } from '@/lib/store';

export const useInventoryFilter = (currentCompanySlug: string = 'akshay-exports') => {
  // Pure operational reactive states
  const [searchMode, setSearchMode] = useState<'PRODUCT' | 'HSN'>('PRODUCT');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expandedChapter, setExpandedChapter] = useState<string | null>('9506');

  // ACCESS NATIVE GLOBAL STORE MODIFIERS AND CACHE VECTORS
  const { firmDetails, fetchFirmData, fetchProducts } = useProductStore();
  const globalInventory = useProductStore((state: any) => state.inventory || state.products || []);

  // Dispatch store data hydration to ensure the global store has this specific node's data
  useEffect(() => {
    if (currentCompanySlug) {
      fetchFirmData(currentCompanySlug);
    }
  }, [currentCompanySlug, fetchFirmData]);

  useEffect(() => {
    if (firmDetails?.id && firmDetails.slug === currentCompanySlug) {
      fetchProducts(firmDetails.id);
    }
  }, [firmDetails?.id, firmDetails?.slug, currentCompanySlug, fetchProducts]);

  // Highly optimized computational filtering pipeline over the synchronized global inventory stream
  const filteredInventory = useMemo<ProductAsset[]>(() => {
    const queryRaw = (searchQuery || '').toString();
    const queryClean = queryRaw.toLowerCase().trim();

    const normalizeItemSlug = (item: any) =>
      item.company_slug || item.exporterSlug || (item.exporter ? item.exporter.toLowerCase().replace(/ /g, '-') : '');

    const normalizeMaterialsToString = (item: any) => {
      if (Array.isArray(item.materials)) {
        return item.materials
          .map((m: any) => (typeof m === 'string' ? m : (m?.name || m?.label || '')))
          .join(' ')
          .toLowerCase();
      }
      if (Array.isArray(item.material)) {
        return item.material.map((m: any) => (typeof m === 'string' ? m : (m?.name || m?.label || ''))).join(' ').toLowerCase();
      }
      if (typeof item.materials === 'string') return item.materials.toLowerCase();
      if (typeof item.material === 'string') return item.material.toLowerCase();
      return '';
    };

    const normalizeTags = (item: any) => {
      if (Array.isArray(item.tags)) return item.tags.map((t: any) => String(t).toLowerCase());
      return [];
    };

    const matchesChipToken = (item: any, token: string) => {
      const t = token.toLowerCase();
      if (t === 'verified exporters' || t === 'export ready') {
        return !!(item.verified || item.verified_status || (item.trust_score >= 75) || (firmDetails?.trust_score && firmDetails.trust_score >= 75));
      }
      if (t === 'hsn verified') return !!(item.hsn || item.hsn_code);
      if (t === 'moq available') return !!(item.moq || item.minimum_order_quantity);
      // Generic tag prefix matching
      const prefix = t.split(' ')[0];
      const tags = normalizeTags(item);
      const mats = normalizeMaterialsToString(item);
      return tags.some((tg: string) => tg.includes(prefix)) || mats.includes(prefix);
    };

    return globalInventory.filter((item: any) => {
      // Tenant isolation: allow item if no slug is set (backwards compat) or if it matches the current company
      const itemSlug = normalizeItemSlug(item);
      if (itemSlug && itemSlug !== currentCompanySlug) return false;

      // Normalize searchable fields
      const title = (item.name || item.product_name || '').toString().toLowerCase();
      const exporter = (item.exporter || '').toString().toLowerCase();
      const materialsStr = normalizeMaterialsToString(item);
      const tags = normalizeTags(item);
      const hsnRaw = (item.hsn || item.hsn_code || '').toString();
      const hsnNormalized = hsnRaw.replace(/\./g, '').toLowerCase();

      // Search matching
      let satisfiesSearch = true;
      if (queryClean) {
        if (searchMode === 'PRODUCT') {
          // Tokenized matching: ensure all query tokens are present in any searchable field
          const tokens = queryClean.split(/\s+/).filter(Boolean);
          satisfiesSearch = tokens.every((tk) => (
            title.includes(tk) ||
            materialsStr.includes(tk) ||
            exporter.includes(tk) ||
            tags.some((tg: string) => tg.includes(tk))
          ));
        } else {
          const qHsn = queryClean.replace(/\./g, '');
          satisfiesSearch = hsnNormalized.startsWith(qHsn) || hsnRaw.toLowerCase().includes(queryClean);
        }
      }

      if (!satisfiesSearch) return false;

      // Category matching with intelligent HSN fallbacks
      if (activeCategory && activeCategory !== 'ALL') {
        const catUpper = activeCategory.toUpperCase();
        const itemCat = (item.category || '').toUpperCase();
        const isCricketHsn = hsnRaw.startsWith('9506.32') || hsnNormalized.startsWith('950632');
        const isHockeyHsn = hsnRaw.startsWith('9506.99') || hsnNormalized.startsWith('950699');
        let satisfiesCategory = false;
        if (catUpper === 'CRICKET') {
          satisfiesCategory = itemCat === 'CRICKET' || title.includes('cricket') || isCricketHsn;
        } else if (catUpper === 'HOCKEY') {
          satisfiesCategory = itemCat === 'HOCKEY' || title.includes('hockey') || isHockeyHsn;
        } else {
          satisfiesCategory = itemCat === catUpper || title.includes(catUpper.toLowerCase());
        }
        if (!satisfiesCategory) return false;
      }

      // Selected filter chips
      if (selectedFilters && selectedFilters.length > 0) {
        const allMatch = selectedFilters.every((f) => matchesChipToken(item, f));
        if (!allMatch) return false;
      }

      return true;
    });
  }, [searchQuery, searchMode, activeCategory, selectedFilters, globalInventory, currentCompanySlug, firmDetails?.trust_score]);

  // Reactive chip state toggler
  const toggleFilterChip = (chip: string) => {
    setSelectedFilters(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  return {
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
  };
};

