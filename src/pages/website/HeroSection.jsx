import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import OpenStatus from "@/components/OpenStatus";
import { getSettings } from "../../api/settingsApi";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const [openingHours, setOpeningHours] = useState("");
  const [heroImage, setHeroImage] = useState("/temple_1.webp");
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 120]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  useEffect(() => {
    const ctrl = new AbortController();
    getSettings()
      .then((data) => {
        if (data.heroImage) setHeroImage(data.heroImage);
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const hours = data.openingHours?.find((h) => h.day === today);
        setOpeningHours(hours ? `${hours.open} – ${hours.close}` : t("common.closed"));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-brand-dark grain-overlay"
    >
      {/* ── Full-bleed background image with parallax ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt=""
          fetchPriority="high"
          loading="eager"
          className="w-full h-[115%] object-cover object-center opacity-40"
          style={{ willChange: "transform" }}
        />
        {/* Multi-layer vignette for editorial depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/98 via-brand-dark/70 to-brand-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/30" />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main content area */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16">
            <div className="grid lg:grid-cols-2 gap-0 lg:gap-20 items-center">

              {/* ── Left: Text Column ── */}
              <div className="space-y-7 sm:space-y-8 lg:space-y-10">
                {/* Eyebrow label */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center gap-3"
                >
                  <span className="w-8 h-px bg-brand-primary" />
                  <span className="label-elegant text-white/50 tracking-[0.3em] text-[10px]">
                    Authentic South Indian · Est. 2016
                  </span>
                </motion.div>

                {/* Main heading */}
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-black text-[15vw] sm:text-[11vw] lg:text-[8.5vw] leading-[0.85] tracking-tighter text-white uppercase"
                  >
                    Taste
                    <br />
                    <span className="text-brand-primary">of</span>{" "}
                    <span className="italic font-light text-white/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Madurai
                    </span>
                  </motion.h1>
                </div>

                {/* Sub-description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                  className="text-white/50 font-sans text-base sm:text-lg leading-relaxed max-w-md font-light"
                >
                  {t("hero.description")}
                </motion.p>

                {/* CTA Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                >
                  <Link
                    to="/menu"
                    className="group inline-flex items-center gap-3 px-7 py-4 sm:py-[18px] rounded-full bg-brand-primary text-white font-bold uppercase text-xs tracking-[0.18em] hover:bg-white hover:text-brand-dark transition-all duration-400 shadow-xl shadow-brand-primary/25 hover:shadow-none"
                  >
                    {t("nav.orderUs")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-7 py-4 sm:py-[18px] rounded-full border border-white/15 text-white/60 font-bold uppercase text-xs tracking-[0.18em] hover:border-white/40 hover:text-white transition-all duration-300"
                  >
                    {t("hero.cta_main")}
                  </Link>
                </motion.div>

                {/* Status row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-5 pt-2 sm:pt-4 border-t border-white/8"
                >
                  <div>
                    <p className="label-elegant text-white/30 mb-1">Today</p>
                    <p className="text-sm font-semibold text-white/70 tabular-nums">{openingHours || "—"}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <OpenStatus />
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="label-elegant text-white/30 mb-1">Rating</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-brand-secondary fill-brand-secondary" />
                      <span className="text-sm font-bold text-white/80">4.9</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── Right: Editorial image column (desktop only) ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:block"
              >
                {/* Main portrait frame */}
                <div className="relative w-full h-[70vh] max-h-[680px]">
                  <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
                    <img
                      src={heroImage}
                      alt="Taste of Madurai signature dish"
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover"
                      style={{ willChange: "transform" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  </div>

                  {/* Decorative border line */}
                  <div className="absolute inset-3 rounded-[2.5rem] border border-white/8 pointer-events-none" />

                  {/* Rating badge  — bottom left */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duplicate: "spring" }}
                    className="absolute -bottom-5 -left-6 glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-primary p-2.5 rounded-xl shrink-0">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xl leading-none">4.9</p>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          500+ Reviews
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Cuisine tag — top right */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="absolute top-6 -right-6 glass rounded-2xl p-3.5 border border-white/10"
                  >
                    <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Tamil</p>
                    <p className="text-white font-bold text-sm mt-0.5">Cuisine</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center gap-2 pb-8 z-20"
        >
          <span className="label-elegant text-white/25">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          <ChevronDown className="w-4 h-4 text-white/20 animate-bounce-subtle" />
        </motion.div>
      </div>

      {/* Bottom blade — transitions to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-brand-cream z-20 pointer-events-none" />
    </section>
  );
}
