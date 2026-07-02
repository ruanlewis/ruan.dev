import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Sun, Moon, Menu, X } from "lucide-react";

interface DynamicIslandProps {
  onTalkClick: () => void;
  theme?: string;
  onThemeToggle?: () => void;
}

export default function DynamicIsland({ onTalkClick, theme, onThemeToggle }: DynamicIslandProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";
  const glassBg = isDark ? "rgba(12, 12, 14, 0.72)" : "rgba(255, 255, 255, 0.72)";
  const glassBorder = isDark ? "rgba(63, 63, 70, 0.25)" : "rgba(232, 232, 237, 0.5)";
  const glassShadow = isDark ? "0 4px 20px -2px rgba(0, 0, 0, 0.4)" : "0 4px 20px -2px rgba(0, 0, 0, 0.04)";

  const mobileGlassBg = isDark ? "rgba(12, 12, 14, 0.92)" : "rgba(255, 255, 255, 0.95)";
  const mobileGlassBorder = isDark ? "rgba(63, 63, 70, 0.35)" : "rgba(232, 232, 237, 0.8)";
  const mobileGlassShadow = isDark ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)" : "0 4px 20px -2px rgba(0, 0, 0, 0.08)";

  // Track scroll position using requestAnimationFrame for perfect performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Determine if page is scrolled past hero
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ["home", "portfolio", "about", "process", "contact"];
          const scrollPosition = window.scrollY + window.innerHeight * 0.3; // Trigger a bit earlier

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const top = element.offsetTop;
              const height = element.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call once initially to set correct background state on hard refreshes
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Works", id: "portfolio" },
    { label: "Philosophy", id: "about" },
    { label: "Workflow", id: "process" },
  ];

  return (
    <>
      {/* ================= DESKTOP HYBRID NAVIGATION (md:flex) ================= */}
      <div className="hidden md:block">
        {/* Left Floating Logo Cluster */}
        <div 
          className="fixed top-6 left-8 lg:left-12 z-50 pointer-events-auto"
        >
          <motion.div
            animate={{
              backgroundColor: isScrolled ? glassBg : "rgba(255, 255, 255, 0)",
              backdropFilter: isScrolled ? "blur(14px)" : "blur(0px)",
              borderColor: isScrolled ? glassBorder : "rgba(232, 232, 237, 0)",
              boxShadow: isScrolled ? glassShadow : "0 4px 20px -2px rgba(0, 0, 0, 0)",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2.5 px-4.5 py-2 rounded-full border dark:border-neutral-800/30 dark:shadow-none"
          >
            <a 
              href="#home" 
              onClick={(e) => handleLinkClick(e, "home")}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              {/* Premium Inline Custom SVG Logo */}
              <div className="w-5.5 h-5.5 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-full h-full fill-current">
                  <path d="M 1307,1331 L 1309,1336 L 1516,1589 L 1758,1589 L 1763,1585 L 1761,1580 L 1459,1209 L 1456,1209 Z"/>
                  <path d="M 1055,710 L 589,710 L 590,1589 L 784,1589 L 785,907 L 1055,905 Z"/>
                  <path d="M 605,314 L 736,476 L 1185,475 L 1236,482 L 1287,499 L 1344,533 L 1386,577 L 1410,623 L 1418,658 L 1415,713 L 1400,752 L 1373,791 L 1342,822 L 985,1102 L 986,1357 L 1485,955 L 1546,892 L 1598,810 L 1620,743 L 1624,656 L 1607,581 L 1563,497 L 1492,422 L 1392,360 L 1299,328 L 1188,313 Z"/>
                </svg>
              </div>
              <span className="font-sans font-extrabold text-[11px] tracking-[0.16em] uppercase text-neutral-900 dark:text-zinc-100">
                ruan.dev
              </span>
            </a>
          </motion.div>
        </div>

        {/* Right Floating Nav Controls Cluster */}
        <div 
          className="fixed top-6 right-8 lg:right-12 z-50 pointer-events-auto font-sans"
        >
          <motion.div
            animate={{
              backgroundColor: isScrolled ? glassBg : "rgba(255, 255, 255, 0)",
              backdropFilter: isScrolled ? "blur(14px)" : "blur(0px)",
              borderColor: isScrolled ? glassBorder : "rgba(232, 232, 237, 0)",
              boxShadow: isScrolled ? glassShadow : "0 4px 20px -2px rgba(0, 0, 0, 0)",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-7 px-6 py-2 rounded-full border dark:border-neutral-800/30 dark:shadow-none"
          >
            {/* Nav links with minimalist line indicator */}
            <div className="flex items-center gap-6.5">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-300 relative py-1 cursor-pointer ${
                    activeSection === item.id
                      ? "text-brand-blue"
                      : "text-[#8e8e93] hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="desktop-active-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-blue rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Practical Utilities separator vertical line */}
            <div className="w-[1px] h-3.5 bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className="p-1 text-[#8e8e93] hover:text-neutral-900 dark:hover:text-white rounded-full cursor-pointer transition-colors"
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Inquire Action trigger */}
              <button
                onClick={onTalkClick}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
              >
                Inquire <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION (max-md:flex) ================= */}
      <div className="block md:hidden fixed top-4 left-4 right-4 z-50 pointer-events-auto">
        <motion.div
          animate={{
            backgroundColor: isScrolled || mobileMenuOpen ? mobileGlassBg : "rgba(255, 255, 255, 0)",
            backdropFilter: isScrolled || mobileMenuOpen ? "blur(14px)" : "blur(0px)",
            borderColor: isScrolled || mobileMenuOpen ? mobileGlassBorder : "rgba(232, 232, 237, 0)",
            boxShadow: isScrolled || mobileMenuOpen ? mobileGlassShadow : "0 4px 20px -2px rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.3 }}
          className="w-full px-4.5 py-3 rounded-2xl border flex items-center justify-between dark:border-neutral-900/80"
        >
          {/* Logo brand */}
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, "home")}
            className="flex items-center gap-2"
          >
            <div className="w-5.5 h-5.5 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-full h-full fill-current">
                <path d="M 1307,1331 L 1309,1336 L 1516,1589 L 1758,1589 L 1763,1585 L 1761,1580 L 1459,1209 L 1456,1209 Z"/>
                <path d="M 1055,710 L 589,710 L 590,1589 L 784,1589 L 785,907 L 1055,905 Z"/>
                <path d="M 605,314 L 736,476 L 1185,475 L 1236,482 L 1287,499 L 1344,533 L 1386,577 L 1410,623 L 1418,658 L 1415,713 L 1400,752 L 1373,791 L 1342,822 L 985,1102 L 986,1357 L 1485,955 L 1546,892 L 1598,810 L 1620,743 L 1624,656 L 1607,581 L 1563,497 L 1492,422 L 1392,360 L 1299,328 L 1188,313 Z"/>
              </svg>
            </div>
            <span className="font-sans font-extrabold text-[10px] tracking-[0.16em] uppercase text-neutral-900 dark:text-zinc-100">
              ruan.dev
            </span>
          </a>

          {/* Quick theme toggle + Menu triggers */}
          <div className="flex items-center gap-3">
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="p-1.5 text-brand-slate hover:text-neutral-900 dark:hover:text-white rounded-full cursor-pointer transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-900 dark:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Dropdown mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[102%] mt-1 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-900/80 rounded-2xl shadow-xl p-4 flex flex-col gap-3 z-40"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`w-full text-left py-2.5 px-3 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                    activeSection === item.id
                      ? "text-brand-blue bg-[#F5F5F7] dark:bg-zinc-900"
                      : "text-brand-slate hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="h-[1px] bg-neutral-100 dark:bg-neutral-900 my-1" />

              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  onTalkClick();
                }}
                className="w-full bg-brand-blue text-white py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1"
              >
                Inquire <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
