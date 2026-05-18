import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingFooter: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4CAA3]/5 blur-[120px] rounded-t-full pointer-events-none"></div>

      {/* Main CTA Block */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
        <div className="inline-block border border-[#D4CAA3]/30 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] font-sans text-[#D4CAA3] mb-6 uppercase font-light bg-[#D4CAA3]/5">FOUNDING COHORT NOW OPEN</div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F9F6EE] mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
          Secure Your Status as a Founding Member.
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans font-light max-w-2xl mx-auto mb-10">
          We are onboarding the first 20 elite exporters to define the new standard of Indian trade. Founding members receive lifetime fee protection and priority Agent Ekayan deployment. Public access waitlist begins Q4 2026.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F9F6EE] text-[#0A0A0A] hover:bg-white font-sans font-medium text-sm tracking-[0.1em] uppercase px-10 py-5 rounded-sm transition-all shadow-[0_0_20px_rgba(212,202,163,0.15)] hover:scale-[1.02]"
          >
            GET EARLY ACCESS ↗
          </button>
          <button className="text-[#F9F6EE] hover:text-[#D4CAA3] font-sans font-light text-sm tracking-wider uppercase border-b border-transparent hover:border-[#D4CAA3] transition-all pb-1">
            View Member Benefits
          </button>
        </div>
      </div>

      {/* Standard Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Branding */}
        <div className="flex items-center gap-8">
          <div className="font-serif text-xl font-bold tracking-tight text-[#F9F6EE]">
            HINDTRADE AI
          </div>
          <div className="hidden md:flex gap-6 text-xs font-sans text-zinc-500 font-light tracking-wider">
            <a href="#engine" className="hover:text-white transition-colors">Engine</a>
            <a href="#network" className="hover:text-white transition-colors">Network</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            <a href="#beta" className="hover:text-[#D4CAA3] transition-colors">Beta Program</a>
          </div>
        </div>

        {/* Right: Copyright & Socials */}
        <div className="flex items-center gap-6 text-xs font-sans text-zinc-600">
          <span>© 2026 HindTrade AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">X (Twitter)</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[15px] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#000000] border border-[#DEFF9A]/20 p-8 md:p-10 max-w-lg w-full relative shadow-[0_0_50px_rgba(222,255,154,0.05)]"
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSubmitted(false);
                }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl md:text-3xl font-serif text-[#F9F6EE] mb-2 tracking-tight">
                    Secure Your Status as a Founding Member
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 font-sans tracking-wide mb-8">
                    Join the elite 20 exporters defining the new standard of Indian Trade.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      setTimeout(() => {
                        setIsSubmitting(false);
                        setIsSubmitted(true);
                      }, 2000);
                    }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col">
                      <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Organization / MSME Name</label>
                      <input
                        type="text"
                        required
                        className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Professional Email</label>
                      <input
                        type="email"
                        required
                        className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Primary Export Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Sports Goods, Textiles"
                        className="bg-transparent border-b border-zinc-800 text-[#F9F6EE] font-sans text-sm pb-2 outline-none focus:border-[#DEFF9A] transition-colors placeholder-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#DEFF9A] text-[#000000] font-sans font-bold text-xs tracking-[0.2em] uppercase py-4 mt-4 shadow-[0_0_20px_rgba(222,255,154,0.3)] hover:shadow-[0_0_30px_rgba(222,255,154,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "PROCESSING" : "RESERVE MY SPOT"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center text-center space-y-6">
                  <div className="w-12 h-12 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A]">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-[#F9F6EE] tracking-tight">Application Received</h3>
                    <p className="text-xs md:text-sm text-zinc-400 font-sans tracking-wide max-w-xs mx-auto leading-relaxed">
                      Our compliance team is auditing your export credentials. A founding cohort invite will be sent to your email within 24 hours.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5 w-full">
                    <div className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#DEFF9A] uppercase">
                      COHORT SLOT SECURED
                    </div>
                    <div className="text-[9px] font-sans tracking-[0.2em] text-zinc-500 uppercase mt-1">
                      Priority Queue Assigned
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
