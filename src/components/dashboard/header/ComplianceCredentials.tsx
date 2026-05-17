"use client";

import React from "react";

export function ComplianceCredentials() {
  const credentials = [
    {
      title: "IEC VERIFIED",
      description: "Live verification anchor secured directly through the DGFT network node registry. Active authorization for cross-border shipping compliance."
    },
    {
      title: "IDENTITY ANCHORED",
      description: "Cryptographic corporate signature mapped and validated against the sovereign industrial entity registries of India."
    },
    {
      title: "COMPLIANCE LOCK (4/4 DOCS)",
      description: "All foundational trade documents, including tax profiles and factory operating licenses, fully passed through manual audit channels."
    },
    {
      title: "🌐 10 COUNTRIES NETWORK",
      description: "Operational supply-chain presence and trade lanes verified across active international customs ports."
    },
    {
      title: "🇮🇳 SOVEREIGN EXPORT NODE",
      description: "Registered clearance profile originating from domestic manufacturing zones under global commercial treaties."
    },
    {
      title: "VERIFIED MANUFACTURER",
      description: "Physical infrastructure and automated processing lines audited for sustained high-capacity export production loops."
    },
    {
      title: "ESTABLISHED 1975",
      description: "Over 51 years of legacy performance metrics and verified domain standing in the international industrial landscape."
    },
    {
      title: "PRODUCTION MOQ: 200 UNITS",
      description: "Minimum operational order baseline optimized to guarantee maximum unit craftsmanship and strict export quality compliance controls."
    }
  ];

  return (
    <section className="bg-[#0A0A0A] py-12 px-4 max-w-7xl mx-auto w-full">
      <span className="font-sans text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-8 block">
        {"// CORPORATE REGISTRY & OPERATIONAL CREDENTIALS"}
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {credentials.map((cred, idx) => (
          <div key={idx} className="border-l border-white/5 pl-4 flex flex-col">
            <h3 className="font-sans text-xs tracking-wider text-zinc-200 font-semibold uppercase">
              {cred.title}
            </h3>
            <p className="font-sans text-[11px] leading-relaxed text-zinc-500 mt-1">
              {cred.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
