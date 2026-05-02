import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Heart, CheckCircle2, Utensils } from "lucide-react";
import { useTranslation } from "react-i18next";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fade = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContentSection() {
  const { t } = useTranslation();
  const promiseItems = t("content.promise.items", { returnObjects: true }) || [];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#F6F0E6" }}>
      {/* Very faint dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle, #231F20 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      <div className="container mx-auto px-5 sm:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

          {/* ── Left: Stacked image collage ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-[460px] sm:h-[580px]"
          >
            {/* Big top-left: Temple image */}
            <motion.div variants={fade} className="col-span-1 row-span-2 relative rounded-[2rem] overflow-hidden group">
              <img
                src="/temple_1.webp"
                alt="Madurai temple"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                <p className="label-elegant text-white/60 mb-1">Heritage</p>
                <h3 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                  Madurai, Tamil Nadu
                </h3>
              </div>
            </motion.div>

            {/* Top-right: dark info card */}
            <motion.div variants={fade} className="relative rounded-[1.75rem] bg-brand-dark flex flex-col justify-end p-5 sm:p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
              <Utensils className="w-6 h-6 text-brand-secondary mb-3" />
              <p className="label-elegant text-white/30 mb-1">Specialty</p>
              <h3 className="font-display font-bold text-white text-base sm:text-xl uppercase tracking-wide">
                Authentic Tamil Cuisine
              </h3>
            </motion.div>

            {/* Bottom-right: temple 2 */}
            <motion.div variants={fade} className="relative rounded-[1.75rem] overflow-hidden group">
              <img
                src="/temple_2.webp"
                alt="Temple architecture"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ── Right: Editorial text column ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col justify-center space-y-7 sm:space-y-8"
          >
            <motion.div variants={fade} className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-brand-primary" />
                <span className="label-elegant text-brand-dark/40">Our Promise</span>
              </div>

              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-brand-dark uppercase tracking-tight leading-[0.88]">
                Crafted With{" "}
                <span
                  className="italic font-light text-brand-primary"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Passion
                </span>
              </h2>

              <p className="text-brand-dark/55 font-sans text-sm sm:text-base leading-relaxed max-w-sm">
                {t("content.founders.description")}
              </p>
            </motion.div>

            {/* Promise checklist */}
            <motion.ul variants={stagger} className="space-y-3">
              {promiseItems.map((item, i) => (
                <motion.li key={i} variants={fade} className="flex items-start gap-3 text-brand-dark/70 text-sm sm:text-base">
                  <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  </div>
                  <span className="font-sans font-medium">{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Founder story block */}
            <motion.div variants={fade}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-dark/5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand-primary/8 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-brand-primary fill-brand-primary" />
                </div>
                <p className="font-display text-base font-bold text-brand-dark uppercase tracking-wide">
                  {t("content.founders.title")}
                </p>
              </div>
              <p className="text-brand-dark/60 font-sans text-sm leading-relaxed">
                {t("content.founders.description")}
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-dark/5">
                <div className="h-px flex-1 bg-brand-dark/6" />
                <span className="label-elegant text-brand-primary">{t("content.founders.established")}</span>
                <div className="h-px flex-1 bg-brand-dark/6" />
              </div>
            </motion.div>

            {/* CTA Row */}
            <motion.div variants={fade} className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-brand-dark text-white font-bold uppercase text-xs tracking-[0.18em] hover:bg-brand-primary transition-all duration-300 shadow-lg hover:shadow-none"
              >
                View Full Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-brand-dark/12 text-brand-dark font-bold uppercase text-xs tracking-[0.18em] hover:bg-brand-dark/5 transition-all duration-300"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
