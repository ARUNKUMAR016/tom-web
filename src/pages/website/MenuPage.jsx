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
import { listFoodItems } from "../../api/foodApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveImage } from "@/lib/imageUtils";

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
        <div className="sticky top-24 z-40 mb-12 flex flex-col lg:flex-row items-center gap-6 p-4 sm:p-6 premium-glass rounded-[2rem] shadow-xl border border-white/50">
          <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
            {["all", "veg", "non-veg"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-brand-dark text-white shadow-lg scale-105"
                    : "bg-white/50 text-brand-dark hover:bg-brand-dark/5"
                }`}
              >
                {cat === "all"
                  ? t("sections.menu.filter_all")
                  : cat === "veg"
                  ? "Vegetarian"
                  : "Non-Vegetarian"}
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
              <div
                key={i}
                className="animate-pulse rounded-[2.5rem] bg-brand-dark/5 h-[400px]"
              />
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
              No match found
            </h3>
            <p className="text-brand-dark/60 mb-8">
              Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveCategory("all");
                setSearch("");
              }}
              className="rounded-full px-8 py-6 uppercase font-bold tracking-widest border-2 border-brand-dark"
            >
              Reset Filters
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

function MenuTile({ item }) {
  const [imgOk, setImgOk] = useState(true);
  const isVeg = item.type?.toLowerCase() === "veg";

  return (
    <motion.div
      layout
      variants={itemVariants}
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden premium-shadow-hover border border-brand-dark/5"
    >
      <Link to={`/menu/${item._id}`} className="block h-full">
        <div className="aspect-[1/1] relative overflow-hidden">
          {imgOk ? (
            <img
              src={resolveImage(item.imageUrl)}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="h-full w-full grid place-items-center bg-brand-cream">
              <ImageOff className="h-10 w-10 text-brand-dark/10" />
            </div>
          )}

          {/* Badge Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border border-white/40 ${
                isVeg ? "bg-emerald-500/90" : "bg-brand-primary/90"
              }`}
            >
              {isVeg ? (
                <Leaf className="w-5 h-5 text-white" />
              ) : (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              )}
            </div>
            {item.isChefRecommended && (
              <div className="w-10 h-10 rounded-full bg-brand-secondary/90 flex items-center justify-center shadow-lg backdrop-blur-md border border-white/40 animate-bounce">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            )}
          </div>

          <div className="absolute bottom-6 right-6">
            <div className="premium-glass px-4 py-2 rounded-2xl shadow-lg border border-white/40">
              <span className="font-display font-bold text-brand-dark text-lg">
                {currency(item.rate)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="font-display text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors uppercase tracking-tight mb-2">
            {item.name}
          </h3>

          <p className="text-sm text-brand-dark/60 font-sans line-clamp-2 mb-6 h-10">
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-brand-dark/5">
            <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[0.2em] group-hover:text-brand-primary transition-colors">
              Experience Details
            </span>
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
