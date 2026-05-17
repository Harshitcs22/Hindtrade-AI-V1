"use client";

import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe, CheckCircle2, HelpCircle } from "lucide-react";

const TARIFF_CHAPTER_REGISTRY: Record<string, string> = {
  "95": "Toys, games and sports requisites; parts and accessories thereof (DGFT Schedule 1 / HS Code Division)",
  "42": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers",
  "61": "Articles of apparel and clothing accessories, knitted or crocheted",
  "62": "Articles of apparel and clothing accessories, not knitted or crocheted",
  "64": "Footwear, gaiters and the like; parts of such articles",
  "82": "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof of base metal",
  "94": "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings",
};

interface IdentitySectionProps {
  firmDetails: any;
  isEditMode: boolean;
  handleFieldSync: (field: string, val: any) => Promise<void>;
}

function EditableField({
  value,
  field,
  className,
  placeholder,
  as: Tag = "span",
  isEditMode,
  handleFieldSync,
}: {
  value: string;
  field: string;
  className?: string;
  placeholder?: string;
  as?: "span" | "h1" | "p";
  isEditMode: boolean;
  handleFieldSync: (field: string, val: any) => Promise<void>;
}) {
  if (!isEditMode) return <Tag className={className}>{value || placeholder}</Tag>;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      data-sovereign-edit="true"
      data-placeholder={placeholder}
      className={`${className} cursor-text px-1 outline-none transition-all border-b border-white/5 focus:border-[#D4CAA3]`}
      onBlur={(e) => {
        const val = (e.target as HTMLElement).textContent?.trim() || value;
        void handleFieldSync(field, val);
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

export function IdentitySection({
  firmDetails,
  isEditMode,
  handleFieldSync,
}: IdentitySectionProps) {
  return (
    <div className="space-y-3 max-w-2xl">
      <EditableField
        as="h1"
        field="name"
        value={firmDetails.name}
        placeholder="Your Firm Name"
        className="text-5xl md:text-[4.5rem] font-serif text-[#F9F6EE] tracking-tight uppercase leading-none"
        isEditMode={isEditMode}
        handleFieldSync={handleFieldSync}
      />

      <div className="flex items-center flex-wrap gap-8 mt-6 mb-6">
        <div className="flex items-baseline">
          <span className="font-sans text-[11px] tracking-wider text-white/40 uppercase mr-3">Core Sector:</span>
          {isEditMode ? (
            <input
              defaultValue={firmDetails.deals_in}
              className="bg-transparent border-b border-white/5 outline-none font-sans text-base uppercase tracking-wider text-[#F9F6EE] focus:border-[#D4CAA3] transition-colors px-0 min-w-[200px]"
              onBlur={(e) => {
                void handleFieldSync("deals_in", e.target.value);
              }}
            />
          ) : (
            <span className="font-sans text-base text-[#F9F6EE] uppercase tracking-wider">{firmDetails.deals_in}</span>
          )}
        </div>

        <div className="flex items-center relative">
          <span className="font-sans text-[11px] tracking-wider text-white/40 uppercase mr-3">Customs Chapter:</span>
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <input
                defaultValue={firmDetails.domestic_presence?.customs_chapter || "95"}
                className="bg-transparent border-b border-white/5 outline-none font-sans text-base uppercase tracking-wider text-[#F9F6EE] focus:border-[#D4CAA3] transition-colors px-0 w-16 text-center leading-none"
                onBlur={(e) => {
                  void handleFieldSync("customs_chapter", e.target.value);
                }}
              />
            ) : (
              <span className="font-sans text-base text-[#F9F6EE] uppercase tracking-wider leading-none">
                {firmDetails.domestic_presence?.customs_chapter || "95"}
              </span>
            )}

            <TooltipProvider delay={80}>
              <Tooltip>
                <TooltipTrigger render={<span />}>
                  <motion.span
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center justify-center text-white/45 hover:text-zinc-100 transition-colors cursor-help"
                    title="View Customs Chapter details"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </motion.span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  sideOffset={10}
                  className="w-72 rounded-sm border border-white/20 bg-[#0A0A0A] p-4 text-[#F9F6EE] shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
                >
                  <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-mono tracking-[0.15em] uppercase text-white/70">
                    <CheckCircle2 className="w-3 h-3" />
                    HS CODE REFERENCE
                  </div>
                  <p className="mb-3 text-sm font-serif leading-relaxed text-[#F9F6EE]">
                    {TARIFF_CHAPTER_REGISTRY[firmDetails.domestic_presence?.customs_chapter || "95"] ||
                      "Chapter details not found. Please verify your HS code classification."}
                  </p>
                  <div className="mt-2 border-t border-white/10 pt-2 text-[9px] font-mono text-zinc-400">
                    Source: DGFT / Indian Customs Tariff
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-4 text-zinc-400 font-sans text-[10px] tracking-[0.18em] uppercase font-medium w-full">
        {/* 1. Global Reach */}
        <span className="text-white font-semibold flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-[#D4CAA3]/60 shrink-0" />
          {Object.keys(firmDetails.global_presence || {}).length || "10"} Countries
        </span>

        <span className="text-[#D4CAA3]/30 font-normal">•</span>

        {/* 2. Sovereign Node */}
        <span className="flex items-center gap-1">
          🇮🇳 India Exporter
        </span>

        <span className="text-[#D4CAA3]/30 font-normal">•</span>

        {/* 3. Manufacturer Designation */}
        <span>
          {firmDetails.identity_anchored ? "Verified Manufacturer" : "Provisional Exporter"}
        </span>

        <span className="text-[#D4CAA3]/30 font-normal">•</span>

        {/* 4. Legacy Timeline */}
        {isEditMode ? (
          <span className="flex items-center gap-1">
            <span className="text-[#D4CAA3]/50">EST.</span>
            <input
              defaultValue={String(firmDetails.established || "1975")}
              className="bg-transparent border-b border-white/5 outline-none font-sans text-[10px] tracking-[0.18em] uppercase text-zinc-400 font-medium w-12 text-center focus:border-[#D4CAA3] transition-colors px-0"
              onBlur={(e) => {
                const val = e.target.value.trim();
                void handleFieldSync("established", val);
              }}
            />
          </span>
        ) : (
          <span>Est. {firmDetails.established || "1975"}</span>
        )}

        <span className="text-[#D4CAA3]/30 font-normal">•</span>

        {/* 5. Live MOQ Insertion */}
        {isEditMode ? (
          <span className="flex items-center gap-1">
            <span className="text-[#D4CAA3]/50">MOQ:</span>
            <input
              defaultValue={firmDetails.domestic_presence?.moq || "110 UNITS"}
              className="bg-transparent border-b border-white/5 outline-none font-sans text-[10px] tracking-[0.18em] uppercase text-[#D4CAA3] font-semibold w-24 text-center focus:border-[#D4CAA3] transition-colors px-0"
              onBlur={(e) => {
                const val = e.target.value.trim();
                void handleFieldSync("moq", val);
              }}
            />
          </span>
        ) : (
          <span className="text-[#D4CAA3] font-semibold">
            MOQ: {firmDetails.domestic_presence?.moq || "110 UNITS"}
          </span>
        )}
      </div>
    </div>
  );
}
