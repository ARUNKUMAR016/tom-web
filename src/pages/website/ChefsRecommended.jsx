import React, { useCallback, useEffect, useState, useRef } from "react";
import { Star, ArrowRight, Flame, ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { listFoodItems } from "../../api/foodApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { resolveImage } from "@/lib/imageUtils";
import { ChefPickSkeleton } from "@/components/LoadingSkeletons";
import ImageLoader from "@/components/ImageLoader";

export default function ChefsRecommended() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listFoodItems({ chefRecommended: true });
      setItems(data);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (loading || items.length === 0) return;
    autoScrollRef.current = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const el = scrollRef.current;
        const atEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 10;
        el.scrollBy({ left: atEnd ? -el.scrollWidth : 360, behavior: "smooth" });
      }
    }, 4200);
    return () => clearInterval(autoScrollRef.current);
  }, [loading, items.length, isPaused]);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "#0D0D0D" }}>
      {/* Subtle warm accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-primary/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 relative z-10">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="space-y-4 sm:space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <Flame className="w-4 h-4 text-brand-secondary fill-brand-secondary animate-pulse" />
              <span className="label-elegant text-white/30 tracking-[0.25em]">Curated Selection</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] text-white uppercase tracking-tight leading-[0.88]"
            >
              Chef's{" "}
              <span
                className="italic font-light text-brand-secondary/90"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Signatures
              </span>
            </motion.h2>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden sm:flex items-center gap-2"
          >
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* ─── Slider ─── */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2500)}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory -mx-5 sm:-mx-0 px-5 sm:px-0"
        >
          {loading
            ? [...Array(4)].map((_, i) => <ChefPickSkeleton key={i} />)
            : items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ delay: index * 0.07, duration: 0.5 }}
                  className="snap-center flex-shrink-0"
                >
                  <Link
                    to={`/menu/${item._id}`}
                    className="group block relative w-[78vw] sm:w-[370px] lg:w-[400px] h-[480px] sm:h-[540px] lg:h-[580px] rounded-[2rem] overflow-hidden"
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      <ImageLoader
                        src={resolveImage(item.imageUrl, 800)}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      {/* Subtle border */}
                      <div className="absolute inset-0 rounded-[2rem] border border-white/8 pointer-events-none" />
                    </div>

                    {/* Index */}
                    <div className="absolute top-5 left-5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-white/50">{String(index + 1).padStart(2, "0")}</span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-5 right-5 z-10">
                      <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white font-bold text-sm group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                        {item.rate} <span className="text-white/50 text-xs font-normal">{t("common.sek")}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-3.5 h-3.5 text-brand-secondary fill-brand-secondary" />
                        <span className="label-elegant text-brand-secondary tracking-[0.25em]">Signature Pick</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-brand-secondary transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                        <div className="h-10 px-5 rounded-full bg-white text-brand-dark font-bold text-xs uppercase tracking-widest flex items-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                          View Details
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white">
                          <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

          {/* End cap */}
          <div className="flex-shrink-0 w-20 flex items-center justify-center snap-center">
            <Link to="/menu" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/40 transition-all">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden justify-center gap-3 mt-6">
          <button onClick={() => scroll("left")} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setIsPaused((p) => !p)} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => scroll("right")} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
