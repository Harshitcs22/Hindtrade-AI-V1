"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Settings2 } from "lucide-react";
import { useProductStore } from "@/lib/store";
import TradeNetworkModal from "./TradeNetworkModal";

const STATE_COORDINATES: Record<string, {x: number, y: number}> = {
  "Punjab": { x: 152, y: 81 },
  "New Delhi": { x: 195, y: 120 },
  "Srinagar": { x: 140, y: 45 },
  "Shimla": { x: 175, y: 85 },
  "Dehradun": { x: 195, y: 95 },
  "Chandigarh": { x: 180, y: 85 },
  "Jaipur": { x: 150, y: 155 },
  "Lucknow": { x: 235, y: 165 },
  "Ahmedabad": { x: 155, y: 210 },
  "Mumbai": { x: 112, y: 261 },
  "Panaji": { x: 150, y: 335 },
  "Bhopal": { x: 210, y: 230 },
  "Patna": { x: 295, y: 175 },
  "Ranchi": { x: 300, y: 220 },
  "Kolkata": { x: 328, y: 225 },
  "Bhubaneswar": { x: 315, y: 275 },
  "Raipur": { x: 265, y: 245 },
  "Guwahati": { x: 375, y: 185 },
  "Hyderabad": { x: 220, y: 305 },
  "Amaravati": { x: 240, y: 330 },
  "Bengaluru": { x: 215, y: 355 },
  "Chennai": { x: 248, y: 369 },
  "Thiruvananthapuram": { x: 200, y: 415 },
};

export function TradeMapDashboard() {
  const { firmDetails, isEditMode } = useProductStore();
  const [hoveredMarket, setHoveredMarket] = useState<string | null>(null);
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const globalMarkets = firmDetails.global_presence || [];
  const domesticPresence = firmDetails.domestic_presence || { isPanIndia: true, states: [] };
  
  const activeCount = globalMarkets.filter(m => m.status === 'ACTIVE').length;
  const growingCount = globalMarkets.filter(m => m.status === 'GROWING').length;
  const targetCount = globalMarkets.filter(m => m.status === 'TARGET').length;

  const JALANDHAR = STATE_COORDINATES["Punjab"];

  // Resolve domestic hubs based on pan-india toggle or specific selection
  const activeHubs = domesticPresence.isPanIndia 
    ? Object.entries(STATE_COORDINATES).map(([name, coords]) => ({ id: name, name, ...coords }))
    : (domesticPresence.states || []).map(name => ({ id: name, name, ...(STATE_COORDINATES[name] || {x: 0, y: 0}) }));

  const hoveredData = globalMarkets.find((m) => m.id === hoveredMarket);
  const hoveredHubData = activeHubs.find((h) => h.id === hoveredHub);

  return (
    <section className="py-16 px-8 md:px-12 bg-[#050505] relative overflow-hidden break-inside-avoid">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3 relative z-10">
        <div>
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#22D3EE] uppercase font-bold mb-2 block">
            Trade Network Visualization
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] tracking-tight">
            Global Reach
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono tracking-widest text-zinc-700 uppercase">
              {activeCount} ACTIVE • {growingCount} GROWING • {targetCount} TARGET MARKETS
            </span>
            <span className="text-[7px] font-mono tracking-widest text-zinc-800 uppercase mt-1">Live Institutional Routing</span>
          </div>
          {isEditMode && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 hover:bg-[#D4CAA3]/20 transition-all text-[10px] font-mono text-[#D4CAA3] uppercase tracking-widest"
            >
              <Settings2 className="w-3.5 h-3.5" /> Manage Network
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* GLOBAL MAP */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.06] p-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-l-2 border-[#D4CAA3]/30 pl-4">
            <div className="relative">
              <Globe className="w-4 h-4 text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-serif font-semibold uppercase tracking-[0.15em] text-[#D4CAA3]">
                Export Destinations
              </span>
              <span className="text-zinc-500/40 text-sm font-light">|</span>
              <span className="text-[10px] font-mono font-light uppercase tracking-[0.3em] text-white/40">
                {globalMarkets.length} Global Nodes Active
              </span>
            </div>
          </div>

          <div className="relative w-full" style={{ aspectRatio: "900/450" }}>
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/supply_map_screenshot.png" 
                alt="Global Trade Map"
                className="w-full h-full object-cover opacity-50 contrast-125 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
            </div>

            <svg viewBox="0 0 900 450" className="w-full h-full relative z-10 transform-gpu" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid */}
              {Array.from({ length: 19 }, (_, i) => i * 50).map((x) => (
                <line key={`gv${x}`} x1={x} y1="0" x2={x} y2="450" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 10 }, (_, i) => i * 50).map((y) => (
                <line key={`gh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              ))}

              {/* Routes */}
              {globalMarkets.map((market) => {
                const color = market.status === 'GROWING' ? '#D4CAA3' : '#22D3EE';
                const isTarget = market.status === 'TARGET' || market.status === 'LOOKING FOR';
                if (isTarget) return null;
                return (
                  <motion.line
                    key={`route-${market.id}`}
                    x1={640} y1={205} x2={market.cx} y2={market.cy}
                    stroke={hoveredMarket === market.id ? color : `${color}20`}
                    strokeWidth={hoveredMarket === market.id ? "1.5" : "0.75"}
                    strokeDasharray={market.status === 'GROWING' ? "4 4" : "0"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                  />
                );
              })}

              {/* Market points */}
              {globalMarkets.map((market, idx) => {
                const isHQ = market.id === "in";
                const isHovered = hoveredMarket === market.id;
                const baseColor = market.status === 'GROWING' ? "#D4CAA3" : (market.status === 'TARGET' || market.status === 'LOOKING FOR') ? "rgba(255,255,255,0.2)" : "#22D3EE";
                const filterId = market.status === 'GROWING' || isHQ ? 'glow-gold' : 'glow-cyan';
                
                return (
                  <g key={market.id} onMouseEnter={() => setHoveredMarket(market.id)} onMouseLeave={() => setHoveredMarket(null)} className="cursor-pointer">
                    <circle cx={market.cx} cy={market.cy} r="18" fill="transparent" />
                    <motion.circle cx={market.cx} cy={market.cy} fill="none" stroke={baseColor} strokeWidth="0.5"
                      animate={{ r: [isHQ ? 6 : 4, isHQ ? 16 : 14], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.2 }} />
                    <motion.circle 
                      cx={market.cx} cy={market.cy} 
                      r={isHovered ? (isHQ ? 7 : 6) : (isHQ ? 4 : 3)} 
                      fill={baseColor} 
                      filter={isHovered || isHQ ? `url(#${filterId})` : ""}
                    />
                    <text x={market.cx} y={market.cy - (isHQ ? 16 : 14)} textAnchor="middle" className="text-[7px] font-mono uppercase tracking-widest select-none font-bold" fill={isHovered ? baseColor : "rgba(255,255,255,0.45)"}>{market.name}</text>
                  </g>
                );
              })}
            </svg>

            <AnimatePresence>
              {hoveredData && hoveredData.id !== "in" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute z-50 pointer-events-none" style={{ left: `${(hoveredData.cx / 900) * 100}%`, top: `${(hoveredData.cy / 450) * 100 - 2}%`, transform: "translate(-50%, -100%)" }}>
                  <div className="bg-[#0A0A0A]/95 border border-[#22D3EE]/20 backdrop-blur-xl p-4 min-w-[200px] shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><span className="text-lg">{hoveredData.flag}</span><span className="text-xs font-serif text-[#F9F6EE] font-semibold">{hoveredData.name}</span></div>
                      <span className={`text-[7px] font-mono tracking-widest px-2 py-0.5 border uppercase ${hoveredData.status === 'GROWING' ? 'border-[#D4CAA3] text-[#D4CAA3]' : 'border-[#22D3EE] text-[#22D3EE]'}`}>{hoveredData.status}</span>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Supply Capability</div>
                      <p className="text-[10px] font-sans text-zinc-400 leading-relaxed">{hoveredData.exports}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* INDIA MAP */}
        <div className="bg-[#0A0A0A] border border-white/[0.06] p-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-l-2 border-[#D4CAA3]/30 pl-4">
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-serif font-semibold uppercase tracking-[0.15em] text-[#D4CAA3]">
                Domestic Capability
              </span>
              <span className="text-zinc-500/40 text-sm font-light">|</span>
              <span className="text-[10px] font-mono font-light uppercase tracking-[0.3em] text-white/40">
                {domesticPresence.isPanIndia ? 'PAN-INDIA ACTIVATED' : `${activeHubs.length} STATE HUBS`}
              </span>
            </div>
          </div>
          <div className="relative w-full" style={{ aspectRatio: "400/450" }}>
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/india_map_screenshot.png" 
                alt="Domestic Supply Map"
                className="w-full h-full object-cover opacity-50 contrast-125 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
            </div>

            <svg viewBox="0 0 400 450" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow-cyan-dom" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-gold-dom" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* intensified HQ Pulse for Jalandhar */}
              <motion.circle cx={JALANDHAR.x} cy={JALANDHAR.y} r="6" fill="#D4CAA3" filter="url(#glow-gold-dom)" />
              <motion.circle cx={JALANDHAR.x} cy={JALANDHAR.y} r="6" fill="none" stroke="#D4CAA3" strokeWidth="1.5"
                animate={{ r: [6, 26], opacity: [0.9, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
              <motion.circle cx={JALANDHAR.x} cy={JALANDHAR.y} r="6" fill="none" stroke="#D4CAA3" strokeWidth="0.5"
                animate={{ r: [6, 40], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }} />
              <text x={JALANDHAR.x} y={JALANDHAR.y - 18} textAnchor="middle" className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold" fill="#D4CAA3">JALANDHAR (HQ)</text>

              {activeHubs.map((hub, idx) => {
                const dx = hub.x - JALANDHAR.x;
                const dy = hub.y - JALANDHAR.y;
                const cp1x = JALANDHAR.x + dx * 0.25 - dy * 0.1;
                const cp1y = JALANDHAR.y + dy * 0.25 + dx * 0.1;
                const cp2x = JALANDHAR.x + dx * 0.75 + dy * 0.1;
                const cp2y = JALANDHAR.y + dy * 0.75 - dx * 0.1;

                return (
                  <g key={hub.id} onMouseEnter={() => setHoveredHub(hub.id)} onMouseLeave={() => setHoveredHub(null)} className="cursor-pointer">
                    <motion.path 
                      d={`M ${JALANDHAR.x} ${JALANDHAR.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${hub.x} ${hub.y}`}
                      fill="none" 
                      stroke={hoveredHub === hub.id ? "#22D3EE" : "rgba(34,211,238,0.1)"}
                      strokeWidth={hoveredHub === hub.id ? "1" : "0.5"} 
                      strokeDasharray="2 2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: idx * 0.04 }} />
                    
                    <motion.circle 
                      cx={hub.x} cy={hub.y} 
                      r={hoveredHub === hub.id ? 3.5 : 2} 
                      fill="#22D3EE" 
                      filter={hoveredHub === hub.id ? "url(#glow-cyan-dom)" : ""}
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: idx * 0.04 + 0.5 }} />
                    
                    {hoveredHub === hub.id && (
                      <text x={hub.x} y={hub.y + 14} textAnchor="middle" className="text-[6px] font-mono uppercase tracking-wider font-bold" fill="#22D3EE">{hub.name}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <AnimatePresence>
              {hoveredHubData && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute z-50 pointer-events-none" style={{ left: `${(hoveredHubData.x / 400) * 100}%`, top: `${(hoveredHubData.y / 450) * 100 - 2}%`, transform: "translate(-50%, -100%)" }}>
                  <div className="bg-[#0A0A0A]/95 border border-[#22D3EE]/20 backdrop-blur-xl p-3 min-w-[120px] shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent" />
                    <div className="text-xs font-serif text-[#F9F6EE] font-semibold mb-1">{hoveredHubData.name}</div>
                    <div className="text-[7px] font-mono text-[#22D3EE] uppercase tracking-widest">Active State Hub</div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A0A0A] border-r border-b border-[#22D3EE]/20 rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04] text-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              {domesticPresence.isPanIndia ? 'Active Supply Chain across 28 States & 8 UTs' : `Active Network in ${activeHubs.length} Selected Regions`}
            </span>
          </div>
        </div>
      </div>

      <TradeNetworkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slug={firmDetails.slug || ""}
      />
    </section>
  );
}
