"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Quote, Globe, User } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    partner: "Nordic Sports Importers",
    location: "Oslo, Norway",
    type: "Global Procurement Partner",
    rating: 5,
    text: "HindTrade has redefined our supply chain transparency. Their real-time verification vault provided the trust we needed to scale our inventory orders by 40%.",
    date: "March 2026",
    avatar: "NS",
    verified: true
  },
  {
    id: 2,
    partner: "Elite Athlete Gear",
    location: "California, USA",
    type: "Direct Importer",
    rating: 5,
    text: "The institutional-grade manufacturing philosophy is evident in every batch. Quality consistency is at par with top-tier German manufacturers.",
    date: "February 2026",
    avatar: "EA",
    verified: true
  },
  {
    id: 3,
    partner: "Zalando Logistics Hub",
    location: "Berlin, Germany",
    type: "Logistics Auditor",
    rating: 4.8,
    text: "Audit-ready documentation and seamless HSN integration. Their digital trade card made our customs clearance 3x faster than traditional exporters.",
    date: "January 2026",
    avatar: "ZH",
    verified: true
  },
  {
    id: 4,
    partner: "Olympic Heritage Committee",
    location: "Lausanne, Switzerland",
    type: "Institutional Buyer",
    rating: 5,
    text: "Exceptional craftsmanship balanced with sovereign industrial precision. A reliable partner for long-term strategic procurement.",
    date: "December 2025",
    avatar: "OH",
    verified: true
  }
];

export function PartnerReviews() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4CAA3]/[0.02] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#22D3EE]/[0.01] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono tracking-[0.4em] text-[#D4CAA3] uppercase mb-4"
          >
            Institutional Sentiment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-[#F9F6EE] tracking-tight mb-6"
          >
            Partner Testimonials
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative bg-[#0A0A0A] border border-white/[0.06] p-8 hover:border-[#D4CAA3]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col transform-gpu"
            >
              {/* Floating Quote Icon */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#0F0F0F] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Quote className="w-4 h-4 text-[#D4CAA3]/40" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(review.rating) ? 'text-[#D4CAA3] fill-[#D4CAA3]' : 'text-zinc-800'}`} 
                  />
                ))}
              </div>

              <p className="text-sm font-light text-zinc-400 leading-relaxed italic mb-10 flex-grow">
                "{review.text}"
              </p>

              <div className="pt-6 border-t border-white/[0.04] mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-mono text-[#D4CAA3] group-hover:border-[#D4CAA3]/50 transition-colors">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#F9F6EE]">{review.partner}</h4>
                      {review.verified && <ShieldCheck className="w-3 h-3 text-[#22D3EE]" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="w-2.5 h-2.5 text-zinc-600" />
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{review.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">{review.type}</span>
                  <span className="text-[8px] font-mono text-zinc-800 uppercase">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Aggregate Stat */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 pt-12 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-700" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-[#D4CAA3] flex items-center justify-center text-black text-[10px] font-bold">
                +42
              </div>
            </div>
            <div>
              <p className="text-xs font-serif text-[#F9F6EE] font-semibold">4.9/5 Average Partner Rating</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Based on 124 Verified Procurements</p>
            </div>
          </div>
          
          <button className="px-8 py-3 border border-white/10 hover:border-[#D4CAA3]/40 text-[10px] font-mono text-zinc-400 hover:text-[#D4CAA3] uppercase tracking-[0.2em] transition-all">
            View All Institutional Audits
          </button>
        </motion.div>
      </div>
    </section>
  );
}
