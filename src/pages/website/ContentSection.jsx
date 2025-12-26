import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Star, Utensils, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export default function ContentSection() {
  const { t } = useTranslation();
  return (
    <section className="relative py-24 bg-brand-cream overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6"
          >
            <motion.div variants={fadeIn} className="col-span-2">
              <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/10 transition-colors duration-500" />
                <img
                  src="/temple_1.webp"
                  alt="Madurai temple gopuram"
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="font-display uppercase tracking-wide text-lg sm:text-xl font-bold">
                    Madurai Meenakshi
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm font-sans">
                    The soul of our inspiration
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl group h-full">
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-colors duration-500" />
                <img
                  src="/temple_2.webp"
                  alt="Temple architecture details"
                  className="w-full h-full min-h-[120px] sm:min-h-[160px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="h-full rounded-2xl md:rounded-[2rem] bg-brand-dark p-4 sm:p-5 md:p-6 flex flex-col justify-center text-brand-cream shadow-xl">
                <Utensils className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-secondary mb-3 sm:mb-4" />
                <h3 className="font-display uppercase tracking-wide text-base sm:text-lg font-bold mb-1 sm:mb-2 text-brand-secondary">
                  Authentic Taste
                </h3>
                <p className="text-brand-cream/80 text-xs sm:text-sm leading-relaxed font-sans">
                  Hand-ground spices and traditional recipes passed down through
                  generations.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6 sm:space-y-8"
          >
            {/* Promise Card */}
            <motion.div
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-[2rem] p-6 sm:p-7 md:p-8 shadow-xl border border-brand-dark/5 hover:border-brand-primary/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
              </div>
              <h3 className="font-display uppercase tracking-tight text-3xl sm:text-4xl font-bold text-brand-dark mb-3 sm:mb-4">
                {t("content.promise.title")}
              </h3>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {t("content.promise.items", { returnObjects: true }).map(
                  (item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-brand-dark/80 text-sm sm:text-base font-sans group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-full bg-brand-dark text-white hover:bg-brand-primary font-bold uppercase tracking-wide h-12 shadow-lg transition-all duration-300"
                >
                  <Link to="/menu">{t("content.promise.cta.menu")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-2 border-brand-dark/10 text-brand-dark hover:bg-brand-dark/5 font-bold uppercase tracking-wide h-12"
                >
                  <Link to="/contact">{t("content.promise.cta.contact")}</Link>
                </Button>
              </div>
            </motion.div>

            {/* Founders' Story Card */}
            <motion.div
              variants={fadeIn}
              className="bg-brand-secondary/10 rounded-2xl md:rounded-[2rem] p-6 sm:p-7 md:p-8 shadow-lg border border-brand-secondary/20"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary fill-brand-primary" />
                </div>
                <h3 className="font-display uppercase tracking-wide text-lg sm:text-xl font-bold text-brand-dark">
                  {t("content.founders.title")}
                </h3>
              </div>
              <p className="text-brand-dark/80 text-sm sm:text-base leading-relaxed mb-4 font-sans">
                {t("content.founders.description")}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-px flex-1 bg-brand-dark/10" />
                <span className="font-display text-xs font-bold text-brand-primary uppercase tracking-widest">
                  {t("content.founders.established")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
