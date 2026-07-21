import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sliders, Check, LayoutGrid, 
  RotateCw, Terminal, Eye, Heart, Code, Smartphone, 
  Layers, Volume2, VolumeX, Shield, RefreshCcw, HelpCircle,
  ShoppingCart
} from "lucide-react";

interface ProjectVisualizerProps {
  projectId: string;
  isExpanded?: boolean;
  fallbackImage?: string;
  fallbackAlt?: string;
}

export default function ProjectVisualizer({ 
  projectId, 
  isExpanded = false, 
  fallbackImage, 
  fallbackAlt 
}: ProjectVisualizerProps) {
  
  // ==========================================
  // PROJECT 1: THE NEW YORK EDIT (Editorial/Fashion)
  // ==========================================
  const [nyColorway, setNyColorway] = useState<"cream" | "charcoal" | "indigo">("cream");
  const [nyFontSize, setNyFontSize] = useState<number>(36);
  const [nyActiveLook, setNyActiveLook] = useState<number>(0);
  const [nyLikeCount, setNyLikeCount] = useState<number>(42);
  const [nyHasLiked, setNyHasLiked] = useState<boolean>(false);

  const nyColorways = {
    cream: { bg: "bg-[#F9F6F0]", text: "text-[#1c1c1a]", border: "border-[#E5DEC9]/80", label: "warm-ivory" },
    charcoal: { bg: "bg-[#18181a]", text: "text-[#F5F5F7]", border: "border-neutral-800", label: "obsidian-black" },
    indigo: { bg: "bg-[#e8edf5]", text: "text-[#122238]", border: "border-[#cfdbeb]", label: "editorial-powder" },
  };

  const nyLooks = [
    { title: "THE MONOGRAPH", subtitle: "Collection N° 04 — Symmetrical Silhouettes", desc: "A structural exploration of modern fluid forms." },
    { title: "AUTUMN TEXTURES", subtitle: "Collection N° 05 — Natural Tactility", desc: "Heavy wool overlays and brushed silk structures." },
    { title: "MINIMALIST SILENT", subtitle: "Collection N° 06 — Architectural Line", desc: "Zero-clutter seams with hidden utility folds." }
  ];

  // ==========================================
  // PROJECT 2: STUDIO AXON (Brutalist Architectural Grid)
  // ==========================================
  const [axonGridCols, setAxonGridCols] = useState<number>(12);
  const [axonShowOutlines, setAxonShowOutlines] = useState<boolean>(true);
  const [axonCart, setAxonCart] = useState<Array<{ name: string; price: number }>>([]);
  const [axonCursorPos, setAxonCursorPos] = useState({ x: 0, y: 0 });
  const axonContainerRef = useRef<HTMLDivElement>(null);

  const handleAxonMouseMove = (e: React.MouseEvent) => {
    if (!axonContainerRef.current) return;
    const rect = axonContainerRef.current.getBoundingClientRect();
    setAxonCursorPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  const axonItems = [
    { id: "p1", name: "Structure-04 Block Blueprint", price: 240 },
    { id: "p2", name: "Axial Column Wireframe Design", price: 180 },
    { id: "p3", name: "Monolith Fine Concrete Asset", price: 320 }
  ];

  // ==========================================
  // PROJECT 3: NOVA SYSTEMS (Tactical Interface HUD)
  // ==========================================
  const [novaFrequency, setNovaFrequency] = useState<number>(2.4);
  const [novaAmplitude, setNovaAmplitude] = useState<number>(40);
  const [novaGridSatellite, setNovaGridSatellite] = useState<boolean>(true);
  const [novaThermalOverlay, setNovaThermalOverlay] = useState<boolean>(false);
  const [novaAudioMuted, setNovaAudioMuted] = useState<boolean>(true);
  const [novaLogs, setNovaLogs] = useState<string[]>(["SYSTEMS INIT SECURE", "T-CORE STABLE [5.8GHz]", "CONN: SAT_LINK_SEC_01"]);

  useEffect(() => {
    if (!isExpanded || projectId !== "nova-systems") return;
    const interval = setInterval(() => {
      const msgs = [
        "RADAR TELEMETRY PULSE SENT",
        "SATELLITE SECTOR RESCAN OK",
        "ENCRYPTED PACKET EXCHANGED",
        "T-CORE TEMP STABILIZED: 34°C",
        "NOVA COCKPIT FEED ACTIVE",
        "SYS LOG COMPILATION PERSISTED"
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setNovaLogs(prev => [randomMsg, ...prev.slice(0, 4)]);
    }, 4500);
    return () => clearInterval(interval);
  }, [isExpanded, projectId]);

  // ==========================================
  // PROJECT 4: MURALIS ART (Contemporary Asymmetric Canvas)
  // ==========================================
  const [muralisTension, setMuralisTension] = useState<number>(50); // 0 (Fluid) to 100 (Brutal/Sharp)
  const [muralisArtColor, setMuralisArtColor] = useState<string>("monochrome");
  const [muralisShapes, setMuralisShapes] = useState<Array<{ id: number; x: number; y: number; size: number; shape: "circle" | "square" | "triangle" }>>([
    { id: 1, x: 25, y: 35, size: 40, shape: "circle" },
    { id: 2, x: 65, y: 55, size: 60, shape: "square" },
    { id: 3, x: 45, y: 20, size: 50, shape: "triangle" }
  ]);

  const addMuralisShape = () => {
    const shapes: Array<"circle" | "square" | "triangle"> = ["circle", "square", "triangle"];
    const newShape = {
      id: Date.now(),
      x: 15 + Math.floor(Math.random() * 70),
      y: 15 + Math.floor(Math.random() * 70),
      size: 30 + Math.floor(Math.random() * 40),
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
    setMuralisShapes(prev => [...prev, newShape]);
  };

  const clearMuralisShapes = () => {
    setMuralisShapes([]);
  };

  // ==========================================
  // RENDER SELECTION HANDLER
  // ==========================================
  
  // Render Project 1: The New York Edit
  if (projectId === "new-york-edit") {
    const selectedStyle = nyColorways[nyColorway];
    
    if (!isExpanded) {
      return (
        <div className="w-full h-full bg-[#FAF6F0] p-4 flex flex-col justify-between relative overflow-hidden select-none">
          {/* Magazine aesthetics header */}
          <div className="flex justify-between items-baseline border-b border-[#E5DEC9] pb-2">
            <span className="font-serif italic text-[11px] font-bold tracking-widest text-neutral-850">THE NY EDIT</span>
            <span className="text-[7px] font-bold tracking-widest text-neutral-500 uppercase">VOL. 04 / ISSUE 2026</span>
          </div>

          {/* Abstract elegant centerpiece */}
          <div className="my-auto flex flex-col items-center justify-center relative py-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-44 border border-[#D5CDB4]/70 rotate-3 transition-transform duration-700 ease-out group-hover:rotate-6 bg-[#FCFAF6]/60 backdrop-blur-xs flex items-center justify-center">
              <span className="font-serif text-[64px] font-normal text-neutral-200 select-none">N°4</span>
            </div>
            
            <div className="relative border border-neutral-900/10 p-4 bg-white/95 shadow-xs w-[85%] text-left space-y-1 transition-all duration-500 group-hover:scale-[1.02]">
              <span className="text-[7px] uppercase tracking-wider text-brand-blue font-bold">Luxe Editorial</span>
              <h5 className="font-serif italic font-extrabold text-[15px] text-[#1d1d1f] tracking-tight leading-none">
                Symmetrical Silhouettes
              </h5>
              <p className="text-[8px] text-neutral-500 leading-tight">Contemporary shapes carved with quiet discipline.</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-bold uppercase tracking-widest pt-1 border-t border-[#E5DEC9]/40">
            <span>© RUAN.DEV MONOGRAPH</span>
            <span>READ CASE STUDY</span>
          </div>
        </div>
      );
    }

    // EXPANDED EDITORIAL WORKBENCH
    return (
      <div className={`w-full ${selectedStyle.bg} ${selectedStyle.text} transition-colors duration-500 p-6 md:p-8 rounded-2xl border ${selectedStyle.border} shadow-sm space-y-8 flex flex-col justify-between h-full min-h-[480px]`}>
        
        {/* Editorial Masthead */}
        <div className={`flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b pb-4 ${selectedStyle.border}`}>
          <div>
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">Design Monograph Suite — Workbench 01</span>
            <h3 className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight leading-none mt-1">
              THE NEW YORK EDIT
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 shrink-0">
            {Object.keys(nyColorways).map((cw) => (
              <button
                key={cw}
                onClick={() => setNyColorway(cw as any)}
                className={`px-3 py-1 text-[9px] uppercase font-bold rounded-full transition-all cursor-pointer ${
                  nyColorway === cw 
                    ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs" 
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {nyColorways[cw as keyof typeof nyColorways].label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
          {/* Left Column: Interactive Layout Preview */}
          <div className={`md:col-span-7 border ${selectedStyle.border} p-5 rounded-2xl bg-white/40 dark:bg-black/25 backdrop-blur-md relative overflow-hidden flex flex-col justify-between gap-4 h-[300px]`}>
            {/* Fine coordinate guidelines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-5 pointer-events-none">
              <div className="border-r border-b border-current" />
              <div className="border-r border-b border-current" />
              <div className="border-r border-b border-current" />
              <div className="border-b border-current" />
            </div>

            <div className="flex justify-between items-start z-10">
              <div className="space-y-0.5">
                <span className="text-[8px] font-black tracking-widest opacity-60 uppercase">CASE INDEX // ISSUE 04</span>
                <p className="text-[10px] font-semibold">COORDINATE BLOCK D</p>
              </div>
              <button 
                onClick={() => {
                  setNyHasLiked(!nyHasLiked);
                  setNyLikeCount(prev => nyHasLiked ? prev - 1 : prev + 1);
                }}
                className={`p-1.5 rounded-full border flex items-center gap-1 cursor-pointer transition-all ${
                  nyHasLiked 
                    ? "bg-[#ff3366]/10 border-[#ff3366]/30 text-[#ff3366]" 
                    : "border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Heart className={`w-3 h-3 ${nyHasLiked ? "fill-[#ff3366]" : ""}`} />
                <span className="text-[9px] font-bold px-0.5">{nyLikeCount}</span>
              </button>
            </div>

            <div className="space-y-3 z-10 text-left my-auto">
              <motion.h4 
                style={{ fontSize: `${nyFontSize}px` }} 
                className="font-serif italic font-extrabold tracking-tight leading-[0.98] cursor-default"
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {nyLooks[nyActiveLook].title}
              </motion.h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0066ff]">{nyLooks[nyActiveLook].subtitle}</p>
              <p className="text-xs max-w-sm leading-relaxed opacity-80">{nyLooks[nyActiveLook].desc}</p>
            </div>

            <div className="flex justify-between items-center z-10 pt-2 border-t border-current/10">
              <div className="flex gap-1">
                {nyLooks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNyActiveLook(idx)}
                    className={`w-5 h-1 rounded-full transition-all cursor-pointer ${
                      nyActiveLook === idx ? "bg-[#0066ff]" : "bg-current opacity-20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono opacity-60">GRID RATIO: 1.618</span>
            </div>
          </div>

          {/* Right Column: Interaction Workstation Controls */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0066ff] uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Typographic Scale Lab</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="opacity-60 uppercase">Display Size</span>
                  <span className="font-mono">{nyFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={nyFontSize}
                  onChange={(e) => setNyFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0066ff] bg-black/10 dark:bg-white/15 h-1.5 rounded-full outline-hidden cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold opacity-60 block">Layout Collections</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {nyLooks.map((look, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNyActiveLook(idx)}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex justify-between items-center cursor-pointer ${
                        nyActiveLook === idx 
                          ? "bg-white dark:bg-zinc-800 border-[#0066ff]/40 font-semibold" 
                          : "border-transparent opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="truncate">{look.title}</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${nyActiveLook === idx ? "translate-x-0.5 text-[#0066ff]" : "opacity-30"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[10px] leading-relaxed opacity-60 flex items-start gap-2 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
              <Layers className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
              <p>
                In production, <strong>The New York Edit</strong> dynamically balances the optical weight of serif glyphs on fluid spring grids to keep negative space proportional.
              </p>
            </div>
          </div>
        </div>

        {/* Lab Footer metrics */}
        <div className={`flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-3 text-[9px] font-mono uppercase tracking-widest opacity-60 ${selectedStyle.border}`}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Vibe: Editorial Luxury
          </span>
          <span>SYSTEM CALIBRATED: MONOGRAPH OK</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROJECT 2: STUDIO AXON (Brutalist Architecture)
  // ==========================================
  if (projectId === "studio-axon") {
    
    if (!isExpanded) {
      return (
        <div className="w-full h-full bg-[#18181B] text-[#f5f5f7] p-4 flex flex-col justify-between relative overflow-hidden select-none border border-neutral-800">
          {/* Stark Brutalist aesthetics */}
          <div className="flex justify-between items-center font-mono text-[8px] tracking-tight border-b border-neutral-800 pb-1.5">
            <span className="font-extrabold text-[#f5f5f7]">STUDIO AXON</span>
            <span className="text-zinc-500">ID // AXON_23</span>
          </div>

          {/* Rotating schematic centerpiece */}
          <div className="my-auto py-2 flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-[#0066ff] stroke-[1] fill-none animate-[spin_24s_linear_infinite] opacity-80">
              {/* Isometric Wireframe Box */}
              <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" />
              <line x1="50" y1="15" x2="50" y2="95" />
              <line x1="15" y1="35" x2="50" y2="55" />
              <line x1="85" y1="35" x2="50" y2="55" />
              <circle cx="50" cy="55" r="3" className="fill-[#0066ff]" />
            </svg>
            <div className="mt-2 text-center">
              <p className="font-sans font-black text-[12px] tracking-tighter uppercase">BRUTALIST CONCRETE GRID</p>
              <span className="font-mono text-[7px] tracking-wide text-zinc-500">SWISS METRIC SYSTEM ENABLED</span>
            </div>
          </div>

          <div className="flex justify-between items-center font-mono text-[7px] text-zinc-500 pt-1.5 border-t border-neutral-800">
            <span>GRID // ACTIVE</span>
            <span className="text-[#0066ff]">INTERACT</span>
          </div>
        </div>
      );
    }

    // EXPANDED WORKBENCH
    return (
      <div 
        ref={axonContainerRef}
        onMouseMove={handleAxonMouseMove}
        className="w-full bg-[#fafafa] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-500 p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 flex flex-col justify-between h-full min-h-[480px]"
      >
        {/* Modular Header */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#0066ff] font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-ping" />
              Structural Architectural Suite
            </span>
            <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tighter leading-none uppercase mt-1">
              STUDIO AXON
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-zinc-500">GRID COLS:</span>
            <div className="flex bg-neutral-200/50 dark:bg-neutral-900 p-0.5 rounded-md border border-neutral-300/40 dark:border-neutral-800">
              {[4, 8, 12].map((col) => (
                <button
                  key={col}
                  onClick={() => setAxonGridCols(col)}
                  className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer font-bold ${
                    axonGridCols === col 
                      ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs" 
                      : "text-zinc-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          {/* Sandbox Canvas */}
          <div className="lg:col-span-8 bg-neutral-100 dark:bg-zinc-900/60 rounded-xl p-5 border border-neutral-200/60 dark:border-neutral-800 relative h-[320px] flex flex-col justify-between overflow-hidden cursor-crosshair">
            
            {/* Live Wireframe Structural Outlines */}
            {axonShowOutlines && (
              <div className="absolute inset-0 grid grid-flow-col gap-px pointer-events-none p-4" style={{ gridTemplateColumns: `repeat(${axonGridCols}, 1fr)` }}>
                {Array.from({ length: axonGridCols }).map((_, i) => (
                  <div key={i} className="h-full border-r border-dashed border-neutral-300/60 dark:border-zinc-800/60 flex items-end p-1 justify-end font-mono text-[7px] text-zinc-400 select-none">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-start z-10 font-mono text-[9px] text-zinc-500">
              <span>COORD_TRACKER // ON</span>
              <span>X: {axonCursorPos.x}px • Y: {axonCursorPos.y}px</span>
            </div>

            {/* Brutalist center illustration showing alignment of structural cards */}
            <div className="my-auto z-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <motion.div 
                className="w-32 h-32 bg-white dark:bg-zinc-950 border-2 border-neutral-900 dark:border-neutral-100 p-4 relative flex flex-col justify-between shadow-xs transition-all"
                animate={{ rotateY: axonCursorPos.x / 10, rotateX: -axonCursorPos.y / 10 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="font-mono text-[7px] text-zinc-500">AXON_M1</div>
                <div className="my-auto">
                  <div className="w-full h-1 bg-current" />
                  <p className="font-sans font-black text-sm tracking-tighter leading-none mt-1 uppercase">GRID BLK</p>
                </div>
                <div className="flex justify-between font-mono text-[6px] text-zinc-400">
                  <span>SW_101</span>
                  <span>O_250</span>
                </div>
              </motion.div>

              <div className="space-y-2 max-w-xs text-left">
                <span className="font-mono text-[8px] uppercase tracking-wider text-brand-blue font-bold px-1.5 py-0.5 bg-neutral-200 dark:bg-zinc-800 rounded">METRIC BLOCK_04</span>
                <p className="font-sans font-extrabold text-lg text-neutral-900 dark:text-zinc-50 leading-tight uppercase tracking-tighter">Rigid Swiss grids, concrete materials.</p>
                <p className="text-[11px] leading-normal opacity-70">Move your cursor over this workstation container to skew perspective and inspect isometric structural points in real-time.</p>
              </div>
            </div>

            <div className="flex justify-between items-center z-10 font-mono text-[8px] text-zinc-400 pt-1.5 border-t border-neutral-200 dark:border-neutral-800/40">
              <button 
                onClick={() => setAxonShowOutlines(!axonShowOutlines)}
                className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer font-bold uppercase"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>{axonShowOutlines ? "Hide Wireframe Guides" : "Show Wireframe Guides"}</span>
              </button>
              <span>SWISS SYSTEM V3.14</span>
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f0f0f2]/60 dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-850 space-y-4 text-left">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
                <ShoppingCart className="w-4 h-4" />
                <span>Tactile Checkout Simulator</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold block">Select Core Assets:</span>
                <div className="space-y-1">
                  {axonItems.map((item) => {
                    const isInCart = axonCart.some(i => i.name === item.name);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (isInCart) {
                            setAxonCart(prev => prev.filter(i => i.name !== item.name));
                          } else {
                            setAxonCart(prev => [...prev, { name: item.name, price: item.price }]);
                          }
                        }}
                        className={`w-full p-2 rounded-lg border text-xs font-mono transition-all flex justify-between items-center cursor-pointer ${
                          isInCart 
                            ? "bg-white dark:bg-zinc-800 border-neutral-900 dark:border-neutral-100 font-bold" 
                            : "border-transparent bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <span className="truncate max-w-[130px]">{item.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-zinc-500">${item.price}</span>
                          {isInCart && <Check className="w-3.5 h-3.5 text-[#0066ff]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="pt-2 border-t border-neutral-300 dark:border-neutral-800 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ITEMS SELECTED:</span>
                  <span className="font-bold">{axonCart.length}</span>
                </div>
                <div className="flex justify-between text-[#0066ff] font-extrabold">
                  <span>TOTAL ESTIMATE:</span>
                  <span>${axonCart.reduce((acc, curr) => acc + curr.price, 0)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Tactile simulation purchase complete! Processing payment of $${axonCart.reduce((acc, curr) => acc + curr.price, 0)} via simulated brutalist API endpoint.`);
                setAxonCart([]);
              }}
              disabled={axonCart.length === 0}
              className="w-full bg-[#111] dark:bg-white text-white dark:text-neutral-950 font-sans font-bold text-xs uppercase py-3.5 rounded-lg tracking-wider cursor-pointer transition-all hover:opacity-90 active:scale-98 disabled:opacity-30 disabled:pointer-events-none"
            >
              Execute Instant Purchase
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
          <span>MATERIAL: MATTE CONCRETE STEEL</span>
          <span>© BRUTALIST PORTFOLIO S.A.</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROJECT 3: NOVA SYSTEMS (Tactical Interface HUD)
  // ==========================================
  if (projectId === "nova-systems") {
    
    if (!isExpanded) {
      return (
        <div className="w-full h-full bg-[#0a0c10] text-[#0066ff] p-4 flex flex-col justify-between relative overflow-hidden select-none border border-neutral-950">
          {/* Tactical HUD Header */}
          <div className="flex justify-between items-baseline font-mono text-[8px] tracking-widest border-b border-[#0066ff]/20 pb-1.5">
            <span className="font-extrabold text-zinc-200 uppercase">NOVA SYSTEMS HUD</span>
            <span className="text-emerald-500 animate-pulse">● FEED SECURE</span>
          </div>

          {/* Sweeping Radar Centerpiece */}
          <div className="my-auto flex flex-col items-center justify-center relative py-1.5">
            <div className="relative w-20 h-20 rounded-full border border-[#0066ff]/30 flex items-center justify-center">
              {/* Spinning sweeping line */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#0066ff]/10 animate-[spin_6s_linear_infinite]" />
              <div className="absolute w-[1px] h-10 bg-gradient-to-t from-transparent to-[#0066ff] origin-bottom -top-1 left-[40px] animate-[spin_3s_linear_infinite]" />
              
              {/* Radar targets */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#0066ff] top-5 left-12 animate-ping" />
              <div className="absolute w-1 h-1 rounded-full bg-emerald-500 bottom-6 left-6" />
              
              <span className="font-mono text-[8px] text-zinc-300">T-CORE v2.14</span>
            </div>
          </div>

          <div className="flex justify-between items-center font-mono text-[7px] text-[#0066ff]/60 pt-1.5 border-t border-[#0066ff]/10">
            <span>FREQ: 5.8 GHz</span>
            <span className="text-white">INTERACTIVE HUD</span>
          </div>
        </div>
      );
    }

    // EXPANDED HUD
    return (
      <div className="w-full bg-[#0A0D14] text-zinc-100 transition-colors duration-500 p-6 md:p-8 rounded-2xl border border-blue-950 shadow-sm space-y-6 flex flex-col justify-between h-full min-h-[480px]">
        {/* HUD Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-blue-900/30 pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tactical Hardware Control Unit
            </span>
            <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tight leading-none text-[#0066ff]">
              NOVA SYSTEMS HUD
            </h3>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-zinc-500">MUTE:</span>
            <button 
              onClick={() => setNovaAudioMuted(!novaAudioMuted)} 
              className={`p-1 rounded-md border cursor-pointer transition-all ${
                novaAudioMuted 
                  ? "border-[#0066ff]/30 text-zinc-500 hover:text-white" 
                  : "border-[#ff3366]/40 bg-[#ff3366]/10 text-[#ff3366]"
              }`}
            >
              {novaAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          {/* Main Monitor Display */}
          <div className="lg:col-span-8 bg-[#0D121F] rounded-xl p-5 border border-blue-900/40 relative h-[320px] flex flex-col justify-between overflow-hidden">
            {/* Background scanner lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,102,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
            
            {/* Grid coordinates overlay */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.06] pointer-events-none p-4">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-blue-400" />
              ))}
            </div>

            <div className="flex justify-between items-start z-10 font-mono text-[9px]">
              <span className="text-blue-400 font-extrabold">MONITOR // WAVEFORM_FEED</span>
              <span className="text-emerald-400">AMPLITUDE: {novaAmplitude}dB • FREQ: {novaFrequency}GHz</span>
            </div>

            {/* Interactive SVG wave diagram */}
            <div className="my-auto z-10 relative h-28 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                {/* Sine wave path generated from amplitude and frequency states */}
                <path
                  d={Array.from({ length: 401 }).map((_, i) => {
                    const x = i;
                    const y = 50 + Math.sin((i / 400) * Math.PI * 2 * novaFrequency) * (novaAmplitude / 2);
                    return `${i === 0 ? "M" : "L"}${x} ${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={novaThermalOverlay ? "#f43f5e" : "#0066ff"}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                
                {/* Horizontal reference baseline */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#0066ff" strokeWidth="0.5" strokeDasharray="3,3" className="opacity-30" />
                
                {/* Pulsing focal dot */}
                <circle
                  cx="200"
                  cy={50 + Math.sin((200 / 400) * Math.PI * 2 * novaFrequency) * (novaAmplitude / 2)}
                  r="5"
                  fill={novaThermalOverlay ? "#f43f5e" : "#0066ff"}
                  className="animate-ping"
                />
              </svg>

              {/* Thermal effect glow filter overlay */}
              {novaThermalOverlay && (
                <div className="absolute inset-0 bg-rose-500/5 backdrop-hue-rotate-180 pointer-events-none rounded-xl" />
              )}
            </div>

            {/* Bottom monitoring logs */}
            <div className="flex justify-between items-center z-10 pt-2 border-t border-blue-900/30">
              <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>COCKPIT_COMMS: ENCRYPTED</span>
              </div>
              <span className="font-mono text-[9px] text-[#0066ff]">SIGNAL REFRESH OK</span>
            </div>
          </div>

          {/* Side control station */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121826] p-4 rounded-xl border border-blue-900/25 space-y-4 text-left">
              <span className="font-mono text-[10px] uppercase text-blue-400 font-bold block border-b border-blue-900/20 pb-1.5">Interactive Controls</span>
              
              {/* Sliders for Waveform manipulation */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span className="text-zinc-400 uppercase">Focal Frequency</span>
                    <span className="text-blue-400">{novaFrequency} GHz</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.1"
                    value={novaFrequency}
                    onChange={(e) => {
                      setNovaFrequency(parseFloat(e.target.value));
                      if (!novaAudioMuted) {
                        try {
                          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const osc = ctx.createOscillator();
                          osc.frequency.setValueAtTime(parseFloat(e.target.value) * 150 + 200, ctx.currentTime);
                          osc.connect(ctx.destination);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.05);
                        } catch (err) {}
                      }
                    }}
                    className="w-full accent-[#0066ff] bg-blue-950 h-1.5 rounded-full outline-hidden cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span className="text-zinc-400 uppercase">Oscilloscope dB</span>
                    <span className="text-blue-400">{novaAmplitude} dB</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={novaAmplitude}
                    onChange={(e) => setNovaAmplitude(parseInt(e.target.value, 10))}
                    className="w-full accent-[#0066ff] bg-blue-950 h-1.5 rounded-full outline-hidden cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-2 pt-2 border-t border-blue-900/20">
                <button
                  onClick={() => {
                    setNovaThermalOverlay(!novaThermalOverlay);
                    setNovaLogs(prev => ["THERMAL MONITORS TOGGLED", ...prev]);
                  }}
                  className={`w-full p-2 rounded-lg border text-xs font-mono transition-all flex justify-between items-center cursor-pointer ${
                    novaThermalOverlay 
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400" 
                      : "border-transparent bg-black/15 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Thermal Sensor Grid</span>
                  <span className={`w-2 h-2 rounded-full ${novaThermalOverlay ? "bg-rose-500 animate-pulse" : "bg-zinc-700"}`} />
                </button>

                <button
                  onClick={() => {
                    setNovaGridSatellite(!novaGridSatellite);
                    setNovaLogs(prev => ["SATELLITE COMPASS LINK CHANGED", ...prev]);
                  }}
                  className={`w-full p-2 rounded-lg border text-xs font-mono transition-all flex justify-between items-center cursor-pointer ${
                    novaGridSatellite 
                      ? "bg-blue-500/10 border-blue-500/40 text-blue-400" 
                      : "border-transparent bg-black/15 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Sat-Grid Coordinates</span>
                  <span className={`w-2 h-2 rounded-full ${novaGridSatellite ? "bg-blue-500 animate-pulse" : "bg-zinc-700"}`} />
                </button>
              </div>

              {/* Dynamic Scrolling Logs */}
              <div className="bg-black/40 p-2.5 rounded-lg border border-blue-950/40 space-y-1 h-[75px] overflow-hidden font-mono text-[8px] text-zinc-400 text-left">
                <span className="text-zinc-500 uppercase font-black block text-[7px] mb-1">Live Comm Link Logs:</span>
                {novaLogs.map((log, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/5 pb-0.5">
                    <span className="truncate">{log}</span>
                    <span className="text-[#0066ff] shrink-0 font-bold">[OK]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-blue-900/20 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
          <span>PORTLINK SEC: CLOUD_LOCK</span>
          <span>© NOVA SYSTEMS AEROSPACE</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROJECT 4: MURALIS ART (Contemporary Exhibition Gallery)
  // ==========================================
  if (projectId === "muralis-art") {
    
    if (!isExpanded) {
      return (
        <div className="w-full h-full bg-[#FFFFFF] dark:bg-black text-black dark:text-white p-4 flex flex-col justify-between relative overflow-hidden select-none border border-neutral-200 dark:border-neutral-900">
          {/* Exhibition Frame */}
          <div className="flex justify-between items-baseline font-sans text-[7px] font-bold uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
            <span>MURALIS FINE ART</span>
            <span>EXHIBITION N° 4</span>
          </div>

          {/* Shifting fine geometric composition */}
          <div className="my-auto flex flex-col items-center justify-center relative py-2">
            <div className="relative w-20 h-20 border border-neutral-900/10 dark:border-white/10 flex items-center justify-center">
              {/* Overlapping offset fine elements */}
              <div className="absolute w-12 h-12 border border-black dark:border-white rotate-12 transition-transform duration-700 ease-out group-hover:rotate-45" />
              <div className="absolute w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 -top-1 -left-1 animate-pulse" />
              <div className="absolute w-14 h-[1px] bg-black dark:bg-white -rotate-12 group-hover:rotate-12 transition-transform" />
            </div>
            <p className="font-sans font-black text-[11px] tracking-tight text-center uppercase mt-2.5">CONTEMPORARY GEOMETRY</p>
          </div>

          <div className="flex justify-between items-center font-sans text-[7px] text-zinc-400 font-bold uppercase tracking-widest pt-1.5 border-t border-neutral-100 dark:border-neutral-900">
            <span>SWISS CURATOR ALIGNED</span>
            <span className="text-black dark:text-white">INTERACT</span>
          </div>
        </div>
      );
    }

    // EXPANDED EXHIBITION WORKBENCH
    return (
      <div className="w-full bg-white dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-500 p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 flex flex-col justify-between h-full min-h-[480px]">
        {/* Gallery Info Header */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-4">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-widest font-extrabold text-neutral-400">Contemporary Exhibition Space — Lab 04</span>
            <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tight uppercase mt-1 leading-none">
              MURALIS ART ARCHIVE
            </h3>
          </div>
          <div className="flex bg-neutral-100 dark:bg-zinc-900 p-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 font-mono text-[9px] uppercase shrink-0">
            {["monochrome", "neon"].map((colMode) => (
              <button
                key={colMode}
                onClick={() => setMuralisArtColor(colMode)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold uppercase ${
                  muralisArtColor === colMode 
                    ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs" 
                    : "text-neutral-500"
                }`}
              >
                {colMode}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Art Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          {/* Fine Art Interactive Canvas Frame */}
          <div className="lg:col-span-8 bg-[#fdfdfd] dark:bg-neutral-950 border-4 border-double border-neutral-900 dark:border-neutral-200 rounded-xl p-6 relative h-[320px] flex flex-col justify-between overflow-hidden shadow-xs">
            
            <div className="flex justify-between items-start z-10 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>CANVAS_EXHIBIT // ID_M4</span>
              <span>Tension Index: {muralisTension}%</span>
            </div>

            {/* Shifting modern art piece */}
            <div className="my-auto z-10 relative h-40 flex items-center justify-center">
              {/* Background circular halo */}
              <div 
                className={`absolute w-32 h-32 rounded-full filter blur-md transition-all duration-700 opacity-20 ${
                  muralisArtColor === "neon" ? "bg-indigo-500" : "bg-neutral-400"
                }`} 
                style={{ transform: `scale(${1 + muralisTension / 150})` }}
              />

              {/* Overlapping geometrical layers */}
              <div className="relative w-36 h-36 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
                
                {/* Dynamically spawned custom shapes */}
                {muralisShapes.map((shp) => {
                  const baseColor = muralisArtColor === "neon" ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-900 dark:border-neutral-100 bg-neutral-900/5 dark:bg-white/5";
                  return (
                    <motion.div
                      key={shp.id}
                      drag
                      dragConstraints={{ left: -60, right: 60, top: -60, bottom: 60 }}
                      className={`absolute border transition-all cursor-grab active:cursor-grabbing flex items-center justify-center ${baseColor}`}
                      style={{
                        left: `${shp.x}%`,
                        top: `${shp.y}%`,
                        width: `${shp.size}px`,
                        height: `${shp.size}px`,
                        borderRadius: shp.shape === "circle" ? "50%" : shp.shape === "triangle" ? "50% 50% 0 0" : "4px",
                        transform: `rotate(${muralisTension * 1.8}deg)`
                      }}
                    >
                      <span className="text-[6px] font-mono opacity-20 uppercase pointer-events-none">{shp.shape}</span>
                    </motion.div>
                  );
                })}

                {/* Main fine grid wireframes */}
                <div 
                  className={`w-20 h-20 border transition-transform duration-500 ${
                    muralisArtColor === "neon" ? "border-[#0066ff]" : "border-neutral-900 dark:border-neutral-100"
                  }`}
                  style={{ 
                    borderRadius: `${100 - muralisTension}% 0% ${muralisTension}% 0%`,
                    transform: `rotate(${muralisTension / 2}deg)`
                  }}
                />

                <div 
                  className="absolute w-24 h-[1.5px] transition-transform duration-500 bg-current"
                  style={{ transform: `rotate(${-muralisTension * 0.4}deg)` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center z-10 pt-2 border-t border-neutral-100 dark:border-neutral-900 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              <button 
                onClick={addMuralisShape}
                className="hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 cursor-pointer font-extrabold uppercase"
              >
                <span>+ SPAWN GEOMETRIC SHAPE</span>
              </button>
              <button 
                onClick={clearMuralisShapes}
                className="hover:text-rose-500 cursor-pointer font-bold text-neutral-400"
              >
                RESET
              </button>
            </div>
          </div>

          {/* Curatorial slider and controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-neutral-50 dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-850 space-y-4 text-left">
              <span className="font-sans text-[10px] uppercase text-neutral-500 font-extrabold block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">Interactive Curator Controls</span>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-sans font-extrabold">
                    <span className="text-neutral-500 uppercase">Muralis Morph Balance</span>
                    <span className="text-neutral-900 dark:text-white font-bold">{muralisTension}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={muralisTension}
                    onChange={(e) => setMuralisTension(parseInt(e.target.value, 10))}
                    className="w-full accent-neutral-950 dark:accent-white bg-neutral-200 dark:bg-zinc-800 h-1.5 rounded-full outline-hidden cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-bold text-neutral-400">
                    <span>BIOMORPHIC SHAPE</span>
                    <span>BRUTAL GEOMETRY</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] leading-relaxed opacity-60 flex items-start gap-2 bg-neutral-100 dark:bg-neutral-800/40 p-3 rounded-lg border border-neutral-200/50 dark:border-neutral-800">
                <p>
                  Click the <strong>Spawn</strong> trigger on the canvas to inject user-authored geometric frames. Drag any frame around the museum glass using mouse coordinates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-850 font-sans text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
          <span>CURATOR LEVEL: SWISS SYMMETRY</span>
          <span>© MURALIS CONTEMPORARY TRUST</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // FALLBACK GENERIC BEAUTIFUL SCHEMATIC OR CUSTOM STATIC CAPTURE
  // ==========================================
  if (fallbackImage && fallbackImage !== "#") {
    return (
      <div className="w-full h-full relative group bg-neutral-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden rounded-2xl">
        <img
          src={fallbackImage}
          alt={fallbackAlt || "Static custom mockup"}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {isExpanded && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-xl border border-neutral-250 dark:border-neutral-800 text-left">
            <span className="font-mono text-[8px] font-black tracking-widest text-[#0066ff] uppercase block">PRE-PRODUCTION PREVIEW</span>
            <p className="text-xs font-semibold text-neutral-900 dark:text-zinc-50 mt-0.5">{fallbackAlt}</p>
          </div>
        )}
      </div>
    );
  }

  // Minimal aesthetic empty placeholder fallback if absolutely no image or custom ID exists
  return (
    <div className="w-full h-full bg-[#FAF9F6] dark:bg-[#0c0c0e] p-6 flex flex-col justify-between rounded-xl border border-neutral-250 dark:border-neutral-800">
      <div className="flex justify-between text-[8px] font-mono text-zinc-400">
        <span>SCHEMATIC // ACTIVE</span>
        <span>ID_GENERIC_X</span>
      </div>
      <div className="my-auto py-2 text-center">
        <Code className="w-8 h-8 text-[#0066ff] mx-auto animate-pulse opacity-80 mb-2" />
        <h5 className="font-sans font-bold text-sm tracking-tight">Interactive Abstract Blueprint</h5>
        <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto">This project contains custom structural components rendered in real-time by ruan.dev</p>
      </div>
      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest text-center border-t border-neutral-200/50 pt-2">© PERSISTED FRAMEWORK PORTFOLIO</span>
    </div>
  );
}
