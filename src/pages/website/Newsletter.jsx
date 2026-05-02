import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Bell, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      setSuccess(true);
      toast.success(t("sections.newsletter.success_msg"), {
        description: "You're on the list! 🎉",
        duration: 4000,
      });
    }, 1500);
  };

  return (
    <section className="py-16 sm:py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-brand-primary rounded-[2rem] sm:rounded-[3rem] p-7 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-brand-secondary/10 pointer-events-none" />
          {/* Texture dots */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {t("sections.newsletter.badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold uppercase tracking-tight leading-tight"
            >
              {t("sections.newsletter.title_line1")} <br />
              {t("sections.newsletter.title_line2")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-white/75 font-sans leading-relaxed max-w-xl mx-auto"
            >
              {t("sections.newsletter.description")}
            </motion.p>

            {/* ─── Form / Success State ─── */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <p className="text-lg sm:text-xl font-display font-bold uppercase tracking-wide">
                    You're on the list!
                  </p>
                  <p className="text-white/65 text-sm">
                    We'll keep you updated with the latest offers and events.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2 mt-2"
                  >
                    Subscribe another email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto"
                >
                  <div className="relative flex-grow">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/35" />
                    <input
                      type="email"
                      placeholder={t("sections.newsletter.placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-14 sm:h-16 pl-13 pr-5 rounded-full bg-white text-brand-dark font-medium border-0 focus:ring-2 focus:ring-brand-secondary transition-all placeholder:text-brand-dark/35 text-sm sm:text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 sm:h-16 px-7 sm:px-10 rounded-full bg-brand-secondary text-brand-dark font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all shadow-lg hover:scale-105 text-sm shrink-0"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      t("sections.newsletter.button")
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {!success && (
              <p className="text-[10px] sm:text-xs text-white/35 uppercase tracking-widest">
                {t("sections.newsletter.footer_msg")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
