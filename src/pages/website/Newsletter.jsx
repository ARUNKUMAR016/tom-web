import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useTranslation } from "react-i18next";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success(t("sections.newsletter.success_msg"));
    }, 1500);
  };

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-brand-primary rounded-[3rem] p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
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
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight"
            >
              {t("sections.newsletter.title_line1")} <br />{" "}
              {t("sections.newsletter.title_line2")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/80 font-sans leading-relaxed"
            >
              {t("sections.newsletter.description")}
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <div className="relative flex-grow">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/40" />
                <input
                  type="email"
                  placeholder={t("sections.newsletter.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-16 pl-14 pr-6 rounded-full bg-white text-brand-dark font-medium border-0 focus:ring-2 focus:ring-brand-secondary transition-all placeholder:text-brand-dark/40"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-16 px-10 rounded-full bg-brand-secondary text-brand-dark font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all shadow-lg hover:scale-105"
              >
                {loading
                  ? t("sections.newsletter.joining")
                  : t("sections.newsletter.button")}
              </Button>
            </motion.form>

            <p className="text-xs text-white/40 uppercase tracking-widest mt-6">
              {t("sections.newsletter.footer_msg")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
