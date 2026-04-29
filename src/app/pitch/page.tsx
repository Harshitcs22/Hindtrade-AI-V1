"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { X, ChevronUp, ChevronDown } from "lucide-react";

// Dynamically import slides
const Slide01 = dynamic(() => import("@/components/pitch/Slide01"), { ssr: false });
const Slide02 = dynamic(() => import("@/components/pitch/Slide02"), { ssr: false });
const Slide03 = dynamic(() => import("@/components/pitch/Slide03"), { ssr: false });
const Slide04 = dynamic(() => import("@/components/pitch/Slide04"), { ssr: false });
const Slide05 = dynamic(() => import("@/components/pitch/Slide05"), { ssr: false });
const Slide06 = dynamic(() => import("@/components/pitch/Slide06"), { ssr: false });
const Slide07 = dynamic(() => import("@/components/pitch/Slide07"), { ssr: false });
const Slide08 = dynamic(() => import("@/components/pitch/Slide08"), { ssr: false });
const Slide09 = dynamic(() => import("@/components/pitch/Slide09"), { ssr: false });
const Slide10 = dynamic(() => import("@/components/pitch/Slide10"), { ssr: false });
const Slide10B = dynamic(() => import("@/components/pitch/Slide10B"), { ssr: false });
const Slide11 = dynamic(() => import("@/components/pitch/Slide11"), { ssr: false });

const slides = [
  {
    id: 12,
    type: "traction",
    tag: "Validation",
    title: "Mayor Group Beta Partner",
    subtitle: "Real-world testing with enterprise-grade volume.",
    content: "Validating the engine against complex, high-frequency trade data.",
  },
  {
    id: 13,
    type: "comparison",
    tag: "Competitive Landscape",
    title: "The Market Gap",
    subtitle: "Where standard solutions fall short.",
    tiers: [
      { name: "Legacy ERPs", status: "Slow & Rigid" },
      { name: "Standard LLMs", status: "Unreliable" },
      { name: "HindTrade AI", status: "Deterministic & Fast" },
    ],
  },
  {
    id: 14,
    type: "moat",
    tag: "Defensibility",
    title: "The Architectural Moat",
    subtitle: "Combining Generative AI with Symbolic Logic.",
    content: "Hardcoded legal frameworks wrapping around powerful neural networks.",
  },
  {
    id: 15,
    type: "roadmap",
    tag: "Roadmap",
    title: "Key Milestones",
    steps: ["Q4 2026: Public Access Waitlist", "Q1 2027: Multi-modal Expansion"],
  },
  {
    id: 16,
    type: "stats",
    tag: "Financials",
    title: "Growth Projections",
    metric: "$10M ARR",
    subtext: "Targeted achievement within 24 months of full launch.",
  },
  {
    id: 17,
    type: "team",
    tag: "The Team",
    title: "Domain Expertise",
    subtitle: "Built by industry veterans and AI researchers.",
    content: "Combining decades of trade logistics experience with cutting-edge tech.",
  },
  {
    id: 18,
    type: "ask",
    tag: "The Ask",
    title: "Strategic Round",
    subtitle: "Accelerating our deployment timeline.",
    content: "Raising capital to scale the engineering team and secure core network nodes.",
  },
  {
    id: 19,
    type: "vision",
    tag: "The Horizon",
    title: "The Sovereign Trade OS",
    subtitle: "Connecting global supply chains seamlessly.",
    content: "Building the invisible, unbreakable trust layer for international trade.",
  },
  {
    id: 20,
    type: "appendix",
    tag: "Next Steps",
    title: "Verification & Contact",
    subtitle: "See the Neuro-symbolic Engine in action.",
    content: "Request a deep-dive technical walkthrough.",
  },
];

export default function PitchPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 12;

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-slide-index"));
          setActiveSlide(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = containerRef.current?.querySelectorAll("[data-slide-index]");
    sections?.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSlide = (index: number) => {
    const sections = containerRef.current?.querySelectorAll("[data-slide-index]");
    if (sections && sections[index]) {
      sections[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main 
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#0A0A0A] text-[#F9F6EE] font-sans selection:bg-[#D4CAA3] selection:text-[#0A0A0A] scroll-smooth"
    >
      {/* Close Button */}
      <Link
        href="/"
        className="fixed top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-none text-zinc-400 hover:text-white transition-all duration-300"
        aria-label="Close presentation"
      >
        <X className="w-5 h-5" />
      </Link>

      {/* Luxury Progress Bar */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-3">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className="group relative flex items-center justify-center w-5 h-5 focus:outline-none"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span 
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                activeSlide === i 
                  ? "bg-[#D4CAA3] scale-150 shadow-[0_0_10px_rgba(212,202,163,0.8)]" 
                  : "bg-[#D4CAA3]/20 group-hover:bg-[#D4CAA3]/50"
              }`}
            />
            <span className="absolute left-6 px-2 py-1 text-[9px] tracking-wider text-[#D4CAA3] bg-[#0A0A0A]/90 border border-[#D4CAA3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-sans whitespace-nowrap">
              Slide {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2">
        <button
          onClick={() => activeSlide > 0 && scrollToSlide(activeSlide - 1)}
          disabled={activeSlide === 0}
          className={`p-2 border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 ${activeSlide === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Previous slide"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => activeSlide < totalSlides - 1 && scrollToSlide(activeSlide + 1)}
          disabled={activeSlide === totalSlides - 1}
          className={`p-2 border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 ${activeSlide === totalSlides - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Next slide"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Static Slides */}
      <section data-slide-index={0} className="h-screen w-full snap-start snap-always"><Slide01 /></section>
      <section data-slide-index={1} className="h-screen w-full snap-start snap-always"><Slide02 /></section>
      <section data-slide-index={2} className="h-screen w-full snap-start snap-always"><Slide03 /></section>
      <section data-slide-index={3} className="h-screen w-full snap-start snap-always"><Slide04 /></section>
      <section data-slide-index={4} className="h-screen w-full snap-start snap-always"><Slide05 /></section>
      <section data-slide-index={5} className="h-screen w-full snap-start snap-always"><Slide06 /></section>
      <section data-slide-index={6} className="h-screen w-full snap-start snap-always"><Slide07 /></section>
      <section data-slide-index={7} className="h-screen w-full snap-start snap-always"><Slide08 /></section>
      <section data-slide-index={8} className="h-screen w-full snap-start snap-always"><Slide09 /></section>
      <section data-slide-index={9} className="h-screen w-full snap-start snap-always"><Slide10 /></section>
      <section data-slide-index={10} className="h-screen w-full snap-start snap-always"><Slide10B /></section>
      <section data-slide-index={11} className="h-screen w-full snap-start snap-always"><Slide11 /></section>

    </main>
  );
}
