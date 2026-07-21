/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicIsland from "./components/DynamicIsland";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Philosophy from "./components/Philosophy";
import GlobeSection from "./components/GlobeSection";
import Workflow from "./components/Workflow";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import AllWorksInfinite from "./components/AllWorksInfinite";
import { Project } from "./types";
import { supabase } from "./supabase";

export default function App() {
  const [view, setView] = useState<"home" | "all-works">("home");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [customParallaxImages, setCustomParallaxImages] = useState<Record<number, string>>({});

  const [hasUserOverride, setHasUserOverride] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("theme_user_override");
    }
    return false;
  });

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved && localStorage.getItem("theme_user_override")) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Automatically listen to system light/dark mode preference changes in real time
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!hasUserOverride) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Modern matchMedia listener with legacy fallback support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [hasUserOverride]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setHasUserOverride(true);
    localStorage.setItem("theme_user_override", "true");
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    async function fetchCustomProjects() {
      let customApiProjects: Project[] = [];
      let serverParallax: Record<number, string> = {};

      try {
        // Fetch projects directly from Supabase with fallback if ordering by created_at fails
        let dbProjects: any[] | null = null;
        let projectsError: any = null;

        const res1 = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: true });

        if (!res1.error && res1.data) {
          dbProjects = res1.data;
        } else {
          // Fallback: select without ordering if created_at column doesn't exist
          const res2 = await supabase.from("projects").select("*");
          if (!res2.error && res2.data) {
            dbProjects = res2.data;
          } else {
            projectsError = res1.error || res2.error;
          }
        }

        if (dbProjects) {
          customApiProjects = dbProjects
            .filter((p: any) => !p.is_hidden && !p.hidden)
            .map((p: any) => {
              let parsedDetails: string[] = [];
              if (Array.isArray(p.details)) {
                parsedDetails = p.details;
              } else if (typeof p.details === "string") {
                try {
                  const json = JSON.parse(p.details);
                  parsedDetails = Array.isArray(json) ? json : [p.details];
                } catch (e) {
                  parsedDetails = p.details ? [p.details] : [];
                }
              }

              return {
                id: String(p.id),
                title: p.title || p.name || p.project_name || "Untitled Project",
                category: p.category || p.tag || p.type || "Design",
                year: p.year ? String(p.year) : (p.created_at ? new Date(p.created_at).getFullYear().toString() : "2026"),
                image: p.image || p.image_url || p.imageUrl || p.cover_image || p.thumbnail || "",
                alt: p.alt || p.title || p.name || "Project image",
                description: p.description || p.desc || p.summary || "",
                details: parsedDetails,
                link: p.link || p.url || p.website || ""
              };
            });
        } else if (projectsError) {
          console.warn("Error fetching projects from Supabase:", projectsError);
        }

        // Fetch settings directly from Supabase
        const { data: settingsData, error: settingsError } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "app_settings")
          .single();

        if (!settingsError && settingsData && settingsData.value) {
          const val = settingsData.value;
          if (val.customParallaxImages) {
            serverParallax = val.customParallaxImages;
          }
        } else if (settingsError) {
          console.warn("Error fetching settings from Supabase:", settingsError.message);
        }

        // Fetch parallax_images directly from Supabase
        const { data: parallaxData, error: parallaxError } = await supabase
          .from("parallax_images")
          .select("slot_idx, image_url");

        if (!parallaxError && parallaxData) {
          parallaxData.forEach((row: any) => {
            serverParallax[row.slot_idx] = row.image_url;
          });
        } else if (parallaxError) {
          console.warn("Error fetching parallax_images from Supabase:", parallaxError.message);
        }
      } catch (err) {
        console.warn("Could not fetch remote custom projects from Supabase:", err);
      }

      setCustomParallaxImages(serverParallax);
      setProjectsList(customApiProjects);
      setIsLoading(false);
    }

    fetchCustomProjects();

    // Subscribe to real-time database changes for seamless live updates
    const projectsChannel = supabase
      .channel("live-projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchCustomProjects();
        }
      )
      .subscribe();

    const parallaxChannel = supabase
      .channel("live-parallax")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "parallax_images" },
        () => {
          fetchCustomProjects();
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel("live-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        () => {
          fetchCustomProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(parallaxChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const triggerFocusInquiry = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      
      // Delay slightly for smooth scroll to complete before focusing input field
      setTimeout(() => {
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (nameInput) {
          nameInput.focus();
        }
      }, 700);
    }
  };

  const triggerScrollToPortfolio = () => {
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative font-sans text-brand-navy selection:bg-brand-blue selection:text-white antialiased min-h-screen bg-white dark:bg-[#08080a] transition-colors duration-300">
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Floating Dynamic Island Navigation Pill */}
            <DynamicIsland onTalkClick={triggerFocusInquiry} theme={theme} onThemeToggle={toggleTheme} />

            {/* Hero presentation screen */}
            <Hero onPortfolioView={triggerScrollToPortfolio} />

            {/* Selective works showcases (Max 5 photos/projects on the main page) */}
            {isLoading ? (
              <section id="portfolio" className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-[1400px] mx-auto min-h-[500px]">
                <div className="animate-pulse space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 dark:border-white/10 pb-8">
                    <div>
                      <div className="h-4 w-28 bg-black/10 dark:bg-white/10 rounded mb-3" />
                      <div className="h-10 w-64 bg-black/10 dark:bg-white/10 rounded" />
                    </div>
                    <div className="h-8 w-36 bg-black/10 dark:bg-white/10 rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    <div className="h-[420px] bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10" />
                    <div className="h-[420px] bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hidden lg:block" />
                  </div>
                </div>
              </section>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Portfolio 
                  projects={projectsList.slice(0, 5)} 
                  customParallaxImages={customParallaxImages} 
                  onViewAllClick={() => { setView("all-works"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                  totalWorksCount={projectsList.length}
                />
              </motion.div>
            )}

            {/* Swiss grid typography philosophy */}
            <Philosophy />

            {/* Scroll-linked globe collaboration section */}
            <GlobeSection />

            {/* Modular workflow list */}
            <Workflow />

            {/* Custom contact card & inquiry form */}
            <Contact />

            {/* Site credits footer */}
            <Footer onPrivacyClick={() => setIsPrivacyOpen(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="all-works-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AllWorksInfinite 
              projects={projectsList} 
              customParallaxImages={customParallaxImages} 
              onBack={() => { setView("home"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy view modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
