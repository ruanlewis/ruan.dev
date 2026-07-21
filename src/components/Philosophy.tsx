import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sliders, Type, Database, Check, Layers, RefreshCw } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

interface ScaleStep {
  id: string;
  className: string;
  label: string;
  px: string;
  multiplier: string;
  useCase: string;
  contrast: string;
  tracking: string;
  lineHeight: string;
  description: string;
  sampleQuote: string;
}

export default function Philosophy() {
  const [activeIndex, setActiveIndex] = useState<number>(4); // Default to 's5' (Title 63px) as active, matching the user mockup
  const [customText, setCustomText] = useState<string>("");
  const [useSerif, setUseSerif] = useState<boolean>(true);
  const [showSpecs, setShowSpecs] = useState<boolean>(false);

  const customPills = [
    "Swiss Typographic Style",
    "Strategic UI/UX Layouts",
    "High-Performance Codebases",
    "Digital Creative Direction"
  ];

  const SCALE_STEPS: ScaleStep[] = [
    {
      id: "s1",
      className: "s1",
      label: "Small print",
      px: "12px",
      multiplier: "1.00x",
      useCase: "System captions & metadata",
      contrast: "4.5:1",
      tracking: "+0.04em",
      lineHeight: "16px",
      description: "Optimized for extreme utility and dense data density under challenging layouts.",
      sampleQuote: "Design systems bridge the gap between creative chaos and engineered order."
    },
    {
      id: "s2",
      className: "s2",
      label: "Body text",
      px: "16px",
      multiplier: "1.33x",
      useCase: "Long-form editorial descriptions",
      contrast: "7.0:1",
      tracking: "-0.01em",
      lineHeight: "24px",
      description: "Engineered with spacious negative space for balanced column alignment and extreme legibility.",
      sampleQuote: "Order is not pressure, it is visual peace. Every element has its precise coordinate."
    },
    {
      id: "s3",
      className: "s3",
      label: "Subheading",
      px: "24px",
      multiplier: "2.00x",
      useCase: "Section headers & structural anchors",
      contrast: "11.2:1",
      tracking: "-0.02em",
      lineHeight: "32px",
      description: "Generates strict structural visual pathways, introducing key layout partitions.",
      sampleQuote: "Form follows function, but aesthetic precision is a crucial function itself."
    },
    {
      id: "s4",
      className: "s4",
      label: "Heading",
      px: "39px",
      multiplier: "3.25x",
      useCase: "Layout showcases & callouts",
      contrast: "14.5:1",
      tracking: "-0.03em",
      lineHeight: "48px",
      description: "Combines powerful mathematical scale with tight kerning for premium visual authority.",
      sampleQuote: "Consistency is the absolute core of typographic credibility."
    },
    {
      id: "s5",
      className: "s5",
      label: "Title",
      px: "63px",
      multiplier: "5.25x",
      useCase: "Hero displays & brand headlines",
      contrast: "18.0:1",
      tracking: "-0.04em",
      lineHeight: "72px",
      description: "A bold, monumental visual statement. Balanced weight proportion designed to command focus.",
      sampleQuote: "Structure creates absolute confidence."
    }
  ];

  const activeStep = SCALE_STEPS[activeIndex];

  const handleResetCustomText = () => {
    setCustomText("");
  };

  return (
    <section 
      id="about" 
      className="bg-gradient-to-b from-white via-[#FAF9F6] to-white dark:from-[#08080a] dark:via-[#0c0c0e] dark:to-[#08080a] relative overflow-visible border-t border-border-light dark:border-neutral-900/60 py-24 sm:py-36 transition-all duration-500"
    >
      <div className="max-w-4xl mx-auto space-y-8 text-center px-6 select-none pb-12">
        <div className="inline-flex items-center justify-center gap-2 font-mono text-[11px] font-medium tracking-[0.12em] text-[#0066ff] dark:text-[#5b4bd6] uppercase">
          <svg className="w-3.5 h-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" />
          </svg>
          The specification sheets
        </div>
        
        <h2 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl text-neutral-900 dark:text-zinc-100 tracking-tighter leading-[1.08] mt-2">
          Clarity. Engineered with <br className="hidden sm:inline" /> mathematical discipline.
        </h2>
        
        <p className="font-sans text-sm sm:text-base md:text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
          Moving past fleeting visual trends. Ruan's design style pairs a{" "}
          <b className="text-neutral-900 dark:text-white font-semibold">strict, orderly grid</b> with{" "}
          <b className="text-neutral-900 dark:text-white font-semibold">polished, precise</b> interactive work.
        </p>

        {/* Spacious, premium button to reveal the lab */}
        <div className="pt-4">
          <button
            onClick={() => setShowSpecs((prev) => !prev)}
            className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-zinc-200/50 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-300 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/[0.08] text-zinc-800 dark:text-zinc-200 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] active:scale-98 cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${showSpecs ? "bg-red-500 animate-pulse" : "bg-[#0066ff]"} transition-colors duration-300`} />
            <span>{showSpecs ? "Close Specification Sheets" : "Open Specification Sheets"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showSpecs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ContainerScroll
              titleComponent={null}
            >
              {/* INTERACTIVE SPECIFICATION LAB WORKSPACE (Refined Dark CAD Layout) */}
              <div className="w-full h-full bg-[#0e0f11] flex flex-col overflow-hidden text-[#f4f3ef]">
                
                {/* macOS Style Header Nav */}
                <div className="h-12 border-b border-white/10 bg-black/40 flex items-center justify-between px-5 shrink-0 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  
                  <div className="h-7 px-4 bg-black/60 rounded-md border border-white/5 flex items-center justify-center text-[11px] font-mono tracking-tight text-[#8c8d92] w-1/2 sm:w-1/3">
                    ruan.dev // specifications // font_scale_system
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#6de08a] animate-pulse" />
                    <span className="text-[10px] tracking-wider text-[#6de08a] uppercase hidden sm:inline font-bold">MEASURING_LIVE</span>
                  </div>
                </div>

                {/* Split Interactive Blueprint Columns */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden min-h-0">
                  
                  {/* LEFT COLUMN: THE SIZES GRID (6/12) */}
                  <div className="lg:col-span-7 bg-black/20 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between mb-6 select-none">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-[#8c8d92] uppercase tracking-widest block font-bold">THE SIZES //</span>
                          <span className="text-xs text-white/90 font-semibold block">Typographic Scale Index</span>
                        </div>
                        <span className="font-mono text-[9px] bg-[#0066ff]/10 text-[#5b4bd6] dark:text-[#a89bf0] px-2.5 py-1 rounded border border-[#0066ff]/20 font-bold uppercase tracking-wider">
                          Ratio // 1.618 Major
                        </span>
                      </div>

                      {/* Sizer Scale rows */}
                      <div className="space-y-2.5">
                        {SCALE_STEPS.map((step, idx) => {
                          const isActive = activeIndex === idx;
                          return (
                            <button
                              key={step.id}
                              onClick={() => setActiveIndex(idx)}
                              className={`w-full group relative rounded-xl p-4 text-left flex items-center justify-between border transition-all duration-300 cursor-pointer ${
                                isActive
                                  ? "bg-[#0066ff]/8 border-[#0066ff]/40 shadow-[0_4px_20px_rgba(36,81,255,0.12)]"
                                  : "bg-transparent border-white/5 hover:bg-white/[0.02] hover:border-white/10"
                              }`}
                            >
                              {/* Interactive glow accent on active line */}
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2451ff] rounded-l-xl" />
                              )}

                              <div className="flex items-center gap-6 min-w-0">
                                {/* Display Lettering Box - Rendered dynamically with strict mathematical sizing! */}
                                <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors select-none">
                                  <span 
                                    className="font-serif font-semibold text-white tracking-tight"
                                    style={{ 
                                      fontSize: step.id === 's1' ? '12px' : step.id === 's2' ? '16px' : step.id === 's3' ? '22px' : step.id === 's4' ? '30px' : '44px',
                                      lineHeight: 1
                                    }}
                                  >
                                    Aa
                                  </span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="font-mono text-[9px] text-[#8c8d92] uppercase tracking-wider block font-bold">
                                    {step.id === 's1' ? 'SMALL' : step.id === 's2' ? 'BODY' : step.id === 's3' ? 'SUBHEAD' : step.id === 's4' ? 'HEAD' : 'HERO_TITLE'}
                                  </span>
                                  <span className={`text-[14px] font-semibold transition-colors block ${
                                    isActive ? "text-[#8fa8ff]" : "text-white/80 group-hover:text-white"
                                  }`}>
                                    {step.label}
                                  </span>

                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-mono text-[11px] text-[#8c8d92] uppercase tracking-wide">
                                  {step.px}
                                </span>
                                
                                {/* Arrow or Check mark indicator */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                  isActive 
                                    ? "bg-[#2451ff] border-[#2451ff] text-white" 
                                    : "border-white/10 text-transparent group-hover:border-white/30 group-hover:text-white/40"
                                }`}>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Specs Statement block */}
                    <div className="border-t border-white/10 pt-5 mt-6 flex flex-col sm:flex-row justify-between gap-3 text-left font-mono text-[11px] text-[#8c8d92] select-none">
                      <div>
                        <span className="text-white/80 font-bold block mb-0.5 uppercase tracking-wider">Visual Mathematics ruleset</span>
                        <span>Every step is calculated proportionally to establish clear typographic pacing.</span>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: ACTIVE SCALE SPECS & LIVE PREVIEW (5/12) */}
                  <div className="lg:col-span-5 bg-black/40 p-6 sm:p-8 flex flex-col justify-between min-h-0 overflow-y-auto">
                    
                    <div className="space-y-6">
                      
                      {/* Active Parameters Heading */}
                      <div className="flex items-center justify-between select-none border-b border-white/10 pb-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] text-[#8c8d92] uppercase tracking-widest block font-bold">ACTIVE PARAMETERS //</span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{activeStep.label}</h3>
                        </div>
                        
                        {/* Font pairing toggle */}
                        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                          <button 
                            onClick={() => setUseSerif(true)}
                            className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded font-bold transition-all cursor-pointer ${
                              useSerif ? "bg-white/10 text-white" : "text-[#8c8d92] hover:text-white"
                            }`}
                          >
                            Serif
                          </button>
                          <button 
                            onClick={() => setUseSerif(false)}
                            className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded font-bold transition-all cursor-pointer ${
                              !useSerif ? "bg-white/10 text-white" : "text-[#8c8d92] hover:text-white"
                            }`}
                          >
                            Sans
                          </button>
                        </div>
                      </div>

                      {/* DYNAMIC LIVE PREVIEW DISPLAY BOX */}
                      <div className="bg-black/60 rounded-xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[160px] group">
                        <div className="flex justify-between items-center mb-3 select-none">
                          <span className="font-mono text-[9px] text-[#2451ff] font-bold tracking-widest uppercase">
                            PREVIEW AREA // SIZE_TEST_LIVE
                          </span>
                          <span className="font-mono text-[9px] text-[#8c8d92] uppercase font-bold">
                            {activeStep.px} @ {activeStep.lineHeight}
                          </span>
                        </div>

                        {/* Real-time Dynamic Text Render */}
                        <div className="flex-1 flex items-center justify-start py-2">
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={activeStep.id + "_" + useSerif + "_" + (customText !== "")}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.25 }}
                              className={`text-left tracking-tight text-white transition-all break-words w-full ${
                                useSerif ? "font-serif font-medium" : "font-sans font-medium"
                              }`}
                              style={{
                                fontSize: activeStep.px,
                                lineHeight: activeStep.lineHeight,
                                letterSpacing: activeStep.tracking
                              }}
                            >
                              {customText.trim() !== "" ? customText : activeStep.sampleQuote}
                            </motion.p>
                          </AnimatePresence>
                        </div>

                        {/* Active Indicator details */}
                        <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2.5 select-none">
                          <span className="font-mono text-[9px] text-[#8c8d92]">
                            Usage: <span className="text-white/80">{activeStep.useCase}</span>
                          </span>
                        </div>
                      </div>

                      {/* INTERACTIVE CUSTOM TYPE TESTING BLOCK */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-mono text-[9px] text-[#8c8d92] uppercase tracking-widest block font-bold select-none">
                            Type Custom Spec Word
                          </label>
                          {customText && (
                            <button 
                              onClick={handleResetCustomText}
                              className="text-[9px] font-mono text-[#8c8d92] hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-2.5 h-2.5" /> Clear
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type custom text to preview layout..."
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            maxLength={80}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#2451ff] focus:ring-1 focus:ring-[#2451ff]/30 transition-all font-sans"
                          />
                        </div>
                      </div>

                      {/* THE CAPTION BLOCK */}
                      <div className="space-y-1.5 text-left border-t border-white/10 pt-5 select-none">
                        <div className="font-sans text-xs font-semibold text-white">Every size follows one rule</div>
                        <p className="text-[11.5px] text-[#8c8d92] leading-relaxed">
                          {activeStep.description} This mathematical discipline aligns columns to strict visual rhythm guidelines perfectly.
                        </p>
                      </div>

                    </div>

                    {/* THE STATS GRID - matching user mockup */}
                    <div className="grid grid-cols-4 gap-0.5 bg-white/10 rounded-xl overflow-hidden mt-6 border border-white/10 select-none shrink-0 font-mono">
                      <div className="bg-black/60 p-3.5 text-left">
                        <div className="text-[9px] uppercase tracking-wider text-[#8c8d92] mb-1.5 font-bold">Sizes</div>
                        <div className="text-xs font-semibold text-[#2451ff]">5 Step</div>
                      </div>
                      <div className="bg-black/60 p-3.5 text-left">
                        <div className="text-[9px] uppercase tracking-wider text-[#8c8d92] mb-1.5 font-bold">Multiplier</div>
                        <div className="text-xs font-semibold text-[#2451ff]">{activeStep.multiplier}</div>
                      </div>
                      <div className="bg-black/60 p-3.5 text-left">
                        <div className="text-[9px] uppercase tracking-wider text-[#8c8d92] mb-1.5 font-bold">Contrast</div>
                        <div className="text-xs font-semibold text-[#2451ff]">{activeStep.contrast}</div>
                      </div>
                      <div className="bg-black/60 p-3.5 text-left">
                        <div className="text-[9px] uppercase tracking-wider text-[#8c8d92] mb-1.5 font-bold">Line Ht</div>
                        <div className="text-xs font-semibold text-[#2451ff]">{activeStep.lineHeight}</div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </ContainerScroll>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swiss spec badges footer container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-8 mt-12 md:mt-20 relative z-10 text-center">
        <div className="flex flex-wrap gap-2.5 justify-center">
          {customPills.map((pill, idx) => (
            <span
              key={idx}
              className="px-4.5 py-2 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/[0.08] border border-white/40 dark:border-white/10 font-sans text-xs font-semibold text-brand-slate dark:text-zinc-300 rounded-full transition-all duration-300 cursor-default select-none shadow-[0_8px_32px_rgba(0,0,0,0.03)]"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

