import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import Strands from "./Strands";
import LiquidButton from "./LiquidButton";

interface HeroProps {
  onPortfolioView: () => void;
}

export default function Hero({ onPortfolioView }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-[95vh] lg:min-h-screen bg-gradient-to-b from-[#f5f5f7]/60 via-[#fafafa] to-white dark:from-[#0b0b0d]/60 dark:via-[#08080a] dark:to-[#08080a] pt-32 pb-16 px-6 md:px-12 flex flex-col justify-between items-center overflow-hidden transition-colors duration-300"
    >
      {/* Interactive WebGL Strands background shader (Apple Style) - Smaller & slower but with more vertical height */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80 select-none">
        <Strands
          colors={["#0066ff", "#4f46e5", "#0ea5e9", "#818cf8"]}
          count={4}
          speed={0.12}
          amplitude={1.3}
          waviness={0.7}
          thickness={0.6}
          glow={1.8}
          taper={2.5}
          spread={1.2}
          intensity={0.5}
          saturation={1.2}
          opacity={0.65}
          scale={1.6}
        />
      </div>

      {/* Main Hero Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto z-10 text-center space-y-10">
        
        {/* Crisp Header Title with Apple-style editorial typography */}
        <div className="max-w-5xl mx-auto space-y-4 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 45, damping: 14, mass: 1.2, delay: 0.1 }}
            className="font-sans font-extrabold tracking-tight md:tracking-tighter text-[#1d1d1f] dark:text-zinc-100 text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] leading-[1.02] max-w-5xl mx-auto"
          >
            Developing websites <br className="hidden md:inline" />
            people actually <span className="text-brand-blue italic font-medium">experience</span>.
          </motion.h1>
        </div>

        {/* Action button triggers with Liquid Wave fill animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 z-20 w-full"
        >
          <LiquidButton
            variant="blue"
            onClick={onPortfolioView}
            className="px-8 py-3.5 bg-neutral-900 text-white dark:bg-zinc-800 border border-white/20 shadow-lg text-xs font-bold uppercase tracking-wider"
          >
            <span>Explore Projects</span>
          </LiquidButton>

          <LiquidButton
            variant="blue"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 bg-white/60 dark:bg-white/10 text-brand-navy dark:text-zinc-100 border border-neutral-300 dark:border-white/10 shadow-md backdrop-blur-md text-xs font-bold uppercase tracking-wider"
          >
            Start Collaboration
          </LiquidButton>
        </motion.div>
      </div>

      {/* Down arrow indicator to keep user flowing to work */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none hidden sm:flex flex-col items-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-slate-400"
        >
          <ArrowDown className="w-5 h-5 text-slate-300" />
        </motion.div>
      </div>
    </section>
  );
}
