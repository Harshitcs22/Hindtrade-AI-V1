"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, Building2, User, Mail, Lock, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = "credentials" | "firm" | "success";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");

  // Step 1: credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: firm
  const [firmName, setFirmName] = useState("");
  const [exportCategory, setExportCategory] = useState("");
  const [location, setLocation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState("");
  // Store the user id from step 1 so step 2 doesn't need to re-fetch the session
  // (which fails when Supabase email confirmation is pending)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const generatedSlug = firmName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // ── Step 1: Create Auth User ────────────────────────────────────────────────
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Account creation failed. Please try again.");

      // Store the user ID immediately from the signUp response.
      // We cannot call getUser() in step 2 if email confirmation is required
      // because the session won't be active until the email is confirmed.
      setPendingUserId(data.user.id);
      setStep("firm");
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Create Firm Row ─────────────────────────────────────────────────
  const handleFirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !firmName.trim()) return;
    setError(null);
    setIsLoading(true);

    try {
      const slug = generatedSlug;

      // Use the userId stored from step 1 response.
      // Do NOT call supabase.auth.getUser() here — the session is not active
      // until the user confirms their email, which causes "Session expired" error.
      const { data: firm, error: firmError } = await supabase
        .from("firms")
        .insert([{
          slug,
          name: firmName.trim(),
          location: location.trim() || null,
          deals_in: exportCategory.trim() || null,
          trust_score: 0,
          established: new Date().getFullYear(),
          // Attach user_id from the signUp response (step 1)
          // This may be null if the insert is done before email confirmation —
          // that's fine; the user can still access their dashboard via the slug.
          user_id: pendingUserId ?? null,
        }])
        .select()
        .single();

      if (firmError) {
        if (firmError.code === "23505") {
          throw new Error("This firm name already exists. Please choose a different name.");
        }
        // Surface the actual Supabase error for easier debugging
        throw new Error(firmError.message || "Database error — please try again.");
      }

      setCreatedSlug(slug);
      setStep("success");

      setTimeout(() => {
        router.push(`/dashboard/${slug}`);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to create firm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 font-sans">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4CAA3]/5 blur-[120px] rounded-full" />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <img
          src="/images/LOGO.png"
          alt="HindTrade"
          className="h-7 w-7 invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5] object-contain"
        />
        <span className="font-sans text-lg font-extralight tracking-[0.18em] text-[#F9F6EE]/80 group-hover:text-[#D4CAA3] transition-colors">
          HINDTRADE AI
        </span>
      </Link>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        {(["credentials", "firm", "success"] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300
                ${step === s ? "bg-[#D4CAA3] text-[#0A0A0A]" : 
                  (["credentials", "firm", "success"].indexOf(step) > i) ? "bg-[#D4CAA3]/20 border border-[#D4CAA3]/50 text-[#D4CAA3]" :
                  "bg-white/5 border border-white/10 text-zinc-600"}`}>
                {(["credentials", "firm", "success"].indexOf(step) > i) ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] font-mono tracking-widest uppercase hidden sm:block transition-colors
                ${step === s ? "text-[#D4CAA3]" : "text-zinc-600"}`}>
                {s === "credentials" ? "Account" : s === "firm" ? "Firm" : "Done"}
              </span>
            </div>
            {i < 2 && <div className={`w-8 h-px transition-all duration-300 ${(["credentials", "firm", "success"].indexOf(step) > i) ? "bg-[#D4CAA3]/40" : "bg-white/10"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        layout
      >
        <div className="bg-[#0D0D0D] border border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(212,202,163,0.06)]">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent" />

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: CREDENTIALS ── */}
              {step === "credentials" && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#D4CAA3]/10 border border-[#D4CAA3]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#D4CAA3]" />
                    </div>
                    <div>
                      <h1 className="text-xl font-serif text-[#F9F6EE] tracking-tight">Create Account</h1>
                      <p className="text-[9px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase">Sovereign Identity Protocol</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 font-light mt-3 mb-7 leading-relaxed">
                    Initialize your identity on the HindTrade network. Already registered?{" "}
                    <Link href="/auth/login" className="text-[#D4CAA3] hover:text-white transition-colors">Sign in</Link>
                  </p>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-5 font-mono">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleCredentials} className="space-y-5">
                    {/* Full Name */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Harshit Singh"
                        required
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Professional Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@yourfirm.com"
                        required
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          required
                          minLength={8}
                          className="w-full bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 pr-11 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#D4CAA3] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#D4CAA3] text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed group mt-2"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Identity...</>
                      ) : (
                        <>Continue to Firm Setup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 2: FIRM SETUP ── */}
              {step === "firm" && (
                <motion.div
                  key="firm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-[#D4CAA3]/10 border border-[#D4CAA3]/20 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#D4CAA3]" />
                    </div>
                    <div>
                      <h1 className="text-xl font-serif text-[#F9F6EE] tracking-tight">Register Your Firm</h1>
                      <p className="text-[9px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase">Sovereign Terminal Initialization</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 font-light mt-3 mb-7 leading-relaxed">
                    Your unique dashboard will be deployed at{" "}
                    <span className="text-[#D4CAA3] font-mono">/dashboard/{generatedSlug || "your-firm"}</span>
                  </p>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-5 font-mono">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleFirmSetup} className="space-y-5">
                    {/* Firm Name */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Firm / Organization Name
                      </label>
                      <input
                        type="text"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        placeholder="e.g., Akshays Exports"
                        required
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                      {firmName.trim() && (
                        <div className="mt-1.5 text-[10px] font-mono text-zinc-600">
                          SLUG: <span className="text-[#D4CAA3]">{generatedSlug}</span>
                        </div>
                      )}
                    </div>

                    {/* Export Category */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Primary Export Category
                      </label>
                      <input
                        type="text"
                        value={exportCategory}
                        onChange={(e) => setExportCategory(e.target.value)}
                        placeholder="e.g., Sports Goods, Textiles, Leather"
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Jalandhar, IN"
                        className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !firmName.trim()}
                      className="w-full bg-[#D4CAA3] text-[#0A0A0A] font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed group mt-2"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Deploying Sovereign Terminal...</>
                      ) : (
                        <>Deploy Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 3: SUCCESS ── */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="py-10 flex flex-col items-center text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#D4CAA3]" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-[#F9F6EE]">Sovereign Terminal Deployed</h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Account created &amp; firm registered in the HindTrade registry
                    </p>
                  </div>

                  <div className="bg-[#111111] border border-[#D4CAA3]/20 px-6 py-4 w-full text-left">
                    <div className="text-[9px] text-zinc-600 font-mono tracking-widest mb-1">YOUR DASHBOARD</div>
                    <div className="text-[#D4CAA3] font-mono text-sm">/dashboard/{createdSlug}</div>
                  </div>

                  <div className="text-[10px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase animate-pulse">
                    Initializing Agent Ekayan...
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Sign in link */}
        {step === "credentials" && (
          <p className="text-center text-xs text-zinc-600 mt-6 font-mono">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#D4CAA3] hover:text-white transition-colors">
              Sign in →
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
