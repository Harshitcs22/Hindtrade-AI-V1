"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  // Read redirect param from URL manually (avoids useSearchParams/Suspense issues)
  const getRedirect = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error("Authentication failed.");

      // Set the Edge session cookie on the client side to unlock private route gateways on App Router
      if (data.session) {
        document.cookie = "hindtrade_auth_token=" + data.session.access_token + "; path=/; max-age=86400; SameSite=Lax" + (window.location.protocol === "https:" ? "; Secure" : "");
      }

      // Check if proxy gave us a redirect target
      const redirectTo = getRedirect();
      if (redirectTo && redirectTo.startsWith("/dashboard/")) {
        router.push(redirectTo);
        return;
      }

      // Find this user's firm by user_id
      const { data: firms, error: firmError } = await supabase
        .from("firms")
        .select("slug")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: true })
        .limit(1);

      if (firmError) throw firmError;

      if (firms && firms.length > 0) {
        router.push(`/dashboard/${firms[0].slug}`);
      } else {
        // No firm yet — go to signup firm step
        router.push("/auth/signup");
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("Email not confirmed")) {
        setError(
          "Email not confirmed. Check your inbox and click the confirmation link, then try again. Or disable email confirmation in Supabase Dashboard → Auth → Email."
        );
      } else {
        setError(msg || "Sign in failed. Please try again.");
      }
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

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0D0D0D] border border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(212,202,163,0.06)]">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4CAA3]/50 to-transparent" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-serif text-[#F9F6EE] tracking-tight">Welcome Back</h1>
              <p className="text-[9px] font-mono tracking-[0.25em] text-[#D4CAA3] uppercase mt-1">Sovereign Access Portal</p>
            </div>
            <p className="text-xs text-zinc-500 font-light mt-3 mb-8 leading-relaxed">
              Sign in to access your firm&apos;s dashboard and Agent Ekayan. New here?{" "}
              <Link href="/auth/signup" className="text-[#D4CAA3] hover:text-white transition-colors">
                Create an account
              </Link>
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 mb-6 font-mono leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourfirm.com"
                  required
                  autoComplete="email"
                  className="bg-[#111111] border border-white/10 text-[#F9F6EE] font-sans text-sm px-4 py-3 outline-none focus:border-[#D4CAA3]/50 transition-colors placeholder:text-zinc-700"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
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
                  <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                ) : (
                  <>Access Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6 font-mono">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#D4CAA3] hover:text-white transition-colors">
            Register your firm →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
