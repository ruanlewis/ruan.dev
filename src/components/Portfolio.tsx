import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, CheckCircle } from "lucide-react";
import { Project } from "../types";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filters = [
    { value: "all", label: "All Works" },
    { value: "web-design", label: "Web Design" },
    { value: "ux-strategy", label: "UX/Product" },
    { value: "brand-identity", label: "Identity" },
  ];

  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "web-design") {
      return project.category.toLowerCase().includes("web") || project.category.toLowerCase().includes("e-commerce");
    }
    if (selectedFilter === "ux-strategy") {
      return project.category.toLowerCase().includes("ux") || project.category.toLowerCase().includes("ui");
    }
    if (selectedFilter === "brand-identity") {
      return project.category.toLowerCase().includes("brand") || project.category.toLowerCase().includes("platform");
    }
    return true;
  });

  const defaultImages = [
    {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Modern architecture building',
    },
    {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Urban cityscape at sunset',
    },
    {
      src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Abstract geometric pattern',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Mountain landscape',
    },
    {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Minimalist design elements',
    },
    {
      src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Ocean waves and beach',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Forest trees and sunlight',
    },
  ];

  // Map active filtered projects first, then fill with high-quality unsplash images up to 7
  const parallaxImages = filteredProjects.map((project) => ({
    src: project.image,
    alt: project.alt || project.title,
    project: project,
  }));

  // Append remaining placeholder items from the prompt to keep exactly 7 items
  let defaultIdx = 0;
  while (parallaxImages.length < 7 && defaultIdx < defaultImages.length) {
    const candidate = defaultImages[defaultIdx];
    if (!parallaxImages.some(img => img.src === candidate.src)) {
      parallaxImages.push({
        src: candidate.src,
        alt: candidate.alt,
        project: null,
      });
    }
    defaultIdx++;
  }

  const finalImages = parallaxImages.slice(0, 7);

  return (
    <section 
      id="portfolio" 
      className="relative bg-gradient-to-b from-white via-[#FAF9F6] to-white dark:from-[#08080a] dark:via-[#0c0c0e] dark:to-[#08080a] border-y border-border-light dark:border-neutral-900/60 py-20 overflow-visible transition-colors duration-300"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-12 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-border-light dark:border-neutral-900/60 pb-8">
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-blue block">
              Selected Works
            </span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1d1d1f] dark:text-zinc-100 tracking-tighter leading-[1.08] mt-1">
              Digital Craftsmanship.
            </h2>
          </div>
          
          {/* Category Filter Tabs with Apple Segmented Control Aesthetic */}
          <div className="flex bg-[#F5F5F7] dark:bg-neutral-900 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-800/60 shrink-0">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`relative px-4 py-1.5 text-xs font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer ${
                  selectedFilter === filter.value
                    ? "text-[#1d1d1f] dark:text-white bg-white dark:bg-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold"
                    : "text-brand-slate dark:text-zinc-400 hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Zoom Parallax Core View */}
      <div className="w-full relative overflow-visible select-none">
        <ZoomParallax images={finalImages} onProjectClick={(proj) => setActiveProject(proj)} />
      </div>

      {/* CASE STUDY INSPECTION SIDE DRAWER */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
            {/* Backdrop opacity scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-[#1d1d1f]/40 backdrop-blur-xs"
            />

            {/* Content Drawer Box (Elegant slide with Apple rounded corners) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-2xl h-[96vh] my-auto mr-0 md:mr-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl rounded-none md:rounded-[32px] shadow-modal flex flex-col justify-between overflow-y-auto border-l border-border-light dark:border-neutral-800 z-10 text-neutral-900 dark:text-neutral-100"
            >
              {/* Box Header Controls */}
              <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-8 py-5 border-b border-border-light dark:border-neutral-800 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-brand-blue bg-[#F5F5F7] dark:bg-zinc-900 px-3 py-1 rounded-full border border-neutral-100 dark:border-neutral-800">
                    Project File
                  </span>
                  <span className="text-xs font-medium text-brand-slate dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                    {activeProject.year} • ID: {activeProject.id}
                    {activeProject.isLocalOnly && (
                      <span className="font-sans text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 px-1.5 py-0.5 rounded-md">
                        Saved locally only
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-2 text-slate-400 hover:text-brand-navy dark:hover:text-zinc-200 hover:bg-[#F5F5F7] dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-8 space-y-8 flex-1">
                {/* Hero preview in the drawer */}
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-[#e8e8ed] dark:border-neutral-800 relative shadow-xs">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Typography info Block */}
                <div className="space-y-4">
                  <div>
                    <span className="font-sans text-[11px] font-semibold tracking-wider text-brand-blue uppercase">
                      {activeProject.category}
                    </span>
                    <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-[#1d1d1f] dark:text-zinc-100 tracking-tight mt-1 leading-[1.12]">
                      {activeProject.title}
                    </h2>
                  </div>
                  
                  <div className="h-[2px] bg-[#0066ff] w-12 rounded-full" />
                  
                  <p className="text-base text-[#45464d] dark:text-zinc-300 leading-relaxed font-sans font-normal">
                    {activeProject.description}
                  </p>
                </div>

                {/* Apple Spec section list */}
                <div className="space-y-4 pt-6 border-t border-[#e8e8ed] dark:border-neutral-850">
                  <h4 className="font-sans font-bold text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                    Key Features & Executions
                  </h4>
                  <ul className="space-y-3.5">
                    {activeProject.details && activeProject.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex gap-3 items-start bg-[#F5F5F7]/60 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-[#e8e8ed] dark:border-neutral-800/60">
                        <CheckCircle className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
                        <span className="text-sm text-[#45464d] dark:text-zinc-300 font-normal leading-relaxed">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Box Footer contact link */}
              <div className="p-8 bg-[#F5F5F7] dark:bg-zinc-900/80 border-t border-[#e8e8ed] dark:border-neutral-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-brand-slate dark:text-zinc-400 uppercase tracking-wide">
                    Refined by ruan.dev
                  </p>
                  <p className="text-[11px] text-[#8e8e93] dark:text-zinc-500 mt-0.5">
                    Discussing premium bespoke design & development
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {activeProject.link && activeProject.link !== "#" && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-zinc-800 border border-[#e8e8ed] dark:border-neutral-700 hover:bg-[#FAF9F6] dark:hover:bg-zinc-700 text-brand-navy dark:text-zinc-100 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                    >
                      View Live Project <ArrowUpRight className="w-3.5 h-3.5 text-brand-blue" />
                    </a>
                  )}
                  <a
                    href="#contact"
                    onClick={() => {
                      setActiveProject(null);
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-brand-blue text-white hover:bg-brand-blue-hover px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_12px_rgba(0,102,255,0.15)] inline-flex items-center gap-2 cursor-pointer"
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
