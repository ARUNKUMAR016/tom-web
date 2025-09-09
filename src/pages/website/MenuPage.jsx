// src/pages/MenuPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  Leaf,
  Flame,
  ChefHat,
  Sparkles,
  AlertTriangle,
  ImageOff,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { listFoodItems } from "../../api/foodApi";

/* ===== Brand (match HeroSection exactly) ===== */
const INK = "#253428";
const ACCENT = "#CDBF9C";
const MUTED = "#728175";
const PAPER = "#F5F1E7";
const BG = "#F3F4F6";

// env base (same as your admin page)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// base categories (food only)
const BASE_CATEGORIES = ["All", "Starters", "Main Course", "Desserts"];

/* ===== Helpers ===== */
const currency = (n) => `${n} kr`;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 260, damping: 24 } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.15 } },
};

// Resolve API image like your admin page
function resolveImage(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;          // absolute URL
  if (url.startsWith("/")) return `${API_BASE}${url}`; // /uploads/food.jpg
  return `${API_BASE}/${url}`;                         // uploads/food.jpg
}

// Normalize API → UI model (includes imageUrl)
function normalizeItem(raw) {
  const id = raw?.id || raw?._id || crypto.randomUUID?.() || String(Math.random());
  const name = raw?.name || raw?.title || "Untitled";
  const description = raw?.description || raw?.desc || "";
  const price = Number(raw?.price ?? raw?.cost ?? 0);
  const category =
    raw?.category ||
    raw?.type ||
    (raw?.course ? (String(raw.course).toLowerCase().includes("main") ? "Main Course" : "Starters") : "Main Course");
  const veg =
    (raw?.veg ?? raw?.isVeg ?? raw?.vegetarian ?? raw?.is_veg) !== false;
  const spice = Number(raw?.spice ?? raw?.spiceLevel ?? raw?.heat ?? 0);

  // support multiple image keys; make absolute if needed
  const imageRaw = raw?.imageUrl || raw?.image || raw?.img || raw?.photo || "";
  const img = resolveImage(imageRaw);

  return { id, name, description, price, category, veg, spice, img };
}

// Food-only filter for safety
function isFoodCategory(cat = "") {
  const c = String(cat).toLowerCase();
  return !["drink", "drinks", "beverage", "beverages"].some((x) => c.includes(x));
}

export default function MenuPage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  const [itemsRaw, setItemsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Try server-side filter; fallback to all
      const data = await listFoodItems({ category: "food" }).catch(() => listFoodItems());
      setItemsRaw(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load items");
      setItemsRaw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Normalize + food only
  const normalized = useMemo(() => {
    return itemsRaw.map(normalizeItem).filter((it) => isFoodCategory(it.category));
  }, [itemsRaw]);

  // Dynamic categories (food only), prettified
  const categories = useMemo(() => {
    const found = Array.from(
      new Set(
        normalized
          .map((i) => i.category)
          .filter(Boolean)
          .filter(isFoodCategory)
      )
    );

    const prettified = found.map((c) => {
      const lc = String(c).toLowerCase();
      if (lc.includes("starter") || lc.includes("snack")) return "Starters";
      if (lc.includes("main")) return "Main Course";
      if (lc.includes("dessert") || lc.includes("sweet")) return "Desserts";
      return c;
    });

    const unique = Array.from(new Set(prettified));
    const merged = BASE_CATEGORIES.filter((c) => c === "All" || unique.includes(c));
    return merged.length ? merged : BASE_CATEGORIES;
  }, [normalized]);

  // Filter by category + search
  const items = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return normalized.filter((item) => {
      const inCategory =
        active === "All" ||
        (item.category &&
          (active === item.category ||
            (active === "Starters" && /starter|snack/i.test(item.category)) ||
            (active === "Main Course" && /main/i.test(item.category)) ||
            (active === "Desserts" && /dessert|sweet/i.test(item.category))));
      const inText =
        !lower ||
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower);
      return inCategory && inText;
    });
  }, [active, query, normalized]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: BG }}>
      {/* soft vignette like hero feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(205,191,156,0.12), transparent), radial-gradient(50% 40% at 100% 20%, rgba(114,129,117,0.10), transparent)",
        }}
      />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">
        {/* Title + Search */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <ChefHat className="h-6 w-6" style={{ color: ACCENT }} />
              <h1 className="cutive-font text-3xl sm:text-4xl" style={{ color: INK }}>
                Our Menu
              </h1>
            </div>
            <p className="cutive-font mt-1 text-sm" style={{ color: MUTED }}>
              Enjoy Authentic South Indian Flavors.
            </p>
          </div>

          {/* Search */}
          <motion.div
            layout
            animate={{ width: focus ? "100%" : "100%" }}
            className="md:w-[420px]"
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: MUTED }}
              />
              <Input
                type="text"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dosa, vada, tea…"
                className="pl-9 rounded-full border-[#E6E2D9] bg-white/90 shadow-sm placeholder:text-[#9AA69C] focus-visible:ring-0"
              />
            </div>
          </motion.div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="cutive-font">{error}</span>
            <button onClick={load} className="ml-auto rounded-full bg-red-100 px-3 py-1 text-sm hover:bg-red-200">
              Retry
            </button>
          </div>
        )}

        {/* Category Controls */}
        {/* Mobile: dropdown */}
        <div className="md:hidden">
          <Select value={active} onValueChange={setActive}>
            <SelectTrigger className="cutive-font rounded-full bg-white/90 border-[#E6E2D9] focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent className="cutive-font">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="cutive-font">
                  <span className="flex items-center gap-2">
                    {cat === "Starters" && <Sparkles className="h-4 w-4" />}
                    {cat === "Main Course" && <Flame className="h-4 w-4" />}
                    {cat === "Desserts" && <Leaf className="h-4 w-4 rotate-180" />}
                    {cat}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop/Tablet: tabs */}
        <div className="hidden md:block">
          <Tabs value={active} onValueChange={setActive} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto rounded-full h-12 bg-white/90 p-1 shadow-sm border border-[#E6E2D9]">
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-full cutive-font text-sm px-4 py-2
                       data-[state=active]:bg-[#253428] data-[state=active]:text-[#CDBF9C]
                       data-[state=inactive]:text-[#253428] hover:bg-[#F0EDE5]"
                  >
                    <span className="flex items-center gap-2">
                      {cat === "Starters" && <Sparkles className="h-4 w-4" />}
                      {cat === "Main Course" && <Flame className="h-4 w-4" />}
                      {cat === "Desserts" && <Leaf className="h-4 w-4 rotate-180" />}
                      {cat}
                    </span>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 w-full rounded-2xl bg-white/70" />
                <div className="mt-3 h-5 w-2/3 rounded bg-white/70" />
                <div className="mt-2 h-4 w-3/4 rounded bg-white/60" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={active + "|" + query}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {items.map((item) => (
                  <motion.div key={item.id} variants={itemVariants} className="transform-gpu will-change-transform">
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {items.length === 0 && (
              <div className="mt-16 flex flex-col items-center text-center">
                <Sparkles className="h-8 w-8" style={{ color: MUTED }} />
                <p className="cutive-font mt-3" style={{ color: MUTED }}>
                  No dishes found. Try another search or category.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

/* ===== Menu Card – high-class image treatment ===== */
function MenuCard({ item }) {
  const hasImage = Boolean(item.img);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
      aria-label={`${item.name} – ${item.description}`}
    >
      <Card
        className="overflow-hidden rounded-2xl border border-[#E6E2D9] shadow-sm transition-shadow duration-200 group-hover:shadow-lg"
        style={{ backgroundColor: PAPER }}
      >
        {/* Image frame */}
        <div className="relative">
          <div className="aspect-[16/10] overflow-hidden">
            {hasImage ? (
              <>
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={(e) => {
                    // hide broken image and show fallback (same pattern as admin)
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextSibling;
                    if (fb) fb.style.display = "flex";
                  }}
                  crossOrigin="anonymous"
                />
                {/* Fallback placeholder (hidden initially) */}
                <div
                  className="hidden h-full w-full items-center justify-center bg-white/70"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 text-[#9AA69C]">
                    <ImageOff className="h-5 w-5" />
                    <span className="cutive-font text-sm">Image unavailable</span>
                  </div>
                </div>
              </>
            ) : (
              // No image provided → show elegant placeholder
              <div className="flex h-full w-full items-center justify-center bg-white/70">
                <div className="flex items-center gap-2 text-[#9AA69C]">
                  <ImageOff className="h-5 w-5" />
                  <span className="cutive-font text-sm">No image</span>
                </div>
              </div>
            )}
          </div>

          {/* Vignette + inner frame */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_0%,rgba(0,0,0,0.06),transparent)]" />
          <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-white/40" />

          {/* Price chip */}
          <div className="pointer-events-none absolute right-3 top-3">
            <div className="cutive-font rounded-full bg-white/90 px-3 py-1 text-sm font-bold shadow backdrop-blur text-[color:#253428]">
              {currency(item.price)}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-1">
            <h3 className="cutive-font text-lg" style={{ color: INK }}>
              {item.name}
            </h3>
            <p className="cutive-font mt-1 line-clamp-2 text-sm" style={{ color: MUTED }}>
              {item.description}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {item.veg ? (
                <Badge variant="outline" className="gap-1 rounded-full border-emerald-200 text-emerald-700 bg-white/70">
                  <Leaf className="h-3.5 w-3.5" /> Veg
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 rounded-full border-rose-200 text-rose-700 bg-white/70">
                  <Flame className="h-3.5 w-3.5" /> Non-veg
                </Badge>
              )}
              {item.spice > 0 && (
                <Badge className="gap-1 rounded-full" style={{ backgroundColor: ACCENT, color: INK }}>
                  <Flame className="h-3.5 w-3.5" />
                  {["Mild", "Medium", "Hot"][Math.min(item.spice - 1, 2)]}
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              className="rounded-full shadow-sm hover:opacity-90"
              style={{ backgroundColor: INK, color: ACCENT }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Explore
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
