import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Instagram, ArrowRight, Image as ImageIcon } from "lucide-react";
import { listFoodItems } from "../../api/foodApi";
import { Link } from "react-router-dom";

import { resolveImage } from "@/lib/imageUtils";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VisualGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const items = await listFoodItems();
      // Get items with images, shuffle or pick top 8
      const withImages = items.filter((i) => i.imageUrl).slice(0, 8);
      setImages(withImages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 mb-4">
              <ImageIcon className="w-4 h-4 text-brand-secondary" />
              <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                Visual Feast
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark uppercase tracking-tight">
              Captured <span className="text-gradient">Moments</span>
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-brand-primary font-bold uppercase tracking-widest text-sm transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            <span>Follow Us</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`rounded-3xl bg-brand-dark/5 animate-pulse ${
                  i % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {images.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`relative group rounded-3xl overflow-hidden cursor-pointer ${
                  i === 0 || i === 4
                    ? "md:col-span-2 md:row-span-2"
                    : "col-span-1 row-span-1"
                }`}
              >
                <img
                  src={resolveImage(item.imageUrl)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-display font-bold text-xl uppercase tracking-wide">
                      {item.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
