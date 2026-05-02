import React, { useState, useEffect, useCallback } from "react";
import { Star, Quote, MessageSquarePlus, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createReview, getFeaturedReviews } from "../../api/reviewApi";
import { ReviewCardSkeleton } from "@/components/LoadingSkeletons";

export default function Testimonials() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", content: "", rating: 5 });

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getFeaturedReviews();
      if (Array.isArray(data) && data.length > 0) setReviews(data);
      else setReviews(t("sections.testimonials.items", { returnObjects: true }) || []);
    } catch {
      setReviews(t("sections.testimonials.items", { returnObjects: true }) || []);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview(form);
      setSubmitted(true);
      toast.success("Thank you for your review! 🙏", {
        description: "Your feedback helps us serve better every day.",
        duration: 5000,
      });
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setForm({ name: "", content: "", rating: 5 });
        fetchReviews();
      }, 2000);
    } catch {
      toast.error("Couldn't submit review", { description: "Please try again in a moment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(35,31,32,0.028) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 relative z-10">
        {/* ─── Header ─── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-16 sm:mb-20">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <span className="w-6 h-px bg-brand-primary" />
              <span className="label-elegant text-brand-dark/40">Guest Stories</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-brand-dark uppercase tracking-tight leading-[0.88]"
            >
              What Our{" "}
              <br />
              <span
                className="italic font-light text-brand-primary"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Guests Say
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            {/* Aggregate rating */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-cream/60 border border-brand-dark/5 w-fit">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-secondary fill-brand-secondary" />
                ))}
              </div>
              <div>
                <span className="font-display font-black text-2xl text-brand-dark">{avgRating}</span>
                <span className="text-brand-dark/40 text-sm ml-1">/ 5</span>
              </div>
              <div className="w-px h-6 bg-brand-dark/10" />
              <span className="text-sm text-brand-dark/40 font-medium">{reviews.length} reviews</span>
            </div>

            {/* CTA */}
            <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if (!v) setSubmitted(false); }}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-brand-dark/10 text-brand-dark font-bold uppercase text-xs tracking-[0.18em] hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all duration-300">
                  <MessageSquarePlus className="w-4 h-4" />
                  Share Your Experience
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg bg-white/98 backdrop-blur-xl border-0 rounded-[2rem] p-0 overflow-hidden gap-0 mx-4 sm:mx-auto shadow-2xl">
                <DialogHeader className="p-7 sm:p-8 pb-4 border-b border-brand-dark/5">
                  <DialogTitle className="text-2xl font-display font-bold text-brand-dark uppercase tracking-wide">
                    Rate your Experience
                  </DialogTitle>
                  <DialogDescription className="text-brand-dark/45 text-sm mt-1">
                    Your feedback means everything to us.
                  </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-8 flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-brand-dark uppercase">Thank you!</h3>
                      <p className="text-brand-dark/50 text-sm">Your review helps guests discover authentic cuisine.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onSubmit={handleSubmit} className="p-7 sm:p-8 pt-5 space-y-5">
                      <div className="grid gap-2">
                        <Label className="label-elegant text-brand-dark/40">Your Name</Label>
                        <Input placeholder="Eg. Priya S." className="rounded-xl border-brand-dark/8 bg-brand-cream/30 h-12 focus:bg-white font-medium"
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="label-elegant text-brand-dark/40">Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                              className={`transition-all hover:scale-110 ${form.rating >= star ? "text-yellow-400" : "text-gray-200"}`}>
                              <Star className={`w-8 h-8 ${form.rating >= star ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label className="label-elegant text-brand-dark/40">Your Review</Label>
                        <Textarea placeholder="Tell us about your experience..." className="rounded-xl border-brand-dark/8 bg-brand-cream/30 focus:bg-white min-h-[110px] resize-none font-medium"
                          value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                      </div>
                      <Button type="submit" disabled={isSubmitting}
                        className="w-full h-12 rounded-xl bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase tracking-widest text-xs transition-all">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* ─── Cards Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(3)].map((_, i) => <ReviewCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {reviews.map((testimonial, index) => {
              const initials = (testimonial.name || "Guest").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
              const palette = [
                "bg-rose-50 text-rose-600",
                "bg-brand-cream text-brand-dark",
                "bg-blue-50 text-blue-600",
                "bg-emerald-50 text-emerald-700",
              ];
              const color = palette[index % palette.length];
              return (
                <motion.div
                  key={testimonial._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.45 }}
                  className="surface-card p-6 sm:p-8 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center font-black text-lg shrink-0`}>
                      {initials}
                    </div>
                    <Quote className="w-8 h-8 text-brand-dark/6 group-hover:text-brand-primary/10 transition-colors" />
                  </div>

                  <div className="flex gap-1 mb-4 text-brand-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? "fill-current" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                  </div>

                  <p className="text-brand-dark/60 font-sans leading-relaxed mb-6 flex-1 text-sm sm:text-[15px]">
                    "{testimonial.content}"
                  </p>

                  <div className="border-t border-brand-dark/5 pt-4">
                    <h4 className="font-display font-bold text-base text-brand-dark uppercase tracking-wide">
                      {testimonial.name}
                    </h4>
                    <p className="label-elegant text-brand-dark/30 mt-1">{testimonial.role || "Verified Guest"}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
