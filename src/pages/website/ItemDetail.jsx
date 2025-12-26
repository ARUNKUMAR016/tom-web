import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFoodItem, listFoodItems } from "../../api/foodApi";
import {
  ArrowLeft,
  Leaf,
  Share2,
  Heart,
  Clock,
  ChefHat,
  Star,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { resolveImage } from "@/lib/imageUtils";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [itemData, allItems] = await Promise.all([
        getFoodItem(id),
        listFoodItems(),
      ]);
      setItem(itemData);
      setSimilarItems(
        allItems
          .filter((i) => i._id !== id && i.type === itemData.type)
          .slice(0, 4)
      );
    } catch (e) {
      const msg = e?.message || "Failed to load item";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  const isVeg = item?.type?.toLowerCase() === "veg";

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <ChefHat className="absolute inset-0 m-auto w-8 h-8 text-brand-primary animate-pulse" />
          </div>
          <p className="text-brand-dark font-display font-bold uppercase tracking-widest animate-pulse">
            Preparing the Magic...
          </p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Star className="w-12 h-12 text-brand-primary" />
          </div>
          <h2 className="text-4xl font-display font-bold text-brand-dark uppercase tracking-tighter">
            Dish Not Found
          </h2>
          <p className="text-brand-dark/60 font-sans">
            {error ||
              "The flavors you seek are currently wandering in the streets of Madurai."}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="rounded-full px-8 border-2"
            >
              Go Back
            </Button>
            <Button
              onClick={fetchData}
              className="bg-brand-primary rounded-full px-8"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream pb-24">
      {/* Immersive Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={resolveImage(item.imageUrl)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-brand-dark/20 to-brand-dark/40" />
        </motion.div>

        {/* Back Button & Actions */}
        <div className="absolute top-0 left-0 w-full z-20 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white border border-white/30 h-12 w-12"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white border border-white/30 h-12 w-12"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white border border-white/30 h-12 w-12"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Item Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 sm:p-10 text-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <div
                className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border ${
                  isVeg
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-brand-primary/20 border-brand-primary/50 text-brand-primary"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isVeg ? "bg-emerald-500" : "bg-brand-primary"
                  }`}
                />
                {item.type}
              </div>
              {item.isChefRecommended && (
                <div className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-brand-secondary/20 border border-brand-secondary/50 text-brand-secondary backdrop-blur-md">
                  <Star className="w-3 h-3 fill-brand-secondary" />
                  Chef's Choice
                </div>
              )}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-5xl sm:text-7xl font-display font-bold uppercase tracking-tighter mb-4"
            >
              {item.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex items-center gap-6 text-white/80 font-display font-bold text-lg sm:text-2xl uppercase tracking-widest"
            >
              <span>{item.rate} KR</span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-secondary" />
                <span>15-20 MIN</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-3 gap-12 -mt-10 relative z-30">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl border border-brand-dark/5"
          >
            <div className="mb-10">
              <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.4em] mb-4">
                The Experience
              </h3>
              <p className="text-xl sm:text-2xl text-brand-dark/70 font-sans leading-relaxed">
                {item.description ||
                  "A masterpiece of South Indian culinary tradition, prepared with hand-ground spices and the freshest ingredients."}
              </p>
            </div>

            {item.ingredients?.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.4em] mb-6">
                  Key Ingredients
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {item.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-brand-cream/50 border border-brand-dark/5 text-sm font-bold text-brand-dark uppercase tracking-tight"
                    >
                      <Zap className="w-4 h-4 text-brand-secondary" />
                      {ing}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Similar Items Carousel */}
          <div className="mt-20">
            <h3 className="text-2xl font-display font-bold text-brand-dark uppercase tracking-tight mb-8">
              You might also love
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {similarItems.map((si) => (
                <Link
                  key={si._id}
                  to={`/menu/${si._id}`}
                  className="group block"
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 premium-shadow">
                    <img
                      src={resolveImage(si.imageUrl)}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-display font-bold uppercase tracking-tight">
                        {si.name}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="sticky top-32 bg-brand-dark text-white rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="mb-8 border-b border-white/10 pb-8">
              <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.4em] mb-2">
                Price Breakdown
              </p>
              <h4 className="text-5xl font-display font-bold uppercase tracking-tighter">
                {item.rate} KR
              </h4>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Preparation</span>
                <span className="font-bold">Freshly Cooked</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Spice Level</span>
                <div className="flex gap-1">
                  <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                  <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                  <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Availability</span>
                <span
                  className={
                    item.isAvailable ? "text-emerald-400" : "text-brand-primary"
                  }
                >
                  {item.isAvailable ? "In Kitchen" : "Sold Out"}
                </span>
              </div>
            </div>

            <Button className="w-full h-20 rounded-full bg-brand-primary hover:bg-white hover:text-brand-primary text-xl font-display font-bold uppercase tracking-[0.1em] transition-all duration-500 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Add to Basket
            </Button>

            <p className="text-center text-[10px] text-white/40 uppercase tracking-widest mt-6">
              Secure Checkout via Foodora
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
