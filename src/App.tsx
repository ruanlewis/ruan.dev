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
import AdminPortal from "./components/AdminPortal";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import AllWorksInfinite from "./components/AllWorksInfinite";
import { PROJECTS } from "./data";
import { Project } from "./types";

export default function App() {
  const [view, setView] = useState<"home" | "all-works">("home");
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customParallaxImages, setCustomParallaxImages] = useState<Record<number, string>>({});

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

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
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    async function fetchCustomProjects() {
      let customApiProjects: Project[] = [];
      let isMockHidden = false;
      let hiddenApiProjectIds: string[] = [];
      let serverParallax: Record<number, string> = {};
      try {
        const response = await fetch("/api/projects");
        const resJson = await response.json();
        if (response.ok && resJson.success && Array.isArray(resJson.data)) {
          customApiProjects = resJson.data;
          isMockHidden = !!resJson.hideMockData;
          hiddenApiProjectIds = resJson.hiddenProjectIds || [];
          if (resJson.customParallaxImages) {
            serverParallax = resJson.customParallaxImages;
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote custom projects, falling back to local list:", err);
      }

      // Merge with browser localStorage custom projects for double offline-first resiliency
      let customLocalProjects: Project[] = [];
      let localHideMock = false;
      try {
        const localData = localStorage.getItem("local_custom_projects");
        if (localData) {
          customLocalProjects = JSON.parse(localData);
        }
        localHideMock = localStorage.getItem("local_hide_mock_data") === "true";
      } catch (err) {
        console.error("Local storage parsing mistake:", err);
      }

      let localParallax: Record<number, string> = {};
      try {
        const saved = localStorage.getItem("custom_zoom_images");
        if (saved) {
          localParallax = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Local storage parallax parse mistake:", e);
      }

      setCustomParallaxImages({ ...serverParallax, ...localParallax });

      const hideMock = isMockHidden || localHideMock;

      // Union of custom server & custom local list items
      const combinedCustoms = [...customApiProjects];
      customLocalProjects.forEach((lp) => {
        if (!combinedCustoms.some((ap) => ap.id === lp.id)) {
          combinedCustoms.push({ ...lp, isLocalOnly: true });
        }
      });

      // Merge on top of static base PROJECTS listing, with custom updates overriding by ID matching
      const baseProjects = hideMock ? [] : PROJECTS.filter((p) => !hiddenApiProjectIds.includes(p.id));
      const mergedList = [...baseProjects];
      combinedCustoms.forEach((customProj) => {
        const existingIdx = mergedList.findIndex((p) => p.id === customProj.id);
        if (existingIdx !== -1) {
          mergedList[existingIdx] = customProj;
        } else {
          // Prepend newly uploaded items so they are instantly visible at the head of the portfolio list!
          mergedList.unshift(customProj);
        }
      });

      setProjectsList(mergedList);
    }

    fetchCustomProjects();
  }, [refreshTrigger]);

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

  const handleProjectAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
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
            <Portfolio 
              projects={projectsList.slice(0, 5)} 
              customParallaxImages={customParallaxImages} 
              onViewAllClick={() => { setView("all-works"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              totalWorksCount={projectsList.length}
            />

            {/* Swiss grid typography philosophy */}
            <Philosophy />

            {/* Scroll-linked globe collaboration section */}
            <GlobeSection />

            {/* Modular workflow list */}
            <Workflow />

            {/* Custom contact card & inquiry form */}
            <Contact />

            {/* Site credits footer */}
            <Footer onAdminClick={() => setIsAdminOpen(true)} onPrivacyClick={() => setIsPrivacyOpen(true)} />
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
              onRefresh={handleProjectAdded}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secure systems password locked upload workspace portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProjectAdded={handleProjectAdded}
        projects={projectsList}
        customParallaxImages={customParallaxImages}
      />

      {/* Privacy Policy view modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
