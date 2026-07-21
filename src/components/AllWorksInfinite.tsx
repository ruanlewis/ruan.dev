import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Search, Grid, Layers, CheckCircle } from "lucide-react";
import { Project } from "../types";

interface AllWorksInfiniteProps {
  projects: Project[];
  customParallaxImages?: Record<number, string>;
  onBack: () => void;
}

export default function AllWorksInfinite({ projects, onBack }: AllWorksInfiniteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter projects based on search query and category
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.year.includes(searchQuery);
    const matchesCategory = selectedCategory === "All" || p.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => {
    if (p.category.includes("•")) {
      return p.category.split("•")[0].trim();
    }
    return p.category.split(" ")[0].trim();
  })))].slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#08080a] text-brand-navy dark:text-zinc-100 transition-colors duration-300 pb-24 font-sans selection:bg-brand-blue selection:text-white">
      
      {/* Premium Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/80 dark:bg-[#08080a]/80 backdrop-blur-md border-b border-slate-100 dark:border-neutral-900/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-20 flex justify-between items-center gap-4">
          
          {/* Back button */}
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-150/80 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-zinc-200 hover:text-brand-blue dark:hover:text-blue-400 hover:border-brand-blue/30 dark:hover:border-blue-900/40 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="inline sm:hidden">Back</span>
          </button>

          {/* Logo brand signature */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-display font-black text-sm sm:text-lg tracking-tighter uppercase text-[#111111] dark:text-white">
              ruan.dev
            </span>
            <span className="font-mono text-[8px] bg-brand-blue/10 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-brand-blue/10 dark:border-blue-500/10 shadow-xs">
              <span className="hidden sm:inline">Works </span>Archive
            </span>
          </div>

          <div className="hidden md:block w-24 md:w-32" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6">
        <div className="border-b border-slate-100 dark:border-neutral-900/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-blue font-bold flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" /> Curated Showcase
            </span>
            <h1 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-[#111111] dark:text-white tracking-tighter leading-tight">
              All Crafted Works.
            </h1>
            <p className="font-sans text-sm text-brand-slate dark:text-zinc-400 leading-relaxed">
              Explore the comprehensive catalog of custom digital designs, technical structures, and aesthetic layouts.
            </p>
          </div>

          {/* Quick Stats Block */}
          <div className="bg-white dark:bg-[#121214] border border-slate-150 dark:border-neutral-800/80 p-4.5 rounded-2xl flex items-center gap-4.5 shadow-xs shrink-0">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-brand-blue dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
                Total Archive
              </span>
              <h4 className="font-sans font-black text-xl text-brand-navy dark:text-zinc-200 tracking-tight">
                {projects.length} Templates
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Search Bar Controls */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Field */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search case studies by title, year, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-brand-navy dark:text-zinc-100 rounded-xl outline-none focus:border-brand-blue shadow-xs transition-colors"
            />
          </div>

          {/* Category Quick Tags */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-brand-blue/95 hover:bg-brand-blue text-white shadow-sm border border-brand-blue"
                    : "bg-white/40 dark:bg-[#121214]/40 backdrop-blur-md border border-slate-200/80 dark:border-neutral-800 text-brand-slate hover:text-brand-navy dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Clean Grid Gallery */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              return (
                <motion.div
                  key={project.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-neutral-800/80 rounded-[24px] overflow-hidden hover:border-brand-blue/30 dark:hover:border-blue-900/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Visual Preview */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-zinc-700">
                        <Layers className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-5.5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline gap-2 mb-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-widest font-black text-brand-blue">
                          {project.year} Case Study
                        </span>
                        <span className="font-sans text-[8px] uppercase font-black tracking-wider text-slate-400 dark:text-zinc-500">
                          Index No. {index + 1}
                        </span>
                      </div>
                      <h3 className="font-sans font-black text-base text-[#111111] dark:text-zinc-100 tracking-tight line-clamp-1 group-hover:text-brand-blue transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {project.description || "Premium signature layout emphasizing strict structural order and typography contrast."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-neutral-900/60 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-slate-500 dark:text-zinc-500 truncate max-w-[70%]">
                        {project.category}
                      </span>
                      <span className="font-sans text-[10px] font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                        Signature
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-[32px] bg-white/40 dark:bg-zinc-900/10 space-y-4">
            <Layers className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto animate-pulse" />
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="font-sans font-extrabold text-sm text-brand-navy dark:text-zinc-200">
                Nothing here yet
              </h3>
              <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 leading-relaxed">
                There are no case studies matching the search query or active category filter.
              </p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
