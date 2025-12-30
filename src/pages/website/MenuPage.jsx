import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ImageOff,
  Phone,
  Search,
  Utensils,
  ArrowRight,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listFoodItems } from "../../api/foodapi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveImage } from "@/lib/imageUtils";
import { MenuCardSkeleton } from "@/components/LoadingSkeletons";
import ImageLoader from "@/components/ImageLoader";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const currency = (n) =>
  `kr ${Number(n || 0)
    .toFixed(2)
    .replace(".", ",")}`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function MenuPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFoodItems();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (activeCategory === "veg") return item.type?.toLowerCase() === "veg";
        if (activeCategory === "non-veg")
          return item.type?.toLowerCase() !== "veg";
        return true;
      })
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, activeCategory, search]);

  return (
    <main className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[100px] -z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 py-24 sm:py-32">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4"
          >
            <Utensils className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-[0.2em]">
              {t("sections.menu.subtitle")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-brand-dark uppercase tracking-tighter"
          >
            {t("sections.menu.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-brand-dark/60 max-w-2xl mx-auto font-sans"
          >
            {t("hero.description")}
          </motion.p>
        </div>

        {/* Filters & Search - Premium Glass Bar */}
        <div className="sticky top-24 z-40 mb-12 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 p-3 sm:p-6 premium-glass rounded-[2rem] shadow-xl border border-white/50">
          <div
            className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x"
            style={{ scrollbarWidth: "none" }}
          >
            {["all", "veg", "non-veg"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start flex-shrink-0 px-6 sm:px-8 py-3 sm:py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-brand-dark text-white shadow-lg scale-105"
                    : "bg-white/50 text-brand-dark hover:bg-brand-dark/5"
                }`}
              >
                {cat === "all"
                  ? t("sections.menu.filter_all")
                  : cat === "veg"
                  ? t("sections.menu.veg")
                  : t("sections.menu.non_veg")}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 lg:ml-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-dark/30" />
            <input
              type="text"
              placeholder={t("sections.menu.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white/70 border border-brand-dark/5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Menu grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuTile key={item._id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-brand-dark/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-10 h-10 text-brand-dark/20" />
            </div>
            <h3 className="text-2xl font-display font-bold text-brand-dark uppercase">
              {t("sections.menu.no_match_title")}
            </h3>
            <p className="text-brand-dark/60 mb-8">
              {t("sections.menu.no_match_desc")}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveCategory("all");
                setSearch("");
              }}
              className="rounded-full px-8 py-6 uppercase font-bold tracking-widest border-2 border-brand-dark"
            >
              {t("sections.menu.reset_filters")}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Floating Call Button */}
      <motion.a
        href="tel:+46734991206"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 hover:bg-brand-dark transition-all duration-300"
      >
        <Phone className="h-6 w-6" />
      </motion.a>
    </main>
  );
}

// 3D Tilt Card Component
const MenuTile = React.memo(function MenuTile({ item }) {
  const { t } = useTranslation();
  const isVeg = item.type?.toLowerCase() === "veg";

  // CSS for 3D effect
  const cardStyle = {
    transformStyle: "preserve-3d",
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative perspective-1000"
    >
      <Link to={`/menu/${item._id}`} className="block h-full">
        <div
          className="relative h-full bg-white rounded-[2.5rem] p-4 transition-all duration-500 ease-out transform group-hover:rotate-x-2 group-hover:rotate-y-2 group-hover:scale-[1.02] shadow-xl group-hover:shadow-2xl border border-brand-dark/5"
          style={cardStyle}
        >
          {/* Image Container with Parallax feel */}
          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-brand-cream/50 mb-6 translate-z-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-60" />

            <ImageLoader
              src={resolveImage(item.imageUrl, 600)}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Floating Price Tag */}
            <div className="absolute bottom-4 right-4 z-20">
              <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/50 flex items-center gap-2 transform transition-transform group-hover:scale-110 duration-300">
                <span className="font-display font-bold text-lg text-brand-dark">
                  {currency(item.rate)}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 ${
                  isVeg
                    ? "bg-emerald-500 text-white"
                    : "bg-brand-primary text-white"
                }`}
              >
                {isVeg ? (
                  <Leaf size={16} />
                ) : (
                  <div className="w-2 h-2 bg-current rounded-full" />
                )}
              </div>
              {item.isChefRecommended && (
                <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Star size={16} fill="currentColor" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-2 pb-4 translate-z-10">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="font-display text-2xl font-bold text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">
                {item.name}
              </h3>
            </div>

            <p className="text-brand-dark/60 font-sans text-sm leading-relaxed line-clamp-2 mb-6 h-10">
              {item.description}
            </p>

            {/* "Add" Interaction */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-dark/5">
              <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">
                {t("sections.menu.exp_details")}
              </span>
              <div className="w-12 h-12 rounded-full border border-brand-dark/10 flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white group-hover:border-brand-dark transition-all duration-300 shadow-sm group-hover:shadow-lg transform group-hover:rotate-[-45deg]">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
