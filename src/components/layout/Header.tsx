import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className="border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <img
            src="/images/LOGO.png"
            alt="Konark Chakra"
            className="h-8 w-8 invert brightness-[1.5] contrast-[1.2] sepia-[0.8] hue-rotate-[-10deg] saturate-[1.5] object-contain"
          />
          <div className="font-sans text-xl font-extralight tracking-[0.18em] text-[#F9F6EE]/90">
            HINDTRADE AI
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium text-slate-400">
          <a href="#engine" className="hover:text-[#D4CAA3] transition-colors">Engine</a>
          <a href="#network" className="hover:text-[#D4CAA3] transition-colors">Network</a>
          <Link href="/audit-vault" className="hover:text-[#D4CAA3] transition-colors font-semibold text-[#D4CAA3]">Audit Vault</Link>
          <a href="#docs" className="hover:text-[#D4CAA3] transition-colors">Docs</a>
          <Link href="/pitch" className="border border-white/10 hover:border-[#D4CAA3] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-slate-300 hover:text-[#D4CAA3] bg-transparent transition-all duration-300 uppercase">
            Institutional Pitch
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden md:block text-xs font-mono tracking-widest text-zinc-500 hover:text-[#D4CAA3] transition-colors uppercase"
          >
            Sign In
          </Link>
          <Button
            onClick={() => router.push('/auth/signup')}
            className="bg-[#D4CAA3] text-[#0A0A0A] hover:bg-[#c5b992] font-semibold rounded-none px-6 h-11 text-sm transition-all hover:scale-[1.02]"
          >
            Deploy Agent
          </Button>
        </div>
      </div>
    </header>
  );
};
