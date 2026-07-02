import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Grid3X3, Maximize2, Type, AlignLeft, Cpu, ChevronRight, Check } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function Philosophy() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const customPills = [
    "Swiss Typographic Style",
    "Strategic UI/UX Layouts",
    "High-Performance Codebases",
    "Digital Creative Direction"
  ];

  const principles = [
    {
      id: 1,
      title: "Grid Discipline",
      category: "ALIGNMENT & STRUCTURE",
      subtitle: "SYSTEMATIC COLUMN SYSTEM",
      icon: Grid3X3,
      copy: "Rigid grid alignments organize layout components onto structural guidelines to ensure clean hierarchy and absolute clarity.",
      specCode: "GRID_SYS_12C",
      stats: {
        resolution: "12 Columns",
        margin: "80px Margin",
        gutter: "24px Gutter",
        utilization: "100% Locked"
      }
    },
    {
      id: 2,
      title: "Negative Space",
      category: "BALANCE & CONTRAST",
      subtitle: "GOLDEN RATIO PROPORTIONS",
      icon: Maximize2,
      copy: "Deliberate empty space serves as an active driver of focus, organizing complex information with composure and ease.",
      specCode: "SPACE_RATIO_1.618",
      stats: {
        voidRatio: "82.4% Area",
        focalWeight: "17.6% Focus",
        caliper: "Dynamic Spring",
        absorption: "High Eye-Ease"
      }
    },
    {
      id: 3,
      title: "Typographic Scale",
      category: "HIERARCHY & SIZE",
      subtitle: "INTELLIGENT FONT CONTRAST",
      icon: Type,
      copy: "Proportional body heights and weights define clear structural rhythm, guiding readers down the page effortlessly.",
      specCode: "TYPE_SCALE_PRO",
      stats: {
        scaleFactor: "1.618 Major",
        displayWeight: "900 Black",
        bodyWeight: "400 Normal",
        contrastIndex: "8.4x High"
      }
    },
    {
      id: 4,
      title: "Swiss Alignment",
      category: "AXIAL PLACEMENT",
      subtitle: "STRICT VERTICAL ANCHORS",
      icon: AlignLeft,
      copy: "Aligning typography cleanly flush-left creates crisp focal points, establishing immediate visual authority.",
      specCode: "AXIAL_ALIGN_X0",
      stats: {
        anchorPoints: "3 Key Anchors",
        driftMargin: "± 0.00px",
        readingVector: "F-Layout Path",
        discipline: "Absolute Flush"
      }
    }
  ];

  const activePrinciple = principles[activeIndex];

  return (
    <section 
      id="about" 
      className="bg-gradient-to-b from-white via-[#FAF9F6] to-white dark:from-[#08080a] dark:via-[#0c0c0e] dark:to-[#08080a] relative overflow-visible border-t border-border-light dark:border-neutral-900/60"
    >
      <ContainerScroll
        titleComponent={
          <div className="max-w-4xl mx-auto space-y-4 text-center px-6 select-none">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#0066ff] flex items-center justify-center gap-1.5 leading-none">
              <Compass className="w-4 h-4 text-[#0066ff] animate-spin-slow" />
              THE SPECIFICATION SHEETS
            </span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1d1d1f] dark:text-zinc-100 tracking-tighter leading-[1.08] mt-2">
              Clarity. Engineered with <br className="hidden sm:inline" /> mathematical discipline.
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-brand-slate dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              Moving past fleeting visual trends. Ruan's design style merges the rigid grid focus of Swiss typography with ultra-high-fidelity interactive technology.
            </p>
          </div>
        }
      >
        {/* INTERACTIVE SPECIFICATION LAB WORKSPACE (CAD-inspired OS mockup) */}
        <div className="w-full h-full bg-[#18181b] flex flex-col overflow-hidden text-neutral-200">
          
          {/* macOS Title Bar Header */}
          <div className="h-10 border-b border-neutral-800 bg-neutral-900/90 flex items-center justify-between px-4 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="h-6 px-4 bg-neutral-950/80 rounded-md border border-neutral-800/80 flex items-center justify-center text-xs font-mono tracking-tight text-neutral-300 w-1/2 sm:w-1/3">
              ruan.dev // specifications // {activePrinciple.specCode}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-[#0066ff] hidden sm:inline">LIVE_DIAGRAM</span>
            </div>
          </div>

          {/* Core Sidebar + Studio Canvas Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto md:overflow-hidden min-h-0">
            
            {/* VIEWPORT CANVAS (Columns 1-7) */}
            <div className="md:col-span-7 bg-[#0f0f11] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800 min-h-[300px] md:min-h-0 relative">
              
              {/* Grid calibration corner lines */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-neutral-800 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-neutral-800 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-neutral-800 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-neutral-800 pointer-events-none" />

              <div className="text-left select-none">
                <span className="font-mono text-xs text-[#0066ff] bg-[#0066ff]/10 px-3 py-1 rounded-full border border-[#0066ff]/25 font-bold">
                  MODEL // {activePrinciple.specCode}
                </span>
              </div>

              {/* Dynamic Schematic Graphic Area */}
              <div className="flex-1 flex items-center justify-center relative my-4 min-h-[140px] sm:min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePrinciple.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full flex items-center justify-center absolute inset-0"
                  >
                    {/* GRID DISCIPLINE */}
                    {activePrinciple.id === 1 && (
                      <div className="w-full max-w-[340px] px-4 space-y-4">
                        <div className="grid grid-cols-12 gap-1.5 w-full h-24 relative bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800/60">
                          {Array.from({ length: 12 }).map((_, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ delay: idx * 0.02, duration: 0.4 }}
                              className={`rounded-sm relative ${
                                idx === 2 || idx === 3 || idx === 7 || idx === 8
                                  ? "bg-[#0066ff]/25 border border-[#0066ff]/40"
                                  : "bg-neutral-800/40 border border-neutral-800/80"
                              }`}
                            >
                              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neutral-400 font-bold">
                                {idx + 1}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-left font-mono text-[10px] text-neutral-300 border-t border-neutral-800 pt-2">
                          <div>
                            <p className="text-[#0066ff] font-bold tracking-wider">GRID ANCHOR: ACTIVE_</p>
                            <p className="text-neutral-400">12 Column Matrix System</p>
                          </div>
                          <div className="text-right">
                            <p className="text-neutral-400">Gutter: 24px / Margins: 80px</p>
                            <p className="text-[#0066ff] font-bold">LOCKED 100%</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NEGATIVE SPACE */}
                    {activePrinciple.id === 2 && (
                      <div className="w-full max-w-[340px] px-4 space-y-3">
                        <div className="border border-neutral-800 bg-neutral-900/40 rounded-xl aspect-[16/9] p-4 relative flex items-center justify-center overflow-hidden">
                          {/* Radial schematic guide lines */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="10%" y1="50%" x2="44%" y2="50%" stroke="#0066ff" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
                            <line x1="50%" y1="10%" x2="50%" y2="44%" stroke="#0066ff" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
                            <line x1="56%" y1="50%" x2="90%" y2="50%" stroke="#0066ff" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
                            <line x1="50%" y1="56%" x2="50%" y2="90%" stroke="#0066ff" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
                          </svg>

                          <div className="relative">
                            <motion.div
                              animate={{ scale: [1, 1.25, 1] }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                              className="absolute -inset-3 rounded-full bg-[#0066ff]/15"
                            />
                            <div className="w-2.5 h-2.5 bg-[#0066ff] rounded-full relative z-10" />
                          </div>

                          <span className="absolute left-[12%] top-[54%] font-mono text-[9px] text-neutral-300 uppercase font-semibold">
                            VOID: 160PX
                          </span>
                          <span className="absolute right-[12%] top-[54%] font-mono text-[9px] text-neutral-300 uppercase font-semibold">
                            VOID: 160PX
                          </span>
                          <span className="absolute left-[53%] top-[15%] font-mono text-[9px] text-[#0066ff] uppercase font-bold tracking-wider">
                            FOCAL_PLANE_
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-left font-mono text-[10px] text-neutral-300">
                          <span className="text-[#0066ff] font-bold tracking-wider">GOLDEN_RATIO_CALCULATED</span>
                          <span className="text-neutral-400 font-semibold">82.4% DEVIATION VACANCY</span>
                        </div>
                      </div>
                    )}

                    {/* TYPOGRAPHIC SCALE */}
                    {activePrinciple.id === 3 && (
                      <div className="w-full max-w-[340px] px-4 space-y-3">
                        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 space-y-3 text-left">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] text-[#0066ff] font-bold">DISPLAY: 96PX</span>
                              <span className="font-mono text-[9px] text-neutral-300">W: 900 BLACK</span>
                            </div>
                            <h1 className="font-sans font-black text-2xl text-white tracking-tighter leading-none">
                              Display Aa
                            </h1>
                          </div>
                          <div className="border-t border-neutral-800 pt-2.5 space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] text-[#0066ff] font-bold">BODY: 14PX</span>
                              <span className="font-mono text-[9px] text-neutral-300">W: 400 REGULAR</span>
                            </div>
                            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                              High typographic contrast ensures clear structural reading speeds, making informational hierarchy instantly self-evident.
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-left font-mono text-[10px] text-neutral-300 font-semibold">
                          <span className="text-neutral-400">SCALE: 1.618 x RATIO</span>
                          <span className="text-[#0066ff] font-bold">CONTRAST FACTOR: HIGH (8.4x)</span>
                        </div>
                      </div>
                    )}

                    {/* SWISS ALIGNMENT */}
                    {activePrinciple.id === 4 && (
                      <div className="w-full max-w-[340px] px-4">
                        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 relative overflow-hidden text-left">
                          <motion.div
                            animate={{ opacity: [0.2, 0.7, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="absolute top-0 bottom-0 left-5 w-[1.5px] bg-[#0066ff] z-10"
                          />
                          <div className="pl-5 space-y-2.5">
                            <div>
                              <span className="font-mono text-[9px] text-[#0066ff] font-bold block mb-0.5 tracking-wider">SNAP X_ANCHOR = 0.00PX</span>
                              <h4 className="font-sans font-bold text-sm text-white leading-none">
                                Axial Flush Placement
                              </h4>
                            </div>
                            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                              By snapping type components flush-left, a clean vertical visual line is formed, enabling highly predictable reading routes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom live stats telemetry bar */}
              <div className="grid grid-cols-4 gap-2 border-t border-neutral-800/80 pt-3 text-left font-mono select-none">
                {Object.entries(activePrinciple.stats).map(([k, v]) => (
                  <div key={k} className="space-y-0.5 min-w-0">
                    <span className="text-[9px] uppercase text-neutral-400 tracking-wider font-bold block truncate">
                      {k.replace(/([A-Z])/g, "_$1")}
                    </span>
                    <span className="text-xs text-[#0066ff] font-bold block truncate">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* CONTROLS SIDEBAR PANEL (Columns 8-12) */}
            <div className="md:col-span-5 bg-[#141416] p-4 sm:p-5 flex flex-col justify-between min-h-[260px] md:min-h-0 select-none">
              
              <div className="space-y-3.5">
                <span className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-widest block px-1">
                  Blueprint Parameters
                </span>

                <div className="space-y-2.5">
                  {principles.map((pr, index) => {
                    const Icon = pr.icon;
                    const isCurrent = activeIndex === index;

                    return (
                      <button
                        key={pr.id}
                        onClick={() => setActiveIndex(index)}
                        className={`w-full group rounded-xl p-3 border text-left flex items-start gap-3 transition-all duration-300 cursor-pointer ${
                          isCurrent
                            ? "bg-neutral-900 border-[#0066ff]/40 shadow-md ring-1 ring-[#0066ff]/20"
                            : "bg-transparent border-transparent hover:bg-neutral-900/40 hover:border-neutral-800/50"
                        }`}
                      >
                        {/* Parameter icon */}
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isCurrent 
                              ? "bg-[#0066ff] text-white shadow-md shadow-[#0066ff]/25" 
                              : "bg-neutral-800 text-neutral-400 group-hover:text-white group-hover:bg-neutral-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Title block */}
                        <div className="space-y-0.5 font-sans min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-[#0066ff] tracking-wider truncate">
                              {pr.category}
                            </span>
                            <span className="font-mono text-[9px] text-neutral-400 shrink-0 font-medium">
                              {pr.specCode}
                            </span>
                          </div>
                          
                          <h4 className={`text-xs font-semibold tracking-tight transition-colors ${
                            isCurrent ? "text-white" : "text-neutral-300 group-hover:text-white"
                          }`}>
                            {pr.title}
                          </h4>

                          <p className="text-xs text-neutral-300 leading-normal font-normal line-clamp-1 pt-0.5">
                            {isCurrent ? pr.copy : pr.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specs disclaimer container */}
              <div className="bg-neutral-900 border border-neutral-800/60 rounded-xl p-3 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-[#0066ff]/10 border border-[#0066ff]/20 rounded-lg flex items-center justify-center text-[#0066ff] shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left font-sans min-w-0">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
                      ENGINEERING FOCUS
                    </p>
                    <p className="text-xs text-neutral-300 mt-0.5 truncate">
                      Rigid grid mathematics ruleset.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              </div>

            </div>

          </div>

        </div>
      </ContainerScroll>

      {/* Philosophy Spec Pills footer section */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 mt-8 md:mt-12 relative z-10 text-center">
        <div className="flex flex-wrap gap-2.5 justify-center">
          {customPills.map((pill, idx) => (
            <span
              key={idx}
              className="px-4.5 py-2 bg-white dark:bg-zinc-900/80 hover:bg-neutral-50 dark:hover:bg-zinc-800 border border-border-light dark:border-neutral-800 font-sans text-xs font-semibold text-brand-slate dark:text-zinc-300 rounded-full transition-all duration-300 cursor-default select-none shadow-xs"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
