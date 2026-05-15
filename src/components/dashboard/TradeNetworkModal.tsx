"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, MapPin, Search, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useProductStore } from "@/lib/store";

interface TradeNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

const COUNTRIES = [
  { id: "us", name: "United States", flag: "🇺🇸", cx: 195, cy: 165 },
  { id: "uk", name: "United Kingdom", flag: "🇬🇧", cx: 468, cy: 118 },
  { id: "de", name: "Germany", flag: "🇩🇪", cx: 502, cy: 122 },
  { id: "ae", name: "UAE", flag: "🇦🇪", cx: 580, cy: 200 },
  { id: "au", name: "Australia", flag: "🇦🇺", cx: 790, cy: 325 },
  { id: "jp", name: "Japan", flag: "🇯🇵", cx: 800, cy: 158 },
  { id: "za", name: "South Africa", flag: "🇿🇦", cx: 530, cy: 320 },
  { id: "sg", name: "Singapore", flag: "🇸🇬", cx: 720, cy: 248 },
  { id: "ca", name: "Canada", flag: "🇨🇦", cx: 200, cy: 120 },
  { id: "nl", name: "Netherlands", flag: "🇳🇱", cx: 488, cy: 112 },
  { id: "fr", name: "France", flag: "🇫🇷", cx: 485, cy: 135 },
  { id: "it", name: "Italy", flag: "🇮🇹", cx: 505, cy: 145 },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

export default function TradeNetworkModal({ isOpen, onClose, slug }: TradeNetworkModalProps) {
  const { firmDetails, updateTradeNetwork, isLoading } = useProductStore();
  const [activeTab, setActiveTab] = useState<'global' | 'domestic'>('global');
  const [search, setSearch] = useState("");

  const globalPresence = firmDetails.global_presence || [];
  const domesticPresence = firmDetails.domestic_presence || { isPanIndia: false, states: [] };

  const handleAddCountry = (country: any) => {
    if (globalPresence.some(c => c.id === country.id)) return;
    const newEntry = {
      ...country,
      status: 'LOOKING FOR',
      exports: 'Inquiry Pending',
      volume: '$0',
      growth: '0%',
      shipments: 0
    };
    updateTradeNetwork(slug, 'global', [...globalPresence, newEntry]);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    const updated = globalPresence.map(c => c.id === id ? { ...c, status } : c);
    updateTradeNetwork(slug, 'global', updated);
  };

  const handleRemoveCountry = (id: string) => {
    const updated = globalPresence.filter(c => c.id !== id);
    updateTradeNetwork(slug, 'global', updated);
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
      ? currentStates.filter(s => s !== state)
      : [...currentStates, state];
    updateTradeNetwork(slug, 'domestic', { ...domesticPresence, states: newStates });
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
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mt-1">Configure Sovereign Market Presence</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors rounded-full text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <button 
              onClick={() => setActiveTab('global')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-mono tracking-widest transition-all ${activeTab === 'global' ? 'text-[#D4CAA3] bg-[#D4CAA3]/5' : 'text-white/40 hover:text-white/60'}`}
            >
              <Globe className="w-4 h-4" /> GLOBAL MATRIX
            </button>
            <button 
              onClick={() => setActiveTab('domestic')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-mono tracking-widest transition-all ${activeTab === 'domestic' ? 'text-[#D4CAA3] bg-[#D4CAA3]/5' : 'text-white/40 hover:text-white/60'}`}
            >
              <MapPin className="w-4 h-4" /> DOMESTIC REACH
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'global' ? (
              <div className="space-y-8">
                {/* Search & Add */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-[#D4CAA3] uppercase tracking-[0.3em]">Expand Global Presence</div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Search for target countries..."
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-none py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4CAA3]/50 transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(country => (
                      <button
                        key={country.id}
                        disabled={globalPresence.some(p => p.id === country.id)}
                        onClick={() => handleAddCountry(country)}
                        className={`flex items-center gap-2 p-2 text-left border transition-all ${globalPresence.some(p => p.id === country.id) ? 'border-[#D4CAA3]/10 bg-[#D4CAA3]/5 opacity-40 cursor-not-allowed' : 'border-white/[0.06] hover:border-[#D4CAA3]/40 bg-white/[0.02]'}`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="text-[10px] font-mono text-white/60 uppercase truncate">{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Network */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-[#D4CAA3] uppercase tracking-[0.3em]">Active Network Infrastructure</div>
                  <div className="border border-white/[0.06] divide-y divide-white/[0.06]">
                    {globalPresence.length === 0 ? (
                      <div className="p-8 text-center text-white/20 font-serif italic">No active markets configured.</div>
                    ) : (
                      globalPresence.map((market) => (
                        <div key={market.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{market.flag}</span>
                            <div>
                              <div className="text-sm font-serif text-[#F9F6EE]">{market.name}</div>
                              <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">{market.exports}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              {['ACTIVE', 'GROWING', 'LOOKING FOR'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStatus(market.id, status)}
                                  className={`text-[8px] font-mono px-2 py-1 border transition-all ${market.status === status ? (status === 'ACTIVE' ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5' : status === 'GROWING' ? 'border-[#D4CAA3] text-[#D4CAA3] bg-[#D4CAA3]/5' : 'border-white/60 text-white/60 bg-white/10') : 'border-white/10 text-white/20 hover:text-white/40'}`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => handleRemoveCountry(market.id)} className="p-2 text-white/10 hover:text-red-400 transition-colors">
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
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Activate network across all 28 States & 8 UTs</p>
                  </div>
                  <button 
                    onClick={handleTogglePanIndia}
                    className={`relative w-12 h-6 rounded-full transition-all ${domesticPresence.isPanIndia ? 'bg-[#D4CAA3]' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: domesticPresence.isPanIndia ? 26 : 2 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-[#0A0A0A] rounded-full shadow-lg"
                    />
                  </button>
                </div>

                {!domesticPresence.isPanIndia && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-[#D4CAA3] uppercase tracking-[0.3em]">Regional Hub Selection</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {STATES.map(state => {
                        const isSelected = domesticPresence.states?.includes(state);
                        return (
                          <button
                            key={state}
                            onClick={() => handleToggleState(state)}
                            className={`flex items-center justify-between p-3 border text-left transition-all ${isSelected ? 'border-[#22D3EE]/40 bg-[#22D3EE]/5 text-[#22D3EE]' : 'border-white/[0.06] text-white/40 hover:text-white/60'}`}
                          >
                            <span className="text-[10px] font-mono uppercase tracking-widest truncate">{state}</span>
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
              onClick={onClose}
              className="px-8 py-3 bg-[#D4CAA3] text-[#0A0A0A] text-[11px] font-mono font-bold tracking-[0.2em] uppercase hover:bg-[#F9F6EE] transition-all"
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
