"use client";

import React, { useState } from "react";
import { 
  FileText, ShieldCheck, ExternalLink, Loader2, UploadCloud, AlertTriangle 
} from "lucide-react";
import { Verification } from "@/types/supabase";
import { LucideIcon } from "lucide-react";

interface VaultCardProps {
  docType: string;
  label: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  currentRecord?: Verification;
  onUploadComplete: (file: File) => Promise<void>;
  isUploading: boolean;
  tooltipText?: string;
  isEditMode: boolean;
}

export function VaultCard({
  docType,
  label,
  subtitle,
  description,
  icon: PillarIcon,
  currentRecord: record,
  onUploadComplete,
  isUploading,
  tooltipText,
  isEditMode
}: VaultCardProps) {
  const [dragActive, setDragActive] = useState(false);

  const hasRecord = record && record.document_url;
  const isVerified = hasRecord && (record.status === "APPROVED" || (record.status as any) === "verified");
  const isPending = hasRecord && (record.status === "PENDING" || record.status === "UNDER_REVIEW");
  const isRejected = hasRecord && (record.status === "REJECTED" || (record.status as any) === "FAILED");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (isEditMode || !hasRecord) {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        await onUploadComplete(file);
      }
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative bg-zinc-950/40 backdrop-blur-md p-6 border transition-all duration-300 ease-out hover:scale-[1.03] select-none overflow-hidden flex flex-col justify-between min-h-[360px] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] group
        ${dragActive 
          ? "border-dashed border-[#D4CAA3] shadow-[0_0_15px_rgba(212,202,163,0.2)] bg-zinc-900/60 scale-[1.03]" 
          : "border-white/5 hover:border-[#D4CAA3]/20"
        }
      `}
    >
      {/* Target A: White glowing corner indicator and re-architected tooltip dropdown */}
      {tooltipText && (
        <div className={`absolute top-4 ${isVerified && !isEditMode ? "right-24" : "right-4"} z-30 flex items-center justify-center w-4 h-4 rounded-full border border-white/30 bg-zinc-900/80 text-white font-sans text-[9px] font-bold cursor-help transition-all duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] group/tooltip`}>
          ?
          
          {/* RE-ARCHITECTED TOOLTIP DROP-SHEET (NEVER CLIPPED) */}
          <div className="absolute right-0 top-full mt-2 z-[100] w-64 p-3.5 bg-zinc-950/98 border border-white/10 text-left backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95)] rounded-none pointer-events-none hidden group-hover/tooltip:block transition-all duration-200">
            <p className="font-sans text-[10px] tracking-wide text-zinc-400 leading-relaxed font-normal normal-case">
              {tooltipText}
            </p>
          </div>
        </div>
      )}

      {/* State V3: Verified angled absolute seal overlay */}
      {isVerified && !isEditMode && (
        <div className="absolute top-4 right-4 border-2 border-[#22D3EE]/60 bg-[#22D3EE]/5 text-[#22D3EE] font-serif text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 -rotate-12 skew-x-3 shadow-[0_0_15px_rgba(34,211,238,0.15)] pointer-events-none z-10">
          Verified
        </div>
      )}

      {/* Global Edit Mode Overlay: Re-deployment drag / click zone */}
      {isEditMode && hasRecord && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center border-2 border-dashed border-[#D4CAA3]/40 p-6 text-center z-20 transition-all duration-300">
          <UploadCloud className="w-8 h-8 text-[#D4CAA3] mb-2 animate-bounce" />
          <span className="font-mono text-[9px] tracking-widest text-[#D4CAA3] uppercase font-bold mb-1">
            Replace Document
          </span>
          <span className="font-sans text-[8px] text-zinc-500 uppercase tracking-wider mb-4">
            Drop new file or click
          </span>
          
          <div className="relative">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-[#D4CAA3] border border-[#D4CAA3]/20 text-[8px] font-mono tracking-widest uppercase px-4 py-2">
              Browse Asset
            </button>
            <input 
              type="file" 
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadComplete(file);
              }} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept=".pdf,image/*" 
            />
          </div>
        </div>
      )}

      <div>
        {/* Top line with icon & external link */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
            <PillarIcon className="w-5 h-5 text-[#D4CAA3] group-hover:scale-110 transition-transform duration-300" />
          </div>
          {hasRecord && (
            <a 
              href={record.document_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-[#D4CAA3] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Title information */}
        <div className="flex items-center mb-1 relative">
          <h3 className="text-[#F9F6EE] font-serif text-xl tracking-tight">{label}</h3>
        </div>
        <p className="text-[9px] font-mono tracking-widest text-[#D4CAA3] uppercase mb-4">{subtitle}</p>
        <p className="text-xs text-zinc-500 font-light leading-relaxed mb-6">{description}</p>
      </div>

      <div>
        {/* Visual variants baselines */}
        {!hasRecord ? (
          // STATE V1: NO ASSET FOUND (THE INGESTION SLOT)
          isEditMode ? (
            <div className="border border-dashed border-white/10 bg-zinc-950/20 p-5 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/10 transition-all relative">
              {isUploading ? (
                <div className="flex items-center gap-2 text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ingesting...
                </div>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-zinc-700 mb-2 group-hover:text-[#D4CAA3] transition-colors" />
                  <span className="font-sans text-[9px] tracking-widest text-zinc-500 uppercase font-bold group-hover:text-zinc-400 transition-colors">
                    Deploy Document Asset +
                  </span>
                </>
              )}
              <input 
                type="file" 
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadComplete(file);
                }} 
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                accept=".pdf,image/*" 
              />
            </div>
          ) : (
            /* Public Trait: Clean, Immutable Sovereign Read-Only Placeholder State */
            <div className="w-full py-2.5 bg-zinc-950/60 border border-zinc-900/60 rounded flex items-center justify-center space-x-2">
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500 uppercase">
                Not Filed / Sealed
              </span>
            </div>
          )
        ) : (
          <div className="pt-4 border-t border-white/[0.04] space-y-3">
            {/* STATE V2: PENDING REVIEW */}
            {isPending && (
              <div className="flex items-center gap-2 font-sans text-[9px] tracking-widest text-amber-500 uppercase font-semibold animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Under Institutional Audit Review
              </div>
            )}

            {/* STATE V3: APPROVED COMPLIANCE DETAILS */}
            {isVerified && (
              <div className="flex items-center gap-2 font-sans text-[9px] tracking-widest text-[#DEFF9A] uppercase font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DEFF9A]" />
                Statutory Ledger Anchored
              </div>
            )}

            {/* STATE V4: REJECTED COMPLIANCE TRACE */}
            {isRejected && (
              <div className="bg-red-500/5 border border-red-500/10 p-3">
                <div className="flex items-center gap-1.5 text-red-500 font-sans text-[9px] tracking-widest uppercase font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Audit Action Required
                </div>
                <p className="text-red-400 font-sans text-[9px] tracking-wider uppercase mt-1 leading-normal">
                  Audit Failed: {record.comments || "Invalid Credentials"}
                </p>
                {/* Reupload capability */}
                <div className="mt-3 relative">
                  <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[8px] tracking-widest uppercase py-2 border border-red-500/20 transition-all">
                    Upload Corrective Asset ⟳
                  </button>
                  <input 
                    type="file" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUploadComplete(file);
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".pdf,image/*" 
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
              <span>LEDGER ID</span>
              <span className="text-zinc-600">HT-{record.id?.substring(0, 8)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
