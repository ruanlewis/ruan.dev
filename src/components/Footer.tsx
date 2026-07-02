import { ArrowUp } from "lucide-react";
import { MouseEvent } from "react";

interface FooterProps {
  onAdminClick: () => void;
  onPrivacyClick: () => void;
}

export default function Footer({ onAdminClick, onPrivacyClick }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConsoleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.ctrlKey || e.metaKey) {
      onAdminClick();
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-[#08080a] border-t border-slate-100 dark:border-neutral-900/60 py-12 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand signature logo */}
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-xl text-brand-navy dark:text-zinc-100 tracking-tighter cursor-pointer" onClick={handleScrollToTop}>
            ruan.dev
          </span>
          <span className="font-mono text-[9px] text-[#94a3b8] dark:text-zinc-500 font-semibold bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-neutral-800/80 px-2 py-0.5 rounded-full uppercase">
            v1.0
          </span>
        </div>

        {/* Footer link directories */}
        <div className="flex gap-6 flex-wrap justify-center font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400">
          <a href="mailto:lewisruan4@gmail.com" className="hover:text-brand-blue transition-colors font-bold uppercase text-[10px]">
            Email
          </a>
          <a href="https://wa.me/27645851770" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">
            WhatsApp
          </a>
          <a href="https://instagram.com/builtbyruan" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">
            Instagram
          </a>
          <a href="https://www.facebook.com/profile.php?id=61591404452937" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">
            Facebook
          </a>
          <a href="https://github.com/ruanlewis" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">
            GitHub
          </a>
          <button
            onClick={onPrivacyClick}
            className="hover:text-brand-blue transition-colors uppercase font-bold text-[10px] cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={handleConsoleClick}
            className="hover:text-brand-blue transition-colors uppercase font-bold text-[10px] cursor-pointer"
          >
            Console
          </button>
        </div>

        {/* Copyright claims */}
        <div className="flex items-center gap-4">
          <p className="font-sans text-[11px] text-[#94a3b8] dark:text-zinc-500 font-medium">
            &copy; 2026 ruan.dev. All rights reserved.
          </p>

          <button
            onClick={handleScrollToTop}
            className="p-2.5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-brand-navy dark:text-zinc-100 rounded-full transition-colors border border-slate-100 dark:border-neutral-800/80"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
