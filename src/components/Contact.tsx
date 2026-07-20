import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Check, 
  AlertCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Monitor, 
  Paintbrush, 
  ShoppingBag, 
  Layers, 
  Sparkles,
  Clock,
  Coins,
  ArrowUpRight
} from "lucide-react";

export default function Contact() {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanState, setScanState] = useState<"none" | "scanning" | "success">("none");
  const [errorMsg, setErrorMsg] = useState("");

  // Questionnaire form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectScope: "", // Set via Visual selection (Step 1)
    brief: "",        // Textarea (Step 2)
    timeline: "",     // Visual select (Step 3)
    budget: "",       // Visual select (Step 3)
    honeypot: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectScope = (scope: string) => {
    setFormData((prev) => ({ ...prev, projectScope: scope }));
    // Auto-advance with a tiny deliberate delay to make the active visual state satisfying
    setTimeout(() => {
      setCurrentStep(2);
    }, 280);
  };

  const handleSelectTimeline = (timeline: string) => {
    setFormData((prev) => ({ ...prev, timeline }));
  };

  const handleSelectBudget = (budget: string) => {
    console.log("[Service Package Selected] updated selection to:", budget);
    setFormData((prev) => ({ ...prev, budget }));
  };

  const openQuestionnaire = () => {
    setIsOpen(true);
    setCurrentStep(1);
    setScanState("none");
    setErrorMsg("");
  };

  const closeQuestionnaire = () => {
    setIsOpen(false);
  };

  const validateStep = () => {
    setErrorMsg("");
    if (currentStep === 1 && !formData.projectScope) {
      setErrorMsg("Please select an initiative category to proceed.");
      return false;
    }
    if (currentStep === 2 && formData.brief.trim().length < 10) {
      setErrorMsg("Please tell us a bit more (at least 10 characters) about your project goals.");
      return false;
    }
    if (currentStep === 3 && (!formData.timeline || !formData.budget)) {
      setErrorMsg("Please select both your target timeline and estimate budget.");
      return false;
    }
    if (currentStep === 4) {
      if (!formData.name.trim()) {
        setErrorMsg("Please enter your name so we can address you.");
        return false;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrorMsg("Please provide a valid email address where we can contact you.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setScanState("scanning");

    console.log("[Questionnaire Submission] Submitting inquiry with package:", formData.budget);

    // Format the questionnaire responses into a single beautiful message block
    const finalMessage = `
[Selected Service Package]
${formData.budget}

[Category/Initiative Needs]
${formData.projectScope}

[Target Timeline]
${formData.timeline}

[Mission Brief & Goals]
${formData.brief}
`.trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: finalMessage,
          honeypot: formData.honeypot
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Enforce the premium "scanning" duration for full Face ID effect, then trigger checkmark
        setTimeout(() => {
          setScanState("success");
          setIsSubmitting(false);
          // Clear inputs on success
          setFormData({
            name: "",
            email: "",
            projectScope: "",
            brief: "",
            timeline: "",
            budget: "",
            honeypot: ""
          });
        }, 1800);
      } else {
        setScanState("none");
        setIsSubmitting(false);
        setErrorMsg(result.error || "An error occurred while submitting. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setScanState("none");
      setIsSubmitting(false);
      setErrorMsg("Unable to connect to the server. Please try again later.");
    }
  };

  // Curated category items
  const CATEGORIES = [
    { name: "Web Application & Custom Sites", desc: "High-performance Vite/Next.js layers, elegant SEO, web products", icon: Monitor },
    { name: "Brand Direction & Design Systems", desc: "Identity, beautiful custom guidelines, visual design frameworks", icon: Paintbrush },
    { name: "Tailored E-Commerce Craft", desc: "Shopify/Stripe customized storefronts and intuitive payment checkouts", icon: ShoppingBag },
    { name: "Digital Products & Dashboards", desc: "Complex analytics portals, clean internal toolkits, software UI", icon: Layers },
    { name: "Other Creative Endeavors", desc: "Consulting, engineering consultation, tailored custom systems", icon: Sparkles }
  ];

  const TIMELINES = ["ASAP (Within weeks)", "1 - 2 Months", "3 - 6 Months", "Flexible / Ongoing"];
  const BUDGETS = [
    "Core (R3,000)",
    "Pro (R5,000)",
    "Studio (R7,000)",
    "Signature (From R10,000)"
  ];

  // Premium Apple-Like Packages Data
  interface PackageTheme {
    border: string;
    bg: string;
    text: string;
    accent: string;
    badge: string;
    btn: string;
    pill: string;
  }

  interface PackageInfo {
    id: string;
    name: string;
    displayName: string;
    price: string;
    subtitle: string;
    desc: string;
    features: string[];
    colorTheme: PackageTheme;
    badge?: string;
    isPopular?: boolean;
    isElite?: boolean;
  }

  const PREMIUM_PACKAGES: PackageInfo[] = [
    {
      id: "core",
      name: "Core",
      displayName: "Core (R3,000)",
      price: "R3,000",
      subtitle: "Single Page Launchpad",
      desc: "An elegant, single-screen responsive digital canvas for maximum focus and visual impact.",
      features: [
        "Tailored custom design",
        "Signature typography & layout",
        "Fluid entrance animations",
        "Local contact/inquiry mechanics",
        "Standard performance tuning",
      ],
      colorTheme: {
        border: "border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-zinc-700",
        bg: "bg-white dark:bg-zinc-900/40",
        text: "text-slate-900 dark:text-zinc-100",
        accent: "text-slate-500 dark:text-zinc-400",
        badge: "text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800",
        btn: "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-900 dark:text-zinc-100",
        pill: "bg-slate-400/10 dark:bg-zinc-400/10 text-slate-600 dark:text-zinc-400",
      },
    },
    {
      id: "pro",
      name: "Pro",
      displayName: "Pro (R5,000)",
      price: "R5,000",
      subtitle: "High-Performance Core",
      desc: "Bespoke multi-page architecture engineered for creative businesses and design-forward solutions.",
      features: [
        "Up to 5 custom layout pages",
        "Premium active micro-interactions",
        "Clean dynamic route setups",
        "Tailored SEO & speed optimization",
        "Dedicated server communication proxy",
      ],
      colorTheme: {
        border: "border-blue-100 dark:border-blue-950/50 hover:border-blue-300 dark:hover:border-blue-800",
        bg: "bg-white dark:bg-zinc-900/40",
        text: "text-blue-950 dark:text-blue-50",
        accent: "text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
        btn: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300",
        pill: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
    },
    {
      id: "studio",
      name: "Studio",
      displayName: "Studio (R7,000)",
      price: "R7,000",
      subtitle: "Bespoke Visual Product",
      desc: "Our gold standard. Boundary-pushing interactions, dynamic media handling, and extreme aesthetic polish.",
      isPopular: true,
      features: [
        "Unlimited custom pages",
        "Rich physics & canvas elements",
        "Supabase dynamic media setups",
        "Highly polished bespoke layout engine",
        "Advanced custom Admin Portal view",
      ],
      colorTheme: {
        border: "border-violet-200 dark:border-violet-900/60 hover:border-violet-400 dark:hover:border-violet-750 ring-1 ring-violet-500/20",
        bg: "bg-gradient-to-b from-white to-violet-50/[0.08] dark:from-zinc-900/80 dark:to-violet-950/[0.04]",
        text: "text-violet-950 dark:text-violet-50",
        accent: "text-violet-600 dark:text-violet-400",
        badge: "text-white bg-violet-600",
        btn: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-sm shadow-violet-500/10",
        pill: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      },
    },
    {
      id: "signature",
      name: "Signature",
      displayName: "Signature (From R10,000)",
      price: "From R10,000",
      subtitle: "Bespoke Elite Masterclass",
      desc: "Ultra-luxury, end-to-end digital mastery. Custom art direction, personalized software layouts, and priority execution.",
      isElite: true,
      features: [
        "Bespoke digital design consultation",
        "Tailored custom database integration",
        "Dedicated server-side systems",
        "24/7 client priority hotline",
        "Lifetime visual audit advisory",
      ],
      colorTheme: {
        border: "border-amber-200/60 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/[0.02]",
        bg: "bg-zinc-950 border border-amber-500/20",
        text: "text-amber-100",
        accent: "text-amber-400",
        badge: "text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 font-extrabold",
        btn: "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 font-black",
        pill: "bg-amber-400/10 text-amber-400",
      },
    },
  ];

  const handleSelectPackageFromGrid = (packageName: string) => {
    console.log("[Service Package Selected] selected from service offerings:", packageName);
    setFormData((prev) => ({ ...prev, budget: packageName }));
    setIsOpen(true);
    setCurrentStep(1); // Keep user at Step 1 of planner, but pre-populate package
    setScanState("none");
    setErrorMsg("");
  };

  return (
    <section id="contact" className="py-32 md:py-40 bg-gradient-to-b from-[#fafafa] to-white dark:from-[#08080a] dark:to-[#08080a] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Available Pill indicator */}
        <div className="inline-flex items-center gap-2 bg-white/40 dark:bg-brand-blue/[0.04] backdrop-blur-md border border-white/40 dark:border-brand-blue/20 px-4 py-2 rounded-full mb-8 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="font-sans text-[11px] font-medium tracking-wide uppercase text-brand-blue">
            Available for select projects
          </span>
        </div>

        {/* Oversized Email link anchor */}
        <div className="space-y-4">
          <a
            href="mailto:lewisruan4@gmail.com"
            className="inline-block max-w-full overflow-hidden text-ellipsis font-sans font-extrabold text-[#1d1d1f] dark:text-zinc-100 hover:text-brand-blue transition-colors duration-300 tracking-tighter select-all"
            style={{ fontSize: "clamp(22px, 6.5vw, 96px)", lineHeight: 1.1 }}
          >
            lewisruan4@gmail.com
          </a>
          <div className="h-[1px] bg-neutral-200/60 dark:bg-neutral-800/80 w-full max-w-md mx-auto" />
        </div>

        {/* Social anchors matching ruan.dev layout */}
        <div className="flex justify-center gap-8 mt-12 pb-16 flex-wrap">
          <a
            href="https://wa.me/27645851770"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50/45 dark:bg-emerald-950/10 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/20 px-3.5 py-1.5 rounded-full border border-emerald-200/40 dark:border-emerald-850/20 shadow-sm backdrop-blur-xs"
          >
            WhatsApp: +27 64 585 1770
          </a>
          <a
            href="https://instagram.com/builtbyruan"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 hover:text-brand-blue transition-colors py-1.5"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61591404452937"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 hover:text-brand-blue transition-colors py-1.5"
          >
            Facebook
          </a>
        </div>

        {/* PREMIUM DECK OF OFFERINGS */}
        <div className="mt-20 mb-24 text-left">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h3 className="font-sans font-black text-3xl sm:text-4xl text-[#1d1d1f] dark:text-zinc-50 tracking-tight">
              Bespoke Service Offerings
            </h3>
            <p className="font-sans text-sm text-brand-slate dark:text-zinc-400 leading-relaxed">
              Carefully curated creative suites in ZAR, tailored for dynamic performance, flawless responsiveness, and ultimate aesthetic precision.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {PREMIUM_PACKAGES.map((pkg) => {
              return (
                <div
                  key={pkg.id}
                  className={`pricing-card pricing-card-${pkg.id}`}
                >
                  {/* Card Content Header */}
                  <div className="flex-1 flex flex-col">
                    <span className="badge-custom text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xs w-fit">
                      {pkg.name}
                    </span>
                    
                    <div className="text-[12px] font-bold tracking-[0.06em] uppercase mt-4 mb-2 text-slate-500 dark:text-zinc-400">
                      {pkg.subtitle}
                    </div>

                    <h4 className={`font-serif text-[38px] font-semibold tracking-[-0.01em] my-2 leading-none ${
                      pkg.id === 'signature' 
                        ? 'bg-gradient-to-r from-[#f3e6b8] via-[#c9b877] to-[#e8d9a8] bg-clip-text text-transparent' 
                        : 'text-[#15171a] dark:text-white'
                    }`}>
                      {pkg.price}
                    </h4>

                    <p className={`text-[13.5px] leading-relaxed mb-6 min-h-[64px] ${
                      pkg.id === 'signature' ? 'text-[#a8a6a0]' : 'text-slate-500 dark:text-zinc-400'
                    }`}>
                      {pkg.desc}
                    </p>

                    <hr className={`border-t mb-6 ${
                      pkg.id === 'signature' ? 'border-[#3d3e42]' : 'border-[#e4e2dc] dark:border-neutral-800/60'
                    }`} />

                    {/* Features list */}
                    <ul className="space-y-3.5 flex-1">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[13.5px]">
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            className={`shrink-0 mt-1 stroke-[3] ${
                              pkg.id === 'signature' ? 'stroke-[#e8d9a8]' : 'stroke-[#5b4bd6]'
                            }`}
                          >
                            <path d="M4 12l5 5L20 6" />
                          </svg>
                          <span className={`leading-relaxed ${
                            pkg.id === 'signature' ? 'text-[#e0ded8]' : 'text-[#15171a] dark:text-zinc-300'
                          }`}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Get Started Button */}
                  <button
                    onClick={() => handleSelectPackageFromGrid(pkg.displayName)}
                    className="btn-custom mt-6 w-full py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-[0.03em] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95"
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* REPLACED EMBEDDED FORM WITH HIGH-END CTA DECK */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900/60 border border-[#e8e8ed] dark:border-neutral-800/80 p-8 md:p-12 rounded-[32px] text-center shadow-panel dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1d1d1f] dark:text-zinc-100 tracking-tight mb-3">
            Ready to Build Something Extraordinary?
          </h3>
          <p className="font-sans text-sm text-brand-slate dark:text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
            Launch our custom interactive project planner to outline your goals, timeline, and estimate budget in under two minutes.
          </p>

          <button
            onClick={openQuestionnaire}
            className="bg-brand-blue/90 hover:bg-brand-blue text-white font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_8px_24px_rgba(0,102,255,0.2)] dark:shadow-[0_8px_24px_rgba(0,102,255,0.15)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.35)] border border-white/20 backdrop-blur-sm active:scale-95 inline-flex items-center gap-2 cursor-pointer font-bold"
          >
            Start Project Planner <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* HIGH INTERACTIVITY POPUP MODAL */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              {/* Dark Ambient Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeQuestionnaire}
                className="absolute inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md"
              />

              {/* Questionnaire Window */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-neutral-800/80 rounded-[32px] w-full max-w-lg flex flex-col overflow-hidden shadow-2xl max-h-[90vh]"
              >
                {/* Visual Progress Bar */}
                {scanState === "none" && (
                  <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800/50 absolute top-0 left-0">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${(currentStep / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-brand-blue"
                    />
                  </div>
                )}

                {/* Header (Hide close btn if actively scanning or success to avoid interrupts) */}
                {scanState === "none" && (
                  <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-slate-100 dark:border-neutral-800/40 shrink-0">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-brand-blue uppercase tracking-widest block">
                        Project Planner
                      </span>
                      <span className="font-sans text-xs font-bold text-brand-slate dark:text-zinc-500">
                        Step {currentStep} of 4
                      </span>
                    </div>
                    <button
                      onClick={closeQuestionnaire}
                      className="p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Form / Scrollable Questionnaire Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar flex-grow">
                  <AnimatePresence mode="wait">
                    {scanState === "scanning" && (
                      <motion.div
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        {/* Apple-Style Face ID Scanning Bracket Animation */}
                        <div className="relative w-32 h-32 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/40 border border-slate-100/50 dark:border-neutral-800/50 rounded-[32px] shadow-sm overflow-hidden mb-6">
                          {/* Corner brackets */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-blue rounded-tl-md animate-pulse" />
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-brand-blue rounded-tr-md animate-pulse" />
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-brand-blue rounded-bl-md animate-pulse" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-blue rounded-br-md animate-pulse" />

                          {/* Inner scanning dashes */}
                          <div className="absolute inset-6 rounded-full border border-dashed border-brand-blue/30 animate-spin" style={{ animationDuration: '4s' }} />
                          <div className="absolute inset-9 rounded-full border border-dotted border-brand-blue/20 animate-spin" style={{ animationDuration: '8s' }} />

                          {/* Sweeping scanline */}
                          <motion.div
                            animate={{
                              y: [-38, 38, -38],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.8,
                              ease: "easeInOut",
                            }}
                            className="absolute left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-brand-blue to-transparent shadow-[0_0_10px_#0066ff] z-10"
                          />

                          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-transparent pointer-events-none" />
                        </div>

                        <h4 className="font-sans font-extrabold text-sm text-[#1d1d1f] dark:text-zinc-100 tracking-tight animate-pulse">
                          Transmitting Inquiry Details...
                        </h4>
                        <p className="font-sans text-[10px] text-brand-slate dark:text-zinc-450 mt-1.5 uppercase tracking-widest font-bold">
                          Securing Connection
                        </p>
                      </motion.div>
                    )}

                    {scanState === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-8 text-center"
                      >
                        {/* Apple Face ID Checkmark Success Animation */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15, stiffness: 100 }}
                          className="relative w-32 h-32 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-neutral-800 rounded-[32px] shadow-sm overflow-hidden mb-6"
                        >
                          {/* Green style brackets */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl-md" />
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr-md" />
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl-md" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br-md" />

                          {/* Outer soft breathing glow circle */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-5 rounded-full border-2 border-emerald-500/20"
                          />

                          {/* Draw Checkmark SVG */}
                          <svg
                            className="w-14 h-14 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <motion.path
                              d="M20 6L9 17l-5-5"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 140,
                                damping: 14,
                                delay: 0.25
                              }}
                            />
                          </svg>

                          {/* Ping ripple effect */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.5, 1.8] }}
                            transition={{ duration: 0.85, ease: "easeOut" }}
                            className="absolute w-20 h-20 rounded-full bg-emerald-500/10 pointer-events-none"
                          />
                        </motion.div>

                        <h4 className="font-sans font-black text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                          Verification Successful
                        </h4>
                        <p className="font-sans text-xs text-brand-slate dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
                          Your creative initiative has been securely logged. Ruan will review and reach out within 24 business hours.
                        </p>

                        <button
                          onClick={closeQuestionnaire}
                          className="mt-8 bg-zinc-900/90 dark:bg-white/90 hover:bg-zinc-900 dark:hover:bg-white text-white dark:text-zinc-900 font-sans text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full border border-white/20 dark:border-white/10 shadow-md backdrop-blur-xs transition-all cursor-pointer"
                        >
                          Close Panel
                        </button>
                      </motion.div>
                    )}

                    {scanState === "none" && (
                      <div className="space-y-6">
                        
                        {/* STEP 1: CATEGORY SELECTION */}
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <h3 className="font-sans font-extrabold text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                                What is your creative initiative?
                              </h3>
                              <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-450 leading-relaxed">
                                Select the core category that best outlines your needs. We can adjust this later.
                              </p>
                            </div>

                            <div className="space-y-2.5 pt-2">
                              {CATEGORIES.map((cat, i) => {
                                const isSelected = formData.projectScope === cat.name;
                                const IconComp = cat.icon;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelectScope(cat.name)}
                                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group relative ${
                                      isSelected
                                        ? "bg-brand-blue/[0.03] dark:bg-brand-blue/5 border-brand-blue ring-1 ring-brand-blue"
                                        : "bg-[#F5F5F7] dark:bg-zinc-800/80 border-transparent hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-750"
                                    }`}
                                  >
                                    <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                                      isSelected 
                                        ? "bg-brand-blue text-white" 
                                        : "bg-white dark:bg-zinc-900 text-brand-slate dark:text-zinc-300 group-hover:text-brand-blue"
                                    }`}>
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <h4 className="font-sans font-bold text-xs text-[#1d1d1f] dark:text-zinc-100">
                                        {cat.name}
                                      </h4>
                                      <p className="font-sans text-[10px] text-slate-500 dark:text-zinc-450 leading-normal">
                                        {cat.desc}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white scale-100 transition-transform">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: MISSION BRIEF */}
                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <h3 className="font-sans font-extrabold text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                                Describe the mission brief.
                              </h3>
                              <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-450 leading-relaxed">
                                Outline your targets, goals, inspirations, or core issues. What should we build?
                              </p>
                            </div>

                            <div className="relative pt-2">
                              <textarea
                                name="brief"
                                rows={6}
                                value={formData.brief}
                                onChange={handleInputChange}
                                placeholder="Describe your creative initiative, timeline thoughts, inspirations, or any initial thoughts..."
                                className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-4 px-4 text-xs text-[#1d1d1f] dark:text-zinc-100 rounded-2xl transition-all outline-none resize-none leading-relaxed"
                              />
                              <div className="absolute right-3 bottom-3 font-mono text-[9px] text-slate-400 dark:text-zinc-500">
                                {formData.brief.length} characters
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: TIMELINE & BUDGET */}
                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-5"
                          >
                            <div className="space-y-1">
                              <h3 className="font-sans font-extrabold text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                                Timeline & Budget framework.
                              </h3>
                              <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-450 leading-relaxed">
                                Aligning on these factors early ensures we deliver custom high-fidelity results.
                              </p>
                            </div>

                            {/* Timeline choices */}
                            <div className="space-y-2">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400 block pl-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-brand-blue" /> Target Timeline
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                {TIMELINES.map((time, idx) => {
                                  const isSelected = formData.timeline === time;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => handleSelectTimeline(time)}
                                      className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                                        isSelected
                                          ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                                          : "bg-[#F5F5F7] dark:bg-zinc-800/80 border-transparent text-brand-navy dark:text-zinc-200 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-750"
                                      }`}
                                    >
                                      {time}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Budget choices */}
                            <div className="space-y-3 pt-1">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-400 block pl-1 flex items-center gap-1.5">
                                <Coins className="w-3.5 h-3.5 text-brand-blue" /> Selected Service Package
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {PREMIUM_PACKAGES.map((pkg) => {
                                  const isSelected = formData.budget === pkg.displayName;
                                  
                                  // Determine visual style depending on selected state & package type
                                  let buttonStyle = "bg-[#F5F5F7] dark:bg-zinc-800/80 text-brand-navy dark:text-zinc-200 border-transparent hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-750";
                                  if (isSelected) {
                                    if (pkg.id === "core") {
                                      buttonStyle = "bg-slate-600 dark:bg-zinc-700 text-white border-slate-600 dark:border-zinc-700 shadow-sm";
                                    } else if (pkg.id === "pro") {
                                      buttonStyle = "bg-blue-600 text-white border-blue-600 shadow-sm";
                                    } else if (pkg.id === "studio") {
                                      buttonStyle = "bg-violet-600 text-white border-violet-600 shadow-sm";
                                    } else if (pkg.id === "signature") {
                                      buttonStyle = "bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 border-amber-400 dark:border-amber-500 font-extrabold shadow-sm";
                                    }
                                  }

                                  return (
                                    <button
                                      key={pkg.id}
                                      type="button"
                                      onClick={() => handleSelectBudget(pkg.displayName)}
                                      className={`p-3.5 rounded-2xl border text-left transition-all text-xs font-semibold cursor-pointer relative overflow-hidden flex flex-col justify-between h-[84px] group ${buttonStyle}`}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className="font-sans font-black tracking-tight text-xs">
                                          {pkg.name}
                                        </span>
                                        {pkg.isPopular && (
                                          <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-violet-500/10 text-violet-600 dark:text-violet-400"}`}>
                                            Popular
                                          </span>
                                        )}
                                        {pkg.isElite && (
                                          <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isSelected ? "bg-black/10 text-zinc-950" : "bg-amber-500/10 text-amber-500"}`}>
                                            Elite
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-baseline justify-between w-full mt-2">
                                        <span className={`text-[10px] font-normal leading-tight ${isSelected ? "text-white/80 dark:text-zinc-200" : "text-slate-500 dark:text-zinc-400"}`}>
                                          {pkg.subtitle}
                                        </span>
                                        <span className="font-sans font-extrabold text-[13px] tracking-tight shrink-0">
                                          {pkg.price}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 4: CONTACT INFO */}
                        {currentStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <h3 className="font-sans font-extrabold text-lg text-[#1d1d1f] dark:text-zinc-100 tracking-tight">
                                Introduce yourself.
                              </h3>
                              <p className="font-sans text-[11px] text-brand-slate dark:text-zinc-450 leading-relaxed">
                                Where should Ruan reach out once your creative inquiry is validated?
                              </p>
                            </div>

                            <div className="space-y-4 pt-2">
                              {/* Honeypot anti-spam field */}
                              <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                                <label>Do not fill this out if you are human</label>
                                <input
                                  type="text"
                                  name="honeypot"
                                  value={formData.honeypot}
                                  onChange={handleInputChange}
                                  tabIndex={-1}
                                  autoComplete="off"
                                />
                              </div>

                              <div className="relative">
                                <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-450 pl-1 mb-1.5">
                                  Your Full Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Lewis Ruan"
                                  className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3.5 px-4 text-xs text-[#1d1d1f] dark:text-zinc-100 rounded-xl transition-all outline-none"
                                />
                              </div>

                              <div className="relative">
                                <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-slate dark:text-zinc-450 pl-1 mb-1.5">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="e.g. partner@company.com"
                                  className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3.5 px-4 text-xs text-[#1d1d1f] dark:text-zinc-100 rounded-xl transition-all outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Error Alert Box inside Step Panel */}
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 rounded-xl text-left"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                          </motion.div>
                        )}

                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Footer Controls */}
                {scanState === "none" && (
                  <div className="p-4 bg-slate-50 dark:bg-zinc-950/30 border-t border-slate-100 dark:border-neutral-800/40 flex items-center justify-between shrink-0">
                    {/* Back Button */}
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-brand-slate dark:text-zinc-300 font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Next / Submit Button */}
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-brand-blue hover:bg-brand-blue-hover text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleFormSubmit}
                        className="bg-brand-blue hover:bg-brand-blue-hover text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-98"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Submit Planner <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
