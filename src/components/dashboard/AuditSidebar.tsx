"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, ShieldAlert, CheckCircle } from "lucide-react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { AuditTrace, generateMockTrace, getRiskColor, formatAuditHash } from "@/lib/antigravity-utils";

interface AuditSidebarProps {
  isOpen: boolean;
  hsnCode: string | null;
  onClose: () => void;
}

export function AuditSidebar({ isOpen, hsnCode, onClose }: AuditSidebarProps) {
  const [trace, setTrace] = useState<AuditTrace | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isOpen && hsnCode) {
      setIsSimulating(true);
      // Simulate Antigravity Audit Delay
      const timer = setTimeout(() => {
        setTrace(generateMockTrace(hsnCode));
        setIsSimulating(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setTrace(null);
    }
  }, [isOpen, hsnCode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111111]">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#22D3EE]" />
                <h2 className="text-sm font-sans tracking-[0.2em] text-[#F9F6EE] uppercase font-bold">
                  Antigravity Audit Trace
                </h2>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm relative">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />

              {!hsnCode ? (
                <div className="text-zinc-500">No HSN code selected for audit.</div>
              ) : isSimulating ? (
                <div className="space-y-4 text-[#22D3EE]">
                  <div className="animate-pulse">&gt; INITIALIZING ANTIGRAVITY ENGINE...</div>
                  <div className="animate-pulse delay-75">&gt; FETCHING ITC-HS 2022 SCHEDULES...</div>
                  <div className="animate-pulse delay-150">&gt; ANALYZING HSN: {hsnCode}...</div>
                  <div className="mt-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : trace ? (
                <div className="space-y-8 relative z-10">
                  {/* Top Stats */}
                  <div className="grid grid-cols-2 gap-4 border border-white/10 p-4 bg-black/50 rounded-sm">
                    <div>
                      <MonoLabel label="TARGET HSN" variant="cyan">{trace.hsnCode}</MonoLabel>
                    </div>
                    <div>
                      <MonoLabel label="RISK SCORE" className="text-lg" style={{ color: getRiskColor(trace.riskScore) }}>
                        {trace.riskScore}/100
                      </MonoLabel>
                    </div>
                  </div>

                  {/* Terminal Trace Output */}
                  <div className="space-y-6">
                    <div className="text-zinc-500 text-xs tracking-widest uppercase mb-4">
                      Execution Trace
                    </div>
                    {trace.steps.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        key={idx} 
                        className="pl-4 border-l-2 border-[#22D3EE]/30 space-y-2 relative"
                      >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#0A0A0A] flex items-center justify-center">
                          {step.result === "PASS" ? (
                            <CheckCircle className="w-3 h-3 text-[#10b981]" />
                          ) : (
                            <ShieldAlert className="w-3 h-3 text-[#ef4444]" />
                          )}
                        </div>
                        <div className="text-[#F9F6EE] font-medium">&gt; {step.rule}</div>
                        <div className="text-zinc-400 text-xs">&gt; {step.note}</div>
                        <div className="text-zinc-600 text-[10px]">HASH: {formatAuditHash(step.hash)}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Status Banner */}
                  <div className={`mt-8 p-4 border flex items-start gap-3 ${trace.riskScore < 30 ? 'border-[#10b981]/20 bg-[#10b981]/5 text-[#10b981]' : 'border-[#ef4444]/20 bg-[#ef4444]/5 text-[#ef4444]'}`}>
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs tracking-widest uppercase mb-1">
                        {trace.riskScore < 30 ? 'CLASSIFICATION VERIFIED' : 'HIGH RISK FLAG'}
                      </div>
                      <div className="text-xs opacity-80">
                        {trace.riskScore < 30 
                          ? 'This HSN code demonstrates 100% statutory defensibility against GRI rules.' 
                          : 'Potential misclassification detected. Review section notes immediately.'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
