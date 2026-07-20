import { motion } from "motion/react";
import { WORKFLOW } from "../data";

export default function Workflow() {
  return (
    <section id="process" className="py-32 md:py-40 bg-white dark:bg-[#08080a] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Workflow Line Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 md:mb-24 pb-6 border-b border-border-light dark:border-neutral-900/60">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-blue block">
              Methodology
            </span>
            <h2 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1d1d1f] dark:text-zinc-100 tracking-tighter leading-none mt-1">
              The Workflow.
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#8e8e93] dark:text-zinc-400 max-w-md leading-relaxed font-normal">
            Four cohesive stages meticulously followed to transform complex, ambitious product concepts into high-fidelity, high-performing reality.
          </p>
        </div>

        {/* 4-Column Methodology Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {WORKFLOW.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white dark:bg-zinc-900/40 border border-border-light dark:border-neutral-800/80 p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.055)] dark:hover:shadow-[0_24px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-400 ease-out cursor-default flex flex-col justify-between min-h-[250px]"
            >
              <div>
                {/* Step number set in standard Apple Badge shape */}
                <div className="w-10 h-10 bg-[#f4f7ff] dark:bg-brand-blue/10 border border-[#e2eafc] dark:border-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                  <span className="font-sans text-xs font-semibold text-brand-blue tracking-tight block">
                    {step.number}
                  </span>
                </div>

                {/* Step title and descriptor */}
                <div className="space-y-3">
                  <h3 className="font-sans font-semibold text-xl text-[#1d1d1f] dark:text-zinc-100 group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-brand-slate dark:text-zinc-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Decorative indicator dots matching system layout */}
              <div className="pt-6 flex justify-between items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-blue opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                <span className="text-[10px] font-sans font-medium text-[#8e8e93] dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Phase {step.number}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
