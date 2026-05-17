"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, MapPin, Search, Trash2, CheckCircle2 } from "lucide-react";
import { useProductStore } from "@/lib/store";

interface TradeNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

const COUNTRY_DICTIONARY = [
  { code: "US", name: "United States", flag: "🇺🇸", cx: 195, cy: 165 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", cx: 468, cy: 118 },
  { code: "DE", name: "Germany", flag: "🇩🇪", cx: 502, cy: 122 },
  { code: "AE", name: "UAE", flag: "🇦🇪", cx: 580, cy: 200 },
  { code: "AU", name: "Australia", flag: "🇦🇺", cx: 790, cy: 325 },
  { code: "JP", name: "Japan", flag: "🇯🇵", cx: 800, cy: 158 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", cx: 530, cy: 320 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", cx: 720, cy: 248 },
  { code: "CA", name: "Canada", flag: "🇨🇦", cx: 200, cy: 120 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", cx: 488, cy: 112 },
  { code: "FR", name: "France", flag: "🇫🇷", cx: 485, cy: 135 },
  { code: "IT", name: "Italy", flag: "🇮🇹", cx: 505, cy: 145 },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", cx: 565, cy: 190 },
  { code: "IN", name: "India", flag: "🇮🇳", cx: 620, cy: 210 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", cx: 320, cy: 260 },
  { code: "MX", name: "Mexico", flag: "🇲🇽", cx: 180, cy: 190 },
  { code: "RU", name: "Russia", flag: "🇷🇺", cx: 650, cy: 110 },
  { code: "KR", name: "South Korea", flag: "🇰🇷", cx: 780, cy: 160 },
  { code: "ES", name: "Spain", flag: "🇪🇸", cx: 460, cy: 150 },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", cx: 490, cy: 138 },
  { code: "SE", name: "Sweden", flag: "🇸🇪", cx: 510, cy: 90 },
  { code: "PL", name: "Poland", flag: "🇵🇱", cx: 520, cy: 115 },
  { code: "TR", name: "Turkey", flag: "🇹🇷", cx: 535, cy: 155 },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", cx: 730, cy: 265 },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", cx: 720, cy: 215 },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", cx: 710, cy: 240 },
  { code: "TH", name: "Thailand", flag: "🇹🇭", cx: 705, cy: 220 },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const normalizeStatus = (status: string | undefined) => {
  const value = (status || 'target').toLowerCase();
  if (value === 'active' || value === 'growing' || value === 'target') return value;
  if (value === 'looking for' || value === 'looking_for' || value === 'looking') return 'target';
  return 'target';
};

const normalizeGlobalPresence = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => ({ ...item, status: normalizeStatus(item.status) }));
  }
  return Object.entries(value).map(([code, item]: any) => ({
    code,
    id: item.id || code,
    ...item,
    status: normalizeStatus(item?.status),
  }));
};

const normalizeDomesticPresence = (value: any) => ({
  pan_india: Boolean(value?.pan_india ?? value?.isPanIndia ?? false),
  isPanIndia: Boolean(value?.isPanIndia ?? value?.pan_india ?? false),
  states: Array.isArray(value?.states) ? value.states : [],
});

export default function TradeNetworkModal({ isOpen, onClose, slug }: TradeNetworkModalProps) {
  const { firmDetails, updateTradeNetwork, updateProfileStats, isLoading } = useProductStore();
  const [activeTab, setActiveTab] = useState<'global' | 'domestic'>('global');
  const [searchQuery, setSearchQuery] = useState("");

  const [localPresenceState, setLocalPresenceState] = useState<any[]>(() => {
    return normalizeGlobalPresence(firmDetails.global_presence);
  });

  const domesticPresence = normalizeDomesticPresence(firmDetails.domestic_presence);

  const filteredCountries = COUNTRY_DICTIONARY.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCountry = (c: any) => {
    const exists = localPresenceState.some((p: any) => p.code === c.code);
    if (exists) {
      setLocalPresenceState(prev => prev.filter((p: any) => p.code !== c.code));
    } else {
      setLocalPresenceState(prev => [
        ...prev,
        {
          code: c.code,
          id: c.code,
          name: c.name,
          flag: c.flag,
          cx: c.cx,
          cy: c.cy,
          status: 'target',
          exports: 'Inquiry Pending',
          volume: '$0',
          growth: '0%',
          shipments: 0
        }
      ]);
    }
  };

  const handleUpdateStatus = (code: string, status: string) => {
    setLocalPresenceState(prev => prev.map(c => c.code === code ? { ...c, status } : c));
  };

  const handleRemoveCountry = (code: string) => {
    setLocalPresenceState(prev => prev.filter(c => c.code !== code));
  };

  const handleTogglePanIndia = () => {
    updateTradeNetwork(slug, 'domestic', { 
      ...domesticPresence, 
      isPanIndia: !domesticPresence.isPanIndia 
    });
  };

  const handleToggleState = (state: string) => {
    const currentStates = domesticPresence.states || [];
    const newStates = currentStates.includes(state)
      ? currentStates.filter((s: string) => s !== state)
      : [...currentStates, state];
    updateTradeNetwork(slug, 'domestic', { ...domesticPresence, states: newStates });
  };

  const handleNetworkSynchrony = async () => {
    try {
      await updateProfileStats({ global_presence: localPresenceState as any });
      onClose();
    } catch (err) {
      console.error("Failed to compile global reach matrix synchrony:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0A0A0A] border border-[#D4CAA3]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-[#F9F6EE] tracking-tight">Trade Network Manager</h2>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-white/40 mt-1">Configure Sovereign Market Presence</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors rounded-full text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <button 
              onClick={() => setActiveTab('global')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-sans tracking-widest transition-all uppercase ${activeTab === 'global' ? 'text-[#D4CAA3] bg-[#D4CAA3]/5' : 'text-white/40 hover:text-white/60'}`}
            >
              <Globe className="w-4 h-4" /> Global Matrix
            </button>
            <button 
              onClick={() => setActiveTab('domestic')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-sans tracking-widest transition-all uppercase ${activeTab === 'domestic' ? 'text-[#D4CAA3] bg-[#D4CAA3]/5' : 'text-white/40 hover:text-white/60'}`}
            >
              <MapPin className="w-4 h-4" /> Domestic Reach
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'global' ? (
              <div className="space-y-8">
                {/* Search & Add */}
                <div className="space-y-4">
                  <div className="text-[10px] font-sans text-[#D4CAA3] uppercase tracking-[0.3em] font-bold">Expand Global Presence</div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Search for target countries..."
                      className="w-full bg-zinc-950/60 border border-white/5 font-sans text-xs tracking-wider focus:border-[#D4CAA3]/40 focus:outline-none px-4 py-3 text-zinc-100 rounded-none w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredCountries.map(country => {
                      const isSelected = localPresenceState.some(p => p.code === country.code);
                      return (
                        <button
                          key={country.code}
                          onClick={() => handleToggleCountry(country)}
                          className={`flex items-center gap-2 p-3 text-left border transition-all duration-300 rounded-none ${
                            isSelected 
                              ? 'border-[#D4CAA3]/40 bg-[#D4CAA3]/5 text-[#F9F6EE] shadow-[0_0_15px_rgba(212,202,163,0.05)]' 
                              : 'border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300 bg-transparent'
                          }`}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="text-[10px] font-sans tracking-widest uppercase truncate">{country.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Network */}
                <div className="space-y-4">
                  <div className="text-[10px] font-sans text-[#D4CAA3] uppercase tracking-[0.3em] font-bold">Active Network Infrastructure</div>
                  <div className="border border-white/[0.06] divide-y divide-white/[0.06]">
                    {localPresenceState.length === 0 ? (
                      <div className="p-8 text-center text-white/20 font-serif italic">No active markets configured.</div>
                    ) : (
                      localPresenceState.map((market) => (
                        <div key={market.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.01] transition-all gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{market.flag}</span>
                            <div>
                              <div className="text-sm font-sans tracking-wide text-[#F9F6EE] font-bold uppercase">{market.name}</div>
                              <div className="text-[9px] font-sans text-zinc-500 uppercase tracking-widest mt-1">{market.exports || 'Inquiry Pending'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 justify-between sm:justify-end">
                            <div className="flex items-center gap-2">
                              {['active', 'growing', 'target'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStatus(market.code, status)}
                                  className={`text-[8px] font-sans px-2.5 py-1 border tracking-widest uppercase transition-all rounded-none font-semibold ${
                                    normalizeStatus(market.status) === status 
                                      ? (status === 'active' 
                                          ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5' 
                                          : status === 'growing' 
                                            ? 'border-[#D4CAA3] text-[#D4CAA3] bg-[#D4CAA3]/5' 
                                            : 'border-white/60 text-white bg-white/10') 
                                      : 'border-white/5 text-zinc-500 hover:text-zinc-300 bg-transparent'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => handleRemoveCountry(market.code)} className="p-2 text-white/10 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pan-India Toggle */}
                <div className="p-6 bg-[#D4CAA3]/5 border border-[#D4CAA3]/20 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif text-[#D4CAA3]">Pan-India Capability</h3>
                    <p className="text-[10px] font-sans text-white/40 uppercase tracking-widest mt-1">Activate network across all 28 States & 8 UTs</p>
                  </div>
                  <button 
                    onClick={handleTogglePanIndia}
                    className={`relative w-12 h-6 rounded-full transition-all ${domesticPresence.pan_india ? 'bg-[#D4CAA3]' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: domesticPresence.pan_india ? 26 : 2 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-[#0A0A0A] rounded-full shadow-lg"
                    />
                  </button>
                </div>

                {!domesticPresence.pan_india && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-sans text-[#D4CAA3] uppercase tracking-[0.3em] font-bold">Regional Hub Selection</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {STATES.map(state => {
                        const isSelected = domesticPresence.states?.includes(state);
                        return (
                          <button
                            key={state}
                            onClick={() => handleToggleState(state)}
                            className={`flex items-center justify-between p-3 border text-left transition-all ${isSelected ? 'border-[#22D3EE]/40 bg-[#22D3EE]/5 text-[#22D3EE]' : 'border-white/[0.06] text-white/40 hover:text-white/60'}`}
                          >
                            <span className="text-[10px] font-sans uppercase tracking-widest truncate">{state}</span>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/[0.06] bg-black/40 flex justify-end">
            <button 
              onClick={handleNetworkSynchrony}
              className="px-8 py-3 bg-[#D4CAA3] text-[#0A0A0A] text-[11px] font-sans font-bold tracking-[0.2em] uppercase hover:bg-[#F9F6EE] transition-all rounded-none"
            >
              Confirm Network Synchrony
            </button>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#D4CAA3]/20 border-t-[#D4CAA3] rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
