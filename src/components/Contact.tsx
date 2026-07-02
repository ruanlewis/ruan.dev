import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectScope: "",
    brief: "",
    honeypot: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.brief) {
      setErrorMsg("Please fill in your name, email, and brief project details.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `${formData.projectScope ? `[Category: ${formData.projectScope}] ` : ""}${formData.brief}`,
          honeypot: formData.honeypot
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          projectScope: "",
          brief: "",
          honeypot: ""
        });
        setTimeout(() => setSuccess(false), 8000);
      } else {
        setErrorMsg(result.error || "An error occurred while submitting your message. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg("Unable to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-[#fafafa] to-white dark:from-[#08080a] dark:to-[#08080a] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Available Pill indicator */}
        <div className="inline-flex items-center gap-2 bg-[#f4f7ff] dark:bg-brand-blue/10 border border-[#e2eafc] dark:border-brand-blue/20 px-4 py-2 rounded-full mb-8">
          <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="font-sans text-[11px] font-medium tracking-wide uppercase text-brand-blue">
            Available for select projects
          </span>
        </div>

        {/* Oversized Email link anchor */}
        <div className="space-y-4">
          <a
            href="mailto:lewisruan4@gmail.com"
            className="block font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#1d1d1f] dark:text-zinc-100 hover:text-brand-blue transition-colors duration-300 tracking-tighter break-words select-all"
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
            className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 px-3.5 py-1.5 rounded-full border border-emerald-200/40 dark:border-emerald-800/30"
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

        {/* MINIMALIST INQUIRY FORM (Strict Spec Alignment) */}
        <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900/60 border border-[#e8e8ed] dark:border-neutral-800/80 p-8 md:p-12 rounded-[28px] text-left shadow-panel dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-8">
          <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1d1d1f] dark:text-zinc-100 tracking-tight mb-8">
            Start Collaboration.
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-6">
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
            {/* Input Name */}
            <div className="relative">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 pl-1">
                Your Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="What should I call you?"
                className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3 px-4 text-sm text-[#1d1d1f] dark:text-zinc-100 rounded-2xl transition-all outline-none mt-2"
              />
            </div>

            {/* Input Email */}
            <div className="relative">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 pl-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="hello@company.com"
                className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3 px-4 text-sm text-[#1d1d1f] dark:text-zinc-100 rounded-2xl transition-all outline-none mt-2"
              />
            </div>

            {/* Input Scope (Dropdown/Text) */}
            <div className="relative">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 pl-1">
                Project Category
              </label>
              <input
                type="text"
                name="projectScope"
                value={formData.projectScope}
                onChange={handleInputChange}
                placeholder="e.g. Web Design + Brand Direction"
                className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3 px-4 text-sm text-[#1d1d1f] dark:text-zinc-100 rounded-2xl transition-all outline-none mt-2"
              />
            </div>

            {/* Input Brief details */}
            <div className="relative">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-slate dark:text-zinc-400 pl-1">
                Project Mission Brief
              </label>
              <textarea
                name="brief"
                rows={3}
                value={formData.brief}
                onChange={handleInputChange}
                placeholder="Describe your goals, targets, estimate timeline..."
                className="w-full bg-[#F5F5F7] dark:bg-zinc-800/80 border border-transparent dark:border-neutral-800/40 hover:bg-[#e8e8ed]/60 dark:hover:bg-zinc-700/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/20 py-3 px-4 text-sm text-[#1d1d1f] dark:text-zinc-100 rounded-2xl transition-all outline-none mt-2 resize-none"
              />
            </div>

            {/* Success or Error states feedback inline with zero alert popups */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl"
                >
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Your message was delivered! Ruan will contact you within 24 working hours.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative bg-brand-blue hover:bg-brand-blue-hover text-white font-sans text-xs font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(0,102,255,0.2)] active:scale-98 flex justify-center items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Start Collaboration <Send className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
