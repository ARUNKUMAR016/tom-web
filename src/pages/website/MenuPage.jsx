import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Search, Utensils, ArrowRight, Star, SlidersHorizontal,
  X, Flame, Coffee, Sandwich, Grid3x3, LayoutList, ChevronDown
} from "lucide-react";
import { listFoodItems } from "../../api/foodapi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveImage } from "@/lib/imageUtils";
import { MenuCardSkeleton } from "@/components/LoadingSkeletons";
import ImageLoader from "@/components/ImageLoader";

/* ─── helpers ─── */
const currency = (n) => `${Number(n || 0).toFixed(0)} kr`;

function useDebounce(value, delay = 300) {
  const [dv, setDv] = React.useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

const CATEGORIES = [
  { key: "all",         label: "All Dishes",  Icon: Grid3x3    },
  { key: "main_course", label: "Mains",        Icon: Utensils   },
  { key: "appetizer",   label: "Appetizer",    Icon: Flame      },
  { key: "drink",       label: "Drinks",       Icon: Coffee     },
  { key: "combo",       label: "Combo",        Icon: Sandwich   },
];

const TYPES = [
  { key: "all",   label: "All"     },
  { key: "veg",   label: "Veg"     },
  { key: "non-veg", label: "Non-Veg" },
];

/* ─── animation variants ─── */
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const card = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

/* ======================================================
   MENU PAGE
   ====================================================== */
export default function MenuPage() {
  const { t } = useTranslation();
  const [items,            setItems]            = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [activeCategory,   setActiveCategory]   = useState("all");
  const [activeType,       setActiveType]       = useState("all");
  const [search,           setSearch]           = useState("");
  const [viewMode,         setViewMode]         = useState("grid"); // grid | list
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const debouncedSearch = useDebounce(search, 280);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await listFoodItems()); }
    catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() =>
    items
      .filter(i => activeCategory === "all" || i.category === activeCategory)
      .filter(i => {
        if (activeType === "veg")     return i.type?.toLowerCase() === "veg";
        if (activeType === "non-veg") return i.type?.toLowerCase() !== "veg";
        return true;
      })
      .filter(i =>
        i.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (i.description || "").toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [items, activeCategory, activeType, debouncedSearch]
  );

  const hasFilters = activeCategory !== "all" || activeType !== "all" || search;
  const resetAll   = () => { setActiveCategory("all"); setActiveType("all"); setSearch(""); };

  return (
    <div className="min-h-screen" style={{ background: "#F6F0E6" }}>

      {/* ════════════════════════════════════════════
          HERO BANNER — dark full-bleed
      ═══════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{ minHeight: "42vh", background: "#0D0D0D" }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/temple_2.webp"
            alt=""
            loading="eager"
            className="w-full h-full object-cover object-center opacity-25"
          />
          {/* Gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/95 via-[#0D0D0D]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-transparent to-[#0D0D0D]/40" />
        </div>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16 pt-28 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-brand-primary" />
            <span className="label-elegant text-white/35">Taste of Madurai</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black text-[13vw] sm:text-[9vw] lg:text-[7vw] text-white uppercase tracking-tighter leading-[0.82] mb-5"
          >
            Our{" "}
            <span
              className="font-light text-brand-primary/90"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
            >
              Menu
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/40 font-sans text-sm sm:text-base max-w-md leading-relaxed font-light"
          >
            Authentic Tamil flavours crafted with heirloom spices and&nbsp;passion, served in the heart of Stockholm.
          </motion.p>
        </div>

        {/* Bottom edge blade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, transparent, #F6F0E6)" }}
        />
      </div>

      {/* ════════════════════════════════════════════
          FILTER / SEARCH BELT
      ═══════════════════════════════════════════════ */}
      <div className="sticky top-0 sm:top-0 z-40 shadow-sm" style={{ background: "#F6F0E6" }}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16">

          {/* ── CATEGORY TABS (pill row) ── */}
          <div className="flex items-end gap-0 overflow-x-auto scrollbar-none pt-3 sm:pt-4">
            {CATEGORIES.map(({ key, label, Icon }) => {
              const active = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-250 border-b-2 ${
                    active
                      ? "text-brand-dark border-brand-dark"
                      : "text-brand-dark/35 border-transparent hover:text-brand-dark/65 hover:border-brand-dark/20"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── SEARCH + TYPE + VIEW MODE BAR ── */}
          <div className="flex items-center gap-2 sm:gap-3 py-3 border-t border-brand-dark/6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-dark/25" />
              <input
                type="text"
                placeholder="Search dishes, ingredients…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-brand-dark/6 text-sm font-medium placeholder:text-brand-dark/25 focus:outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-brand-dark/30 hover:text-brand-dark/60 transition-colors" />
                </button>
              )}
            </div>

            {/* Type filter — pill buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-white rounded-xl border border-brand-dark/6 p-1">
              {TYPES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveType(key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                    activeType === key
                      ? key === "veg"
                        ? "bg-emerald-500 text-white"
                        : key === "non-veg"
                        ? "bg-brand-primary text-white"
                        : "bg-brand-dark text-white"
                      : "text-brand-dark/40 hover:text-brand-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-brand-dark/8" />

            {/* View mode toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white rounded-xl border border-brand-dark/6 p-1">
              {[
                { mode: "grid", Icon: Grid3x3 },
                { mode: "list", Icon: LayoutList },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    viewMode === mode ? "bg-brand-dark text-white" : "text-brand-dark/35 hover:text-brand-dark"
                  }`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Mobile filter btn */}
            <button
              onClick={() => setShowMobileFilter(v => !v)}
              className={`sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all border ${
                hasFilters
                  ? "bg-brand-dark text-white border-brand-dark"
                  : "bg-white text-brand-dark border-brand-dark/6"
              }`}
            >
              <SlidersHorizontal size={13} />
              {hasFilters ? "Filtered" : "Filter"}
            </button>

            {/* Results count */}
            {!loading && (
              <span className="ml-auto text-xs text-brand-dark/35 font-medium whitespace-nowrap">
                <span className="font-bold text-brand-dark">{filtered.length}</span> dishes
              </span>
            )}

            {/* Clear */}
            {hasFilters && (
              <button onClick={resetAll} className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1 shrink-0">
                <X size={11} />Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile expanded filter */}
        <AnimatePresence>
          {showMobileFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden sm:hidden border-t border-brand-dark/6"
              style={{ background: "#F6F0E6" }}
            >
              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="label-elegant text-brand-dark/35 mb-2">Dietary</p>
                  <div className="flex gap-2">
                    {TYPES.map(({ key, label }) => (
                      <button key={key} onClick={() => setActiveType(key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          activeType === key
                            ? key === "veg" ? "bg-emerald-500 text-white"
                              : key === "non-veg" ? "bg-brand-primary text-white"
                              : "bg-brand-dark text-white"
                            : "bg-white text-brand-dark border border-brand-dark/6"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-elegant text-brand-dark/35 mb-2">View</p>
                  <div className="flex gap-2">
                    {[{ mode:"grid", label:"Grid" }, { mode:"list", label:"List" }].map(({ mode, label }) => (
                      <button key={mode} onClick={() => setViewMode(mode)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${viewMode === mode ? "bg-brand-dark text-white" : "bg-white text-brand-dark border border-brand-dark/6"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════
          CONTENT AREA
      ═══════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-8 sm:py-12 pb-24">
        {loading ? (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            : "flex flex-col gap-3"
          }>
            {[...Array(8)].map((_, i) => <MenuCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onReset={resetAll} />
        ) : (
          <motion.div
            key={`${activeCategory}-${activeType}-${debouncedSearch}-${viewMode}`}
            variants={grid}
            initial="hidden"
            animate="show"
            className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
              : "flex flex-col gap-3"
            }
          >
            {filtered.map(item =>
              viewMode === "list"
                ? <ListCard key={item._id} item={item} />
                : <GridCard key={item._id} item={item} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   GRID CARD — Portrait food-photography card
════════════════════════════════════════════════════ */
const GridCard = React.memo(function GridCard({ item }) {
  const isVeg = item.type?.toLowerCase() === "veg";
  return (
    <motion.div variants={card} layout className="group">
      <Link to={`/menu/${item._id}`} className="block h-full">
        <article className="relative bg-white rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden border border-brand-dark/5 transition-all duration-400 group-hover:shadow-[0_20px_60px_-12px_rgba(35,31,32,0.18)] group-hover:-translate-y-1.5 h-full flex flex-col">

          {/* ── Image wrapper ── */}
          <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
            <div className="absolute inset-0">
              <ImageLoader
                src={resolveImage(item.imageUrl, 600)}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
              />
              {/* Gradient overlay appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </div>

            {/* Veg/non-veg indicator — top left */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center ${
                isVeg ? "border-emerald-500 bg-white" : "border-brand-primary bg-white"
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-emerald-500" : "bg-brand-primary"}`} />
              </div>
            </div>

            {/* Chef's pick badge — top right */}
            {item.isChefRecommended && (
              <div className="absolute top-3.5 right-3.5 z-10">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-secondary/90 backdrop-blur-sm text-white">
                  <Star size={9} className="fill-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Chef's Pick</span>
                </div>
              </div>
            )}

            {/* Price — appears at bottom on hover */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
              <div className="flex items-center justify-between">
                <span className="text-white font-display font-black text-xl leading-none">
                  {currency(item.rate)}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                  <ArrowRight size={14} className="-rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Text content ── */}
          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display font-bold text-[17px] sm:text-[19px] text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-250 flex-1">
                {item.name}
              </h3>
              {/* Price shown normally (non-hover) */}
              <span className="font-display font-black text-base text-brand-dark/80 whitespace-nowrap shrink-0 group-hover:opacity-0 transition-opacity">
                {currency(item.rate)}
              </span>
            </div>

            <p className="text-brand-dark/40 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1 font-sans">
              {item.description}
            </p>

            {/* Category tag */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-dark/5">
              <span className="label-elegant text-brand-dark/25 group-hover:text-brand-primary/50 transition-colors">
                {item.category?.replace("_", " ") || "Dish"}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight size={13} className="text-brand-dark/30" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════
   LIST CARD — horizontal compact card
════════════════════════════════════════════════════ */
const ListCard = React.memo(function ListCard({ item }) {
  const isVeg = item.type?.toLowerCase() === "veg";
  return (
    <motion.div variants={card} layout className="group">
      <Link to={`/menu/${item._id}`} className="block">
        <article className="flex items-center gap-4 sm:gap-5 bg-white rounded-2xl border border-brand-dark/5 p-3 sm:p-4 transition-all duration-300 group-hover:shadow-[0_8px_32px_-8px_rgba(35,31,32,0.13)] group-hover:-translate-y-0.5">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden">
            <ImageLoader
              src={resolveImage(item.imageUrl, 200)}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${isVeg ? "border-emerald-500" : "border-brand-primary"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-emerald-500" : "bg-brand-primary"}`} />
              </div>
              <span className="label-elegant text-brand-dark/30">{item.category?.replace("_", " ") || "Dish"}</span>
              {item.isChefRecommended && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary">
                  <Star size={8} className="fill-brand-secondary" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Pick</span>
                </div>
              )}
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-brand-dark leading-snug truncate group-hover:text-brand-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-brand-dark/40 text-xs leading-relaxed line-clamp-1 mt-0.5 font-sans hidden sm:block">
              {item.description}
            </p>
          </div>

          {/* Price + arrow */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="font-display font-black text-lg sm:text-xl text-brand-dark group-hover:text-brand-primary transition-colors">
              {currency(item.rate)}
            </span>
            <div className="w-8 h-8 rounded-full border border-brand-dark/10 flex items-center justify-center text-brand-dark/30 group-hover:bg-brand-dark group-hover:text-white group-hover:border-brand-dark transition-all duration-250">
              <ArrowRight size={13} />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════════════ */
function EmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24 flex flex-col items-center"
    >
      <div className="w-20 h-20 rounded-full bg-brand-dark/5 flex items-center justify-center mb-6">
        <Utensils className="w-9 h-9 text-brand-dark/15" />
      </div>
      <h3 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight mb-2">
        Nothing Found
      </h3>
      <p className="text-brand-dark/40 text-sm mb-8 max-w-xs">
        Try adjusting your filters or search to explore more of our menu.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-dark text-white font-bold uppercase text-xs tracking-[0.18em] hover:bg-brand-primary transition-all duration-300"
      >
        Reset Filters
      </button>
    </motion.div>
  );
}
