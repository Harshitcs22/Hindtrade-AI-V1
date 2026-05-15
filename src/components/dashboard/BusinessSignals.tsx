"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// ── TICKER DATA ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { label: "Shipment Success",   value: "98.2%",          },
  { label: "Avg Lead Time",      value: "14 Days",        },
  { label: "Active Markets",     value: "12+ Countries",  },
  { label: "AI Response",        value: "Instant",        },
  { label: "Human Team",         value: "1-2 Hrs",        },
  { label: "Trust Score",        value: "Verified",       },
  { label: "Logistics",          value: "Optimized",      },
  { label: "MOQ",                value: "500 Units",      },
];

// Double for seamless infinite loop
const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

export function BusinessSignals() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      className="BusinessSignals relative w-full border-y border-white/5 backdrop-blur-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left edge fade */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      {/* Right edge fade */}
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* Marquee track */}
      <motion.div
        className="BusinessSignals_track flex items-center whitespace-nowrap py-6"
        animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 38,
            ease: "linear",
          },
        }}
      >
        {ITEMS.map(({ label, value }, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            {/* Data point */}
            <div className="flex items-center gap-4 px-12">
              <span className="text-sm tracking-[0.2em] font-serif text-[#D4CAA3]/80 uppercase">
                {label}
              </span>
              <span className="text-base font-serif font-semibold tracking-[0.15em] text-[#22D3EE] drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
                {value}
              </span>
            </div>

            {/* Cyan diamond divider */}
            <span className="text-[#22D3EE]/30 text-[8px] shrink-0 select-none">
              ◆
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
