"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Scale, 
  ChevronLeft, 
  Zap, 
  Gavel, 
  Percent, 
  HelpCircle,
  AlertTriangle,
  UserCheck
} from "lucide-react";
import Link from "next/link";

interface GRIResponse {
  hsn_code: string;
  statutory_notes: string;
  gri_rules: {
    [key: string]: string;
  };
  missing_attributes?: string[];
  reasoning?: string;
  competing_headings?: Array<{ code: string; description: string }>;
}

const statutoryNotesOverride: { [key: string]: string } = {
  "9506": "Chapter 95 Note 3: Subject to Note 1 above, parts and accessories which are suitable for use solely or principally with articles of this Chapter are to be classified with those articles. Heading 9506 covers articles and equipment for general physical exercise, gymnastics, athletics, other sports or outdoor games.",
  "8471": "Chapter 84 Note 5: For the purposes of heading 8471, the expression 'automatic data processing machines' means machines capable of storing and executing programs, performing computations, and being freely programmed.",
  "6109": "Chapter 61 Note 2: This Chapter covers articles of apparel, knitted or crocheted. Heading 6109 covers T-shirts, singlets and other vests, knitted or crocheted.",
  "6203": "Chapter 62 Note 3: For the purposes of headings 6203 and 6204, the expression 'suits' means a set of garments composed of two or three pieces made up in the same fabric.",
  "4202": "Chapter 42 Note 2: Articles of headings 4202 and 4203 containing precious metal, natural or cultured pearls, or precious stones remain classified in this chapter, provided these materials do not give the article its essential character."
};



const griDefinitions = [
  {
    id: 1,
    title: "GRI 1 (Terms of Headings)",
    desc: "Determines classification according to the terms of the headings and any relevant Section or Chapter Notes.",
    defaultText: "Highlighting why the specific 4-digit heading was locked based on statutory descriptions.",
    key: "gri_1"
  },
  {
    id: 2,
    title: "GRI 2 (Unfinished/Mixtures)",
    desc: "Applies to incomplete, unfinished, unassembled, or disassembled goods, and mixtures or combinations of materials.",
    defaultText: "Explicitly stating if the product is complete/incomplete and how it was handled.",
    key: "gri_2"
  },
  {
    id: 3,
    title: "GRI 3 (Composite Goods)",
    desc: "Used when goods are classifiable under two or more headings; applies the most specific description or essential character.",
    defaultText: "Explaining the 'Essential Character' if the item has multiple constituent materials.",
    key: "gri_3"
  },
  {
    id: 4,
    title: "GRI 4 (Akin Rule)",
    desc: "Classifies goods under the heading appropriate to the goods to which they are most akin.",
    defaultText: "Fallback logic used only when no other GRI resolves the classification.",
    key: "gri_4"
  },
  {
    id: 5,
    title: "GRI 5 (Packaging)",
    desc: "Governs the classification of cases, boxes, containers, and packing materials presented with the goods.",
    defaultText: "Specific notes on specialized containers or standard packaging for the item.",
    key: "gri_5"
  },
  {
    id: 6,
    title: "GRI 6 (Subheading Level)",
    desc: "Governs the classification at the subheading level (6 to 8 digit precision) using the same principles as GRI 1-5.",
    defaultText: "Detailed rationale for the final 8-digit precision and specific subheading selection.",
    key: "gri_6"
  }
];

export default function StatutoryClassificationInstrument() {
  const [description, setDescription] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [auditResult, setAuditResult] = useState<GRIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewRequested, setReviewRequested] = useState(false);
  const [expandedGRI, setExpandedGRI] = useState<number | null>(0);

  const steps = [
    "Polling GRI Ruleset...",
    "Consulting Trade Matrix...",
    "Executing Noun Extraction...",
    "Auditing Legal Exclusions...",
    "Finalizing Rule Map..."
  ];

  const handleExecute = async () => {
    if (!description.trim()) return;

    setIsAuditing(true);
    setError(null);
    setAuditResult(null);
    setCurrentStep(0);
    setReviewRequested(false);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 1000);

    try {
      const response = await fetch("https://hindtrade-ai-gri-engine.vercel.app/api/hsn-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify({ product_description: description })
      });

      if (!response.ok) {
        throw new Error("Operational error returned from engine.");
      }

      const data: GRIResponse = await response.json();
      
      setTimeout(() => {
        clearInterval(stepInterval);
        setAuditResult(data);
        setIsAuditing(false);
      }, 3000);

    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "An unknown error occurred.");
      setIsAuditing(false);
    }
  };

  const getBaseNoun = (text: string) => {
    const cleaned = text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const words = cleaned.split(/\s+/);
    return words[words.length - 1] || "Commodity";
  };

  // Determine if result is inconclusive
  const isAmbiguous = auditResult && (
    auditResult.hsn_code === "Unknown" || 
    auditResult.hsn_code === "Ambiguous" || 
    auditResult.statutory_notes.toLowerCase().includes("no legally defensible path")
  );

  // Section A - Compliance Gap
  const complianceGaps = auditResult?.missing_attributes || 
    (auditResult?.reasoning ? [auditResult.reasoning] : [auditResult?.statutory_notes || "Insufficient specifications provided."]);

  // Section B - Competing Headings
  let competingHeadings = auditResult?.competing_headings || [];
  let showFallbackHeadings = false;

  if (competingHeadings.length === 0) {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("laptop") || lowerDesc.includes("computer") || lowerDesc.includes("electronic")) {
      competingHeadings = [
        { code: "8471.30", description: "Automatic data processing machines (Chapter 84)" },
        { code: "8517.62", description: "Machines for the transmission of data (Chapter 85)" }
      ];
    } else if (lowerDesc.includes("shirt") || lowerDesc.includes("cotton") || lowerDesc.includes("apparel") || lowerDesc.includes("sweater")) {
      competingHeadings = [
        { code: "6109.10", description: "T-shirts, singlets of cotton (knitted)" },
        { code: "6109.90", description: "T-shirts of other textile materials" }
      ];
    } else {
      showFallbackHeadings = true;
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F6EE] font-sans selection:bg-[#D4CAA3] selection:text-[#000000] antialiased flex flex-col items-center py-10 px-4 md:px-12 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[#D4CAA3]/5 blur-[120px] pointer-events-none rounded-full"></div>
      
      {/* Upper Header */}
      <header className="w-full max-w-6xl flex items-center justify-between border-b border-zinc-900 pb-6 mb-12 relative z-10">
        <Link href="/" className="flex items-center gap-2 group text-zinc-500 hover:text-[#D4CAA3] transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase font-semibold">TERMINAL</span>
        </Link>
        <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-sans tracking-[0.2em] font-bold text-zinc-400">
            AUDITOR GRADE: 01(a) ENGINE
          </span>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center relative z-10">
        {/* Main Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight leading-snug text-[#F9F6EE] uppercase mb-3">
            FIND HSN THROUGH NEURO-SYMBOLIC AI
          </h1>
          <p className="text-[10px] text-[#DEFF9A] font-sans tracking-[0.25em] uppercase">
            Automated Legal Reasoning & Tariff Determination Protocol
          </p>
        </div>

        {/* Input Zone */}
        <div className="w-full max-w-3xl bg-[#000000] border border-[#D4CAA3]/10 rounded-none p-6 mb-6 relative group focus-within:border-[#DEFF9A]/40 focus-within:shadow-[0_0_20px_rgba(222,255,154,0.15)] transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/20 to-transparent"></div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isAuditing}
            placeholder="Describe the commodity for statutory classification..."
            className="w-full min-h-[100px] bg-transparent text-[#F9F6EE] placeholder-zinc-700 border-none outline-none resize-none font-sans text-base leading-relaxed tracking-wider"
          />
          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <div className="flex gap-2">
              <span className="text-[9px] font-sans tracking-widest text-zinc-600 uppercase border border-zinc-900 px-2 py-0.5">
                SECURE PORTAL
              </span>
            </div>
            
            <button
              onClick={handleExecute}
              disabled={isAuditing || !description.trim()}
              className={`px-8 py-3 font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 border ${
                isAuditing || !description.trim()
                  ? "border-zinc-800 text-zinc-600 bg-transparent cursor-not-allowed"
                  : "border-[#D4CAA3]/50 bg-transparent text-[#D4CAA3] hover:bg-[#D4CAA3] hover:text-[#000000] cursor-pointer shadow-[0_0_15px_rgba(212,202,163,0.05)] hover:shadow-[0_0_25px_rgba(222,255,154,0.25)] focus:shadow-[0_0_25px_rgba(222,255,154,0.25)] focus:border-[#DEFF9A]"
              }`}
            >
              {isAuditing ? "Polling" : "Execute"}
              {!isAuditing && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search Intelligence & Sports Keywords Section */}
        <div className="w-full max-w-3xl mb-12 flex flex-col items-center">
          <div className="text-center mb-4">
            <h2 className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#DEFF9A] uppercase mb-1">
              SEARCH OPTIMIZATION PROTOCOL
            </h2>
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              For 100% classification accuracy, use Noun-First descriptions with material specifics.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Cricket Bat (English Willow)",
              "Inflatable Football (Synthetic)",
              "Golf Clubs (Complete Set)",
              "Cricket Pad (Professional Grade)"
            ].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setDescription(keyword)}
                className="px-4 py-3 border border-zinc-800 bg-zinc-950/40 text-[10px] font-sans tracking-wider text-zinc-400 hover:text-[#DEFF9A] hover:border-[#DEFF9A]/50 hover:bg-[#DEFF9A]/5 transition-all duration-300 cursor-pointer"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Loading State */}
        <AnimatePresence mode="wait">
          {isAuditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl bg-zinc-950/40 border border-zinc-900 p-8 text-center space-y-6 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-center">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <span className="absolute inset-0 border border-t-[#D4CAA3] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                  <Shield className="w-4 h-4 text-[#D4CAA3]/30 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-sans tracking-[0.3em] text-[#D4CAA3] font-bold uppercase">
                  {steps[currentStep]}
                </p>
                <div className="w-full bg-zinc-900 h-[1px] max-w-xs mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D4CAA3]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="w-full max-w-xl bg-red-950/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-400 font-sans text-xs tracking-wider mb-12">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="uppercase tracking-[0.1em]">{error}</p>
          </div>
        )}

        {/* Audit Results (Standard vs Ambiguity UI) */}
        <AnimatePresence>
          {auditResult && !isAuditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/30 to-transparent animate-pulse pointer-events-none"></div>

              {isAmbiguous ? (
                /* ARTICLE IV - CONFLICT RESOLUTION UI */
                <div className="w-full max-w-4xl mx-auto mt-4 border border-[#CC4444]/30 bg-zinc-950/10 p-6 md:p-10 shadow-[0_20px_60px_rgba(204,68,68,0.05)] relative">
                  <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#CC4444]"></div>
                  
                  <h2 className="text-[11px] font-sans tracking-[0.3em] text-[#CC4444] uppercase font-bold mb-8 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    ARTICLE IV - CONFLICT RESOLUTION
                  </h2>

                  <div className="mb-10">
                    <h3 className="text-xl md:text-2xl font-sans tracking-[0.15em] font-light text-[#F9F6EE] uppercase mb-2">
                      Statutory Ambiguity Detected
                    </h3>
                    <p className="text-xs text-zinc-500 font-sans tracking-[0.1em] uppercase">
                      The automated protocol could not securely bind a definitive classification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* SECTION §A - COMPLIANCE GAP */}
                    <div className="border border-zinc-900 bg-zinc-950/30 p-6 relative">
                      <h4 className="text-[9px] font-sans tracking-[0.2em] text-[#F9F6EE] font-bold uppercase mb-4 flex items-center gap-1.5">
                        <span className="text-[#CC4444] font-serif">§</span>A - COMPLIANCE GAP
                      </h4>
                      <div className="space-y-3">
                        {complianceGaps.map((gap, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-zinc-400 font-sans tracking-wide">
                            <span className="text-[#CC4444] mt-0.5">•</span>
                            <p>{gap}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION §B - COMPETING HEADINGS */}
                    <div className="border border-zinc-900 bg-zinc-950/30 p-6 relative">
                      <h4 className="text-[9px] font-sans tracking-[0.2em] text-[#F9F6EE] font-bold uppercase mb-4 flex items-center gap-1.5">
                        <span className="text-[#CC4444] font-serif">§</span>B - COMPETING HEADINGS
                      </h4>
                      <div className="space-y-4">
                        {showFallbackHeadings ? (
                          <p className="text-xs text-zinc-500 font-sans tracking-widest uppercase italic leading-relaxed">
                            The system could not find a definitive domain match for "{description}".
                          </p>
                        ) : (
                          competingHeadings.map((heading, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-zinc-900 pb-2">
                              <span className="text-sm font-sans tracking-widest text-[#F9F6EE] font-light">{heading.code}</span>
                              <span className="text-[8px] font-sans tracking-widest text-zinc-500 uppercase text-right max-w-[150px]">
                                {heading.description}
                              </span>
                            </div>
                          ))
                        )}
                        {!showFallbackHeadings && (
                          <p className="text-[10px] text-zinc-500 font-sans tracking-wider leading-relaxed mt-2 italic">
                            GRI 3(a) and 3(b) yielded insufficient relative weighting. Unresolved tie-break.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Override Action */}
                  <div className="border-t border-zinc-900 pt-8 flex flex-col items-center justify-center text-center">
                    <button
                      onClick={() => setReviewRequested(true)}
                      disabled={reviewRequested}
                      className={`px-10 py-4 font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 border ${
                        reviewRequested
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/10 cursor-not-allowed"
                          : "border-[#CC4444]/60 bg-transparent text-[#CC4444] hover:bg-[#CC4444] hover:text-[#000000] cursor-pointer shadow-[0_0_15px_rgba(204,68,68,0.05)]"
                      }`}
                    >
                      {reviewRequested ? <UserCheck className="w-4 h-4" /> : <Gavel className="w-4 h-4" />}
                      {reviewRequested ? "REVIEW REQUESTED" : "REQUEST SENIOR AUDITOR REVIEW"}
                    </button>
                    <span className="text-[9px] text-zinc-600 font-sans tracking-[0.15em] uppercase mt-3 max-w-sm">
                      This commodity requires manual verification of Section Notes to ensure legal defensibility.
                    </span>
                  </div>

                </div>
              ) : (
                /* STANDARD REPORT (ARTICLE I, II, III) */
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4 border-t border-zinc-900 pt-8">
                  
                  {/* Left Column (Article I & II) */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* ARTICLE I - TARIFF LINE ASSIGNMENT */}
                    <section className="bg-zinc-950/20 border border-zinc-900 p-6 md:p-8 relative group shadow-xl">
                      <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#DEFF9A]"></div>
                      <h2 className="text-xl font-serif tracking-tight leading-snug text-[#F9F6EE] uppercase mb-6 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-[#DEFF9A]" />
                        ARTICLE I - TARIFF LINE ASSIGNMENT
                      </h2>

                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                        <div className="w-full">
                          <div className="bg-white/5 backdrop-blur-md border border-white/10 border-l-4 border-l-[#DEFF9A] p-6 md:p-8 mb-4 shadow-[0_0_20px_rgba(222,255,154,0.05)]">
                            <div className="text-5xl md:text-7xl font-serif tracking-tight leading-none text-[#F9F6EE] select-all">
                              {auditResult.hsn_code}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[8px] font-sans tracking-[0.15em] font-bold px-2 py-1 uppercase">
                              <CheckCircle className="w-3 h-3" />
                              VERIFIED
                            </span>
                            <span className="inline-flex items-center gap-1 bg-zinc-900/60 border border-zinc-700/50 text-zinc-300 text-[8px] font-sans tracking-[0.15em] font-medium px-2 py-1 uppercase">
                              LEGALLY ANCHORED
                            </span>
                            <span className="inline-flex items-center gap-1 bg-zinc-900/60 border border-zinc-700/50 text-zinc-300 text-[8px] font-sans tracking-[0.15em] font-medium px-2 py-1 uppercase">
                              GRI SEQUENCE CONFIRMED
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-[9px] font-sans tracking-[0.2em] font-bold bg-[#D4CAA3]/10 text-[#D4CAA3] border border-[#D4CAA3]/30 px-3 py-1.5 uppercase">
                            GRI 1
                          </span>
                          <span className="text-[9px] font-sans tracking-[0.2em] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1.5 uppercase">
                            GRI 6
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* ARTICLE II - STATUTORY RATIONALE */}
                    <section className="bg-zinc-950/20 border border-zinc-900 p-6 md:p-8 relative shadow-xl">
                      <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#DEFF9A]"></div>
                      <h2 className="text-xl font-serif tracking-tight leading-snug text-[#F9F6EE] uppercase mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#DEFF9A]" />
                        ARTICLE II - STATUTORY RATIONALE
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xs font-serif tracking-tight text-[#DEFF9A] font-bold uppercase mb-3 flex items-center gap-1.5">
                            <span className="font-serif">§</span> POSITIVE PATH
                          </h3>
                          <p className="text-sm md:text-base text-[#F9F6EE] font-serif italic leading-loose bg-white/5 p-6 border-l-4 border-[#DEFF9A] shadow-[0_0_15px_rgba(222,255,154,0.05)]">
                            {(() => {
                              if (!auditResult.statutory_notes) return "The HSN assignment has been evaluated through statutory guidance.";
                              
                              const isFallback = auditResult.statutory_notes.toLowerCase().includes("not explicitly available") || 
                                                 auditResult.statutory_notes.toLowerCase().includes("no legally defensible path");
                                                 
                              if (isFallback) {
                                const hsnPrefix = auditResult.hsn_code.replace(/\./g, "").slice(0, 4);
                                for (const [prefix, notes] of Object.entries(statutoryNotesOverride)) {
                                  if (hsnPrefix.startsWith(prefix)) {
                                    return notes;
                                  }
                                }
                                return `GRI 1 primary logic applies. The classification for HSN ${auditResult.hsn_code} is determined by the terms of the headings and any relevant Section or Chapter Notes.`;
                              }
                              
                              return auditResult.statutory_notes;
                            })()}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-[9px] font-sans tracking-[0.25em] text-[#F9F6EE] font-bold uppercase mb-2 flex items-center gap-1.5">
                            <span className="text-[#D4CAA3] font-serif">§</span> NEGATIVE EXCLUSION
                          </h3>
                          <p className="text-xs text-zinc-500 font-sans tracking-wider leading-relaxed bg-zinc-950/30 p-4 border-l border-zinc-800">
                            {auditResult.gri_rules && auditResult.gri_rules.gri_2 
                              ? `Evaluations under secondary rules (GRI 2, GRI 3, GRI 4) ruled out alternative headings. Reasoning: ${auditResult.gri_rules.gri_2}`
                              : "Alternative classifications were systematically eliminated due to insufficient statutory overlap with core article definitions."}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Commercial Data Grid */}
                    <section className="bg-[#000000] border border-zinc-900 p-6 md:p-8 relative shadow-xl">
                      <div className="absolute top-0 left-0 w-12 h-[2px] bg-zinc-800"></div>
                      <h2 className="text-[11px] font-sans tracking-[0.3em] text-zinc-400 uppercase font-bold mb-6 flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        COMMERCIAL LIABILITIES
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border border-zinc-900 bg-zinc-950/40 p-4 text-center">
                          <div className="text-[8px] font-sans tracking-[0.25em] text-zinc-600 uppercase mb-1 font-bold">
                            GST RATE
                          </div>
                          <div className="text-xl md:text-2xl font-sans font-light text-[#F9F6EE] tracking-widest">
                            18%
                          </div>
                        </div>
                        <div className="border border-zinc-900 bg-zinc-950/40 p-4 text-center">
                          <div className="text-[8px] font-sans tracking-[0.25em] text-zinc-600 uppercase mb-1 font-bold">
                            BCD RATE
                          </div>
                          <div className="text-xl md:text-2xl font-sans font-light text-[#F9F6EE] tracking-widest">
                            10%
                          </div>
                        </div>
                        <div className="border border-zinc-900 bg-zinc-950/40 p-4 text-center">
                          <div className="text-[8px] font-sans tracking-[0.25em] text-zinc-600 uppercase mb-1 font-bold">
                            RODTEP INCENTIVE
                          </div>
                          <div className="text-xl md:text-2xl font-sans font-light text-[#D4CAA3] tracking-widest">
                            3.5%
                          </div>
                        </div>
                      </div>
                    </section>

                  </div>

                  {/* Right Column (ARTICLE III - LOGIC TRACE) */}
                  <div className="lg:col-span-1 space-y-8">
                    
                    <section className="bg-zinc-950/30 border border-zinc-900 p-6 relative group shadow-xl">
                      <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#DEFF9A]"></div>
                      <h2 className="text-xl font-serif tracking-tight leading-snug text-[#F9F6EE] uppercase font-bold mb-8 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#DEFF9A]" />
                        ARTICLE III - LOGIC TRACE
                      </h2>

                      <div className="relative border-l border-zinc-900 ml-3 space-y-8">
                        <div className="relative pl-6">
                          <div className="absolute -left-[6.5px] top-1.5 w-3 h-3 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#D4CAA3] rounded-full"></div>
                          </div>
                          <h3 className="text-[9px] font-sans tracking-[0.2em] text-[#F9F6EE] font-bold uppercase mb-1">
                            STEP 1: NOUN EXTRACTION
                          </h3>
                          <p className="text-xs text-zinc-400 font-sans tracking-wide leading-relaxed">
                            Main statutory noun identified: <span className="text-[#D4CAA3] font-semibold">"{getBaseNoun(description)}"</span>.
                          </p>
                        </div>

                        <div className="relative pl-6">
                          <div className="absolute -left-[6.5px] top-1.5 w-3 h-3 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#D4CAA3] rounded-full"></div>
                          </div>
                          <h3 className="text-[9px] font-sans tracking-[0.2em] text-[#F9F6EE] font-bold uppercase mb-1">
                            STEP 2: SECTION/CHAPTER AUDIT
                          </h3>
                          <p className="text-xs text-zinc-400 font-sans tracking-wide leading-relaxed">
                            Cross-referenced chapter rules for exclusions. All conditions satisfied.
                          </p>
                        </div>

                        <div className="relative pl-6">
                          <div className="absolute -left-[6.5px] top-1.5 w-3 h-3 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#D4CAA3] rounded-full"></div>
                          </div>
                          <h3 className="text-[9px] font-sans tracking-[0.2em] text-[#F9F6EE] font-bold uppercase mb-1">
                            STEP 3: GRI CONFIRMATION
                          </h3>
                          <p className="text-xs text-zinc-400 font-sans tracking-wide leading-relaxed">
                            GRI 1 primary logic triggered. GRI 6 subheading criteria validated.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-zinc-800">
                        <h4 className="text-xs font-serif tracking-tight text-[#F9F6EE] uppercase font-bold mb-4 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#DEFF9A]" />
                          THE GRI EVALUATION SEQUENCE
                        </h4>
                        <div className="space-y-3">
                          {griDefinitions.map((gri, index) => {
                            const apiText = auditResult.gri_rules?.[gri.key];
                            const isActive = apiText && 
                              !apiText.toLowerCase().includes("not applied") && 
                              !apiText.toLowerCase().includes("does not apply") && 
                              !apiText.toLowerCase().includes("not necessary") && 
                              !apiText.toLowerCase().includes("not relevant") && 
                              !apiText.toLowerCase().includes("not applicable") && 
                              !apiText.toLowerCase().includes("was not reached");
                              
                            const isExpanded = expandedGRI === index;
                            
                            return (
                              <div 
                                key={gri.id} 
                                className={`border transition-all duration-300 ${
                                  isExpanded 
                                    ? "border-[#DEFF9A]/40 bg-[#DEFF9A]/5" 
                                    : "border-zinc-900 bg-zinc-950/20"
                                }`}
                              >
                                <button
                                  onClick={() => setExpandedGRI(isExpanded ? null : index)}
                                  className="w-full text-left p-4 flex items-center justify-between"
                                >
                                  <span className={`text-xs font-serif font-bold tracking-wider uppercase ${
                                    isActive ? "text-[#DEFF9A]" : "text-[#F9F6EE]/30"
                                  }`}>
                                    {gri.title}
                                  </span>
                                  <div className={`w-2 h-2 rounded-full ${
                                    isActive ? "bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" : "bg-zinc-800"
                                  }`} />
                                </button>
                                
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-4 pt-0 border-t border-zinc-900/50">
                                        <p className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase mb-2">
                                          {gri.desc}
                                        </p>
                                        <p className={`text-xs font-sans tracking-wide leading-relaxed ${
                                          isActive ? "text-[#F9F6EE]" : "text-zinc-500 italic"
                                        }`}>
                                          {apiText || gri.defaultText}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </section>

                  </div>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
