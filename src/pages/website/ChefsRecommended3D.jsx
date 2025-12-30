import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Star,
  ArrowRight,
  Flame,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { listFoodItems } from "../../api/foodapi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { resolveImage } from "@/lib/imageUtils";
import { ChefPickSkeleton } from "@/components/LoadingSkeletons";
import ImageLoader from "@/components/ImageLoader";

export default function ChefsRecommended3D() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch only chef recommended items
      const data = await listFoodItems({ chefRecommended: true });
      setItems(data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Horizontal Scroll Controls
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-brand-primary blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-brand-secondary blur-[150px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-brand-secondary fill-brand-secondary animate-pulse" />
              <span className="text-xs font-bold text-brand-secondary uppercase tracking-[0.2em] font-sans">
                {t("sections.chefs_recommended.curated")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tight leading-[0.9]"
            >
              {t("sections.chefs_recommended.title")}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 hidden md:flex"
          >
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white hover:text-brand-dark hover:border-white transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white hover:text-brand-dark hover:border-white transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Cinematic Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-12 scrollbar-none snap-x snap-mandatory px-4 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? [...Array(4)].map((_, i) => <ChefPickSkeleton key={i} />)
            : items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="snap-center"
                >
                  <Link
                    to={`/menu/${item._id}`}
                    className="group block relative w-[85vw] sm:w-[420px] h-[500px] sm:h-[560px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent border border-white/5 hover:border-brand-primary/30 transition-all duration-500"
                  >
                    {/* Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <ImageLoader
                        src={resolveImage(item.imageUrl, 800)}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        placeholderClassName="bg-white/5"
                        errorClassName="bg-white/5"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                    </div>

                    {/* Floating Price Tag */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white font-display font-bold text-lg group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors duration-300">
                        {item.rate}{" "}
                        <span className="text-xs font-sans font-normal opacity-70">
                          {t("common.sek")}
                        </span>
                      </div>
                    </div>

                    {/* Content Layer */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-10">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center">
                            <Star className="w-4 h-4 text-brand-dark fill-brand-dark" />
                          </div>
                          <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                            {t("sections.chefs_recommended.badge")}
                          </span>
                        </div>

                        <h3 className="font-display text-3xl font-bold text-white mb-3 group-hover:text-brand-secondary transition-colors leading-tight">
                          {item.name}
                        </h3>

                        <p className="text-white/60 font-sans text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="h-12 px-6 rounded-full bg-white text-brand-dark font-bold text-sm uppercase tracking-wide flex items-center gap-2 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                            {t("sections.chefs_recommended.view_details")}
                          </div>
                          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-brand-primary group-hover:bg-brand-primary/20 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

          {/* End Cap */}
          <div className="min-w-[100px] flex items-center justify-center snap-center">
            <Link
              to="/menu"
              className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all group"
            >
              <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
