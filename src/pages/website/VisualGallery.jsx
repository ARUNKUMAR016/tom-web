import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ArrowRight, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { listMoments } from "../../api/momentApi";
import { useTranslation } from "react-i18next";
import { resolveImage } from "@/lib/imageUtils";
import { GalleryMomentSkeleton } from "@/components/LoadingSkeletons";
import ImageLoader from "@/components/ImageLoader";

export default function VisualGallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // index or null

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const moments = await listMoments(true);
      setImages(moments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 mb-3 sm:mb-4">
              <ImageIcon className="w-4 h-4 text-brand-secondary" />
              <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                {t("sections.gallery.badge")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-brand-dark uppercase tracking-tight">
              {t("sections.gallery.title")}{" "}
              <span className="text-gradient">{t("sections.gallery.title_accent")}</span>
            </h2>
          </div>

          <a
            href="https://www.instagram.com/taste_ofmadurai"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-brand-dark text-white hover:bg-brand-primary font-bold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 shrink-0"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t("sections.gallery.follow_us")}</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ─── Masonry Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[200px]">
            {[...Array(8)].map((_, i) => (
              <GalleryMomentSkeleton key={i} large={i === 0 || i === 4} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[200px]">
            {images.map((moment, i) => (
              <motion.div
                key={moment._id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className={`relative group rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer ${
                  i === 0 || i === 4 ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"
                }`}
                onClick={() => setLightbox(i)}
              >
                <ImageLoader
                  src={resolveImage(moment.imageUrl, i === 0 || i === 4 ? 800 : 400)}
                  alt={moment.caption || "Gallery moment"}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108"
                  style={{ transformOrigin: "center" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5">
                  {moment.caption && (
                    <p className="text-white font-display font-bold text-sm sm:text-base uppercase tracking-wide transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      {moment.caption}
                    </p>
                  )}
                </div>
                {/* Expand icon */}
                <div className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white -rotate-45" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + images.length) % images.length); }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resolveImage(images[lightbox].imageUrl, 1200)}
                alt={images[lightbox].caption || "Gallery"}
                className="lightbox-img"
              />
              {images[lightbox].caption && (
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium text-center bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {images[lightbox].caption}
                </p>
              )}
              {/* Counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold tracking-widest">
                {lightbox + 1} / {images.length}
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-3 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % images.length); }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
