import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, MotionValue, Variants } from "framer-motion";
import { ArrowUpRight, X, CheckCircle } from "lucide-react";
import { Project } from "../types";
import ProjectVisualizer from "./ProjectVisualizer";

// 3D Mouse Tilt Parallax Component
function MouseTilt({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for silky smooth return-to-center physics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate normalized position relative to center [-0.5, 0.5]
    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="w-full h-full cursor-pointer transition-transform duration-300"
    >
      {children}
    </motion.div>
  );
}

// Stagger variants for the Left Column text elements
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 } 
  },
  exit: { 
    opacity: 0, 
    y: -25,
    transition: { ease: "easeIn", duration: 0.2 }
  }
};

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  activeIndex: number;
  onProjectClick: (project: Project) => void;
}

// Individual modular project card containing layout columns and scroll-driven physics
function ProjectCard({
  project,
  index,
  total,
  scrollYProgress,
  activeIndex,
  onProjectClick,
}: ProjectCardProps) {
  
  // Compute relative progress: -1 (below), 0 (fully active/centered), 1 (fully exited/pushed back)
  const cardProgress = useTransform(scrollYProgress, (progress) => {
    if (total <= 1) return 0;
    const cardActiveProgress = index / (total - 1);
    const diff = progress - cardActiveProgress;
    return diff * (total - 1);
  });

  // Interpolate physical properties based on card-relative progress coordinate
  const opacity = useTransform(cardProgress, [-0.85, -0.15, 0.15, 0.85], [0, 1, 1, 0]);
  const y = useTransform(cardProgress, [-1, 0, 1], ["100vh", "0vh", "-8vh"]);
  const scale = useTransform(cardProgress, [-1, 0, 1], [1, 1, 0.93]);
  const translateZ = useTransform(cardProgress, [-1, 0, 1], [-60, 0, -120]);

  // Image animations (Scale: 1.08 -> 1, Slight Y movement, and Opacity)
  const imageScale = useTransform(cardProgress, [-1, 0, 1], [1.08, 1, 0.96]);
  const imageY = useTransform(cardProgress, [-1, 0, 1], [24, 0, -24]);

  const isCurrent = activeIndex === index;

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        translateZ,
        zIndex: index,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-0 w-full h-full flex items-center justify-center p-6 md:p-12 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pointer-events-auto">
        {/* Left Column (Text & Editorial Spec) */}
        <div className="lg:col-span-5 h-[350px] md:h-[450px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {isCurrent && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 md:space-y-8 text-left"
              >
                {/* Large Project Number Accent */}
                <motion.span 
                  variants={itemVariants} 
                  className="font-sans text-6xl md:text-8xl lg:text-9xl font-black text-neutral-900/[0.04] dark:text-white/[0.04] block select-none leading-none tracking-tighter"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
                
                <div className="space-y-3">
                  <motion.span 
                    variants={itemVariants} 
                    className="text-xs font-bold tracking-widest text-[#0066ff] uppercase block"
                  >
                    {project.category} — {project.year}
                  </motion.span>
                  <motion.h3 
                    variants={itemVariants} 
                    className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#111111] dark:text-white tracking-tighter leading-[1.05]"
                  >
                    {project.title}
                  </motion.h3>
                </div>

                <motion.p 
                  variants={itemVariants} 
                  className="text-[#6e6e73] dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm font-sans"
                >
                  {project.description}
                </motion.p>

                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => onProjectClick(project)}
                    className="bg-[#111111]/90 dark:bg-white/90 hover:bg-[#0066ff] dark:hover:bg-[#0066ff] text-white dark:text-[#111111] hover:text-white dark:hover:text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10 dark:border-zinc-250/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,102,255,0.25)] transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                  >
                    View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (Large Rounded Image) */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <MouseTilt>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/40 dark:border-neutral-800/40 transform-gpu">
              <motion.img
                src={project.image}
                alt={project.alt || project.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                style={{
                  scale: imageScale,
                  y: imageY,
                }}
                className="w-full h-full object-cover select-none"
              />
              {/* Soft vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent pointer-events-none" />
            </div>
          </MouseTilt>
        </div>
      </div>
    </motion.div>
  );
}

interface PortfolioProps {
  projects: Project[];
  customParallaxImages?: Record<number, string>;
  onViewAllClick?: () => void;
  totalWorksCount?: number;
}

export default function Portfolio({ projects, customParallaxImages, onViewAllClick, totalWorksCount }: PortfolioProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [previewMode, setPreviewMode] = useState<"lab" | "static">("lab");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor the main document dark mode tag
  useEffect(() => {
    const checkDark = () => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Track scroll position of the entire multi-viewport stack
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Create spring softened progress coordinate for ultra-smooth sidebar fills
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 25,
    restDelta: 0.001
  });

  // Keep track of which slide index is currently active
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const N = projects.length;
    if (N <= 1) {
      setActiveIndex(0);
      return;
    }
    const idx = Math.min(
      Math.floor(latest * N),
      N - 1
    );
    if (idx !== activeIndex && idx >= 0) {
      setActiveIndex(idx);
    }
  });

  // Minimal Swiss grid patterns
  const backgroundStyleLight = {
    backgroundColor: "#fafafa",
    backgroundImage: `
      radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.015) 0%, transparent 70%),
      radial-gradient(rgba(17, 17, 17, 0.015) 1px, transparent 1px),
      linear-gradient(to right, rgba(17, 17, 17, 0.012) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(17, 17, 17, 0.012) 1px, transparent 1px)
    `,
    backgroundSize: "100% 100%, 16px 16px, 48px 48px, 48px 48px",
  };

  const backgroundStyleDark = {
    backgroundColor: "#0a0a0c",
    backgroundImage: `
      radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.04) 0%, transparent 70%),
      radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
    `,
    backgroundSize: "100% 100%, 16px 16px, 48px 48px, 48px 48px",
  };

  return (
    <section 
      id="portfolio"
      ref={containerRef}
      style={{
        height: `${(projects.length || 1) * 120 + 30}vh`
      }}
      className="relative w-full border-y border-neutral-200/40 dark:border-neutral-900/40 overflow-visible transition-colors duration-300"
    >
      {/* Sticky Deck Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center [perspective:1200px] transform-gpu">
        
        {/* Editorial Technical Background Grid */}
        <div 
          style={isDarkTheme ? backgroundStyleDark : backgroundStyleLight}
          className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-500"
        />

        {/* Pinned Editorial Page Header */}
        <div className="absolute top-8 md:top-14 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-30 select-none">
          <div className="space-y-1">
            <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#0066ff] block">
              Selected Works
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl lg:text-4xl text-[#111111] dark:text-zinc-100 tracking-tighter leading-none">
              Digital Craftsmanship.
            </h2>
          </div>
        </div>

        {/* Stacking Card Deck Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                total={projects.length}
                scrollYProgress={scrollYProgress}
                activeIndex={activeIndex}
                onProjectClick={(proj) => {
                  setActiveProject(proj);
                  setPreviewMode("lab");
                }}
              />
            ))
          ) : (
            <div className="text-center space-y-2 select-none z-10">
              <p className="text-[#6e6e73] dark:text-zinc-400 font-medium font-sans">
                No works found.
              </p>
            </div>
          )}
        </div>

        {/* Right Side Progress & Linear HUD Indicator */}
        {projects.length > 0 && (
          <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-40 select-none hidden sm:flex">
            {/* Slide Index Counter */}
            <div className="font-sans text-xs font-bold tracking-wider text-neutral-800 dark:text-zinc-200 flex flex-col items-center">
              <span className="text-xl font-black text-[#0066ff]">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-neutral-300 dark:text-neutral-700 my-1">—</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            {/* Vertical Filling Scroll Tracker Line */}
            <div className="relative w-[1.5px] h-32 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                style={{
                  scaleY: smoothProgress,
                  originY: 0,
                }}
                className="absolute inset-x-0 top-0 bg-[#0066ff] rounded-full"
              />
            </div>

            {/* Dot Navigator Matrix */}
            <div className="flex flex-col gap-2.5">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (containerRef.current) {
                      const totalHeight = containerRef.current.scrollHeight;
                      // Calculate the exact offset for this index
                      const targetOffset = (idx / (projects.length - 1 || 1)) * (totalHeight - window.innerHeight);
                      window.scrollTo({
                        top: containerRef.current.offsetTop + targetOffset,
                        behavior: "smooth"
                      });
                    }
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "bg-[#0066ff] scale-150 shadow-[0_0_8px_rgba(0,102,255,0.4)]"
                      : "bg-neutral-300 dark:bg-neutral-700 hover:bg-[#6e6e73]"
                  }`}
                  aria-label={`Jump to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pinned View All Works Button */}
        {onViewAllClick && (
          <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center select-none">
            <button
              onClick={onViewAllClick}
              className="bg-[#0066ff]/90 hover:bg-[#0066ff] text-white font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(0,102,255,0.2)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.35)] active:scale-95 whitespace-nowrap"
            >
              View All Works ({totalWorksCount || projects.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CASE STUDY DETAIL SIDE DRAWER */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
            {/* Backdrop Blur Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs"
            />

            {/* Content Drawer (Elegant slide from right) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-2xl h-[96vh] my-auto mr-0 md:mr-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl rounded-none md:rounded-[32px] shadow-modal flex flex-col justify-between overflow-y-auto border-l border-neutral-100 dark:border-neutral-900 z-10 text-neutral-900 dark:text-neutral-100"
            >
              {/* Sticky Drawer Header Controls */}
              <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-8 py-5 border-b border-neutral-100 dark:border-neutral-900 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#0066ff] bg-white/40 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 rounded-full border border-white/40 dark:border-white/10 shadow-xs">
                    Project File
                  </span>
                  <span className="text-xs font-medium text-[#6e6e73] dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                    {activeProject.year} • ID: {activeProject.id}
                    {activeProject.isLocalOnly && (
                      <span className="font-sans text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-800/20 px-1.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                        Saved locally only
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-8 space-y-8 flex-1">
                {/* Mode Selector and Container */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#F5F5F7] dark:bg-zinc-900 p-1.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800/60">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 pl-2">
                      Case Preview Mode:
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreviewMode("lab")}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                          previewMode === "lab"
                            ? "bg-white dark:bg-zinc-800 text-[#0066ff] shadow-xs font-bold"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        Interactive Lab
                      </button>
                      <button
                        onClick={() => setPreviewMode("static")}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                          previewMode === "static"
                            ? "bg-white dark:bg-zinc-800 text-[#0066ff] shadow-xs font-bold"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        Static Capture
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Preview Window */}
                  <div className="w-full overflow-hidden rounded-2xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 relative shadow-xs min-h-[300px]">
                    {previewMode === "lab" ? (
                      <ProjectVisualizer 
                        projectId={activeProject.id} 
                        isExpanded={true}
                        fallbackImage={activeProject.image}
                        fallbackAlt={activeProject.alt}
                      />
                    ) : (
                      <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-zinc-900">
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Info Description */}
                <div className="space-y-4">
                  <div>
                    <span className="font-sans text-[11px] font-semibold tracking-wider text-[#0066ff] uppercase">
                      {activeProject.category}
                    </span>
                    <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-[#111111] dark:text-zinc-100 tracking-tight mt-1 leading-[1.12]">
                      {activeProject.title}
                    </h2>
                  </div>
                  
                  <div className="h-[2px] bg-[#0066ff] w-12 rounded-full" />
                  
                  <p className="text-base text-neutral-600 dark:text-zinc-300 leading-relaxed font-sans font-normal">
                    {activeProject.description}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-900">
                  <h4 className="font-sans font-bold text-lg text-[#111111] dark:text-zinc-100 tracking-tight">
                    Key Features & Executions
                  </h4>
                  <ul className="space-y-3.5">
                    {activeProject.details && activeProject.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex gap-3 items-start bg-neutral-50/80 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-neutral-200/40 dark:border-neutral-800/40">
                        <CheckCircle className="w-4 h-4 text-[#0066ff] mt-0.5 shrink-0" />
                        <span className="text-sm text-neutral-600 dark:text-zinc-300 font-normal leading-relaxed">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Drawer Footer and Collaboration Link */}
              <div className="p-8 bg-neutral-50 dark:bg-zinc-900/80 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-[#6e6e73] dark:text-zinc-400 uppercase tracking-wide">
                    Refined by ruan.dev
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-zinc-500 mt-0.5">
                    Discussing premium bespoke design & development
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {activeProject.link && activeProject.link !== "#" && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-zinc-850 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-[#111111] dark:text-zinc-100 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                    >
                      View Live Project <ArrowUpRight className="w-3.5 h-3.5 text-[#0066ff]" />
                    </a>
                  )}
                  <a
                    href="#contact"
                    onClick={() => {
                      setActiveProject(null);
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#0066ff] text-white hover:bg-brand-blue-hover px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_12px_rgba(0,102,255,0.15)] inline-flex items-center gap-2 cursor-pointer"
                  >
                    Start Collaboration <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
