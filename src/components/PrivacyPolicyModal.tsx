import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Mail, Phone, Calendar } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 dark:bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-neutral-900/80 rounded-2xl shadow-2xl p-6 md:p-8 text-left transition-colors duration-300 z-10 scrollbar-thin"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 border-b border-slate-100 dark:border-neutral-900/80 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-brand-blue rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl md:text-2xl text-brand-navy dark:text-zinc-100 tracking-tight">
                    Privacy Policy
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-brand-slate dark:text-zinc-500 mt-0.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Last updated: July 2, 2026</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-900 text-brand-slate hover:text-brand-navy dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-6 text-sm leading-relaxed text-[#475569] dark:text-zinc-400 font-sans">
              <section className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-slate-100/50 dark:border-neutral-900/50">
                <p>
                  This site (<strong className="text-brand-navy dark:text-zinc-200">ruan.dev</strong>) is operated by <strong>Ruan Lewis</strong>. This policy explains what information is collected when you visit or use this site, and how it is used.
                </p>
              </section>

              {/* SECTION 1 */}
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Information We Collect
                </h3>
                <p className="mb-2">
                  When you use the contact form on this site, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-zinc-400">
                  <li>Your name</li>
                  <li>Your email address</li>
                  <li>The project category and details you enter</li>
                  <li>Any other information you choose to submit</li>
                </ul>
                <p className="mt-3 text-xs italic text-brand-slate dark:text-zinc-500">
                  We do not collect payment information, and we do not use tracking cookies or third-party analytics beyond what is required for the site to function.
                </p>
              </div>

              {/* SECTION 2 */}
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  How We Use Your Information
                </h3>
                <p>
                  Information submitted through the contact form is used only to respond to your inquiry and discuss potential work. We do not sell, rent, or share your information with third parties for marketing purposes.
                </p>
              </div>

              {/* SECTION 3 */}
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Data Storage
                </h3>
                <p>
                  Submitted information is stored securely and is only accessible to the site owner. It is retained only as long as needed to respond to your inquiry, unless you request otherwise.
                </p>
              </div>

              {/* SECTION 4 */}
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Your Rights
                </h3>
                <p className="mb-2">
                  You can request at any time to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-zinc-400">
                  <li>See what information we have about you</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your information</li>
                </ul>
                <p className="mt-3">
                  To make a request, contact us at:{" "}
                  <a
                    href="mailto:lewisruan4@gmail.com"
                    className="text-brand-blue hover:underline font-semibold font-mono"
                  >
                    lewisruan4@gmail.com
                  </a>
                </p>
              </div>

              {/* SECTION 5 */}
              <div className="border-t border-slate-100 dark:border-neutral-900/80 pt-5 mt-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Contact
                </h3>
                <p className="mb-4">
                  If you have questions about this privacy policy, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <a
                    href="mailto:lewisruan4@gmail.com"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-neutral-900/40 bg-slate-50 dark:bg-zinc-900/20 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-colors text-brand-navy dark:text-zinc-300"
                  >
                    <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>lewisruan4@gmail.com</span>
                  </a>
                  <a
                    href="tel:+27645851770"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-neutral-900/40 bg-slate-50 dark:bg-zinc-900/20 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-colors text-brand-navy dark:text-zinc-300"
                  >
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>+27 64 585 1770</span>
                  </a>
                </div>
              </div>

              {/* SECTION 6 */}
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy dark:text-zinc-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Changes to this Policy
                </h3>
                <p>
                  This policy may be updated from time to time. Changes will be posted on this page with an updated date.
                </p>
              </div>
            </div>

            {/* Footer Close button */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-neutral-900/80 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
