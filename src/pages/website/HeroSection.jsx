import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import OpenStatus from "@/components/OpenStatus";
import { getSettings } from "../../api/settingsApi";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [openingHours, setOpeningHours] = useState("");
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    getSettings().then((data) => {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const hours = data.openingHours?.find((h) => h.day === today);
      setOpeningHours(
        hours ? `${hours.open} - ${hours.close}` : "Closed today"
      );
    });
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-cream">
      {/* Dynamic Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse transition-all duration-[5s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6"
            >
              <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                Top Rated in Stockholm
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block font-display text-xl sm:text-2xl text-brand-primary mb-4 tracking-[0.2em] uppercase font-bold">
                {t("hero.subtitle")}
              </span>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-brand-dark mb-6 tracking-tight leading-none">
                {t("hero.title")}
              </h1>
              <p className="font-sans text-lg sm:text-xl md:text-2xl text-brand-dark/70 max-w-3xl leading-relaxed font-light mb-10">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  asChild
                  className="w-full sm:w-auto px-10 h-16 rounded-full bg-brand-primary text-white hover:bg-brand-dark text-lg font-bold uppercase tracking-wider shadow-2xl shadow-brand-primary/30 transition-all duration-300 group"
                >
                  <Link to="/menu">
                    {t("nav.orderUs")}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto px-10 h-16 rounded-full border-2 border-brand-dark/10 text-brand-dark hover:bg-brand-dark/5 text-lg font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <Link to="/menu">{t("hero.cta_main")}</Link>
                </Button>
              </div>
            </motion.div>

            <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-brand-dark/5 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-dark/40 tracking-widest">
                    Today's Hours
                  </p>
                  <p className="text-sm font-bold text-brand-dark">
                    {openingHours}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <OpenStatus />
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div style={{ y: y1 }} className="relative hidden lg:block">
            <div className="relative z-10 w-full max-w-[500px] mx-auto">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <img
                  src="/hero_biryani.webp"
                  alt="Famous Madurai Biryani"
                  className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.2)]"
                />

                {/* Floating Badges */}
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-10 -left-10 premium-glass p-4 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-secondary grid place-items-center">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">
                      4.9/5 Rating
                    </p>
                    <p className="text-[10px] text-brand-dark/60">
                      Google Reviews
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-10 -right-10 premium-glass p-4 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary grid place-items-center">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">
                      Authentic
                    </p>
                    <p className="text-[10px] text-brand-dark/60">
                      Spices from India
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/40">
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-brand-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
