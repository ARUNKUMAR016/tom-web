import React, { useState, useEffect } from "react";
import { Star, Quote, MessageSquarePlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createReview, getFeaturedReviews } from "../../api/reviewApi";
import { ReviewCardSkeleton } from "@/components/LoadingSkeletons";

const COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-red-100 text-brand-primary",
  "bg-orange-100 text-brand-secondary",
];

export default function Testimonials() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", content: "", rating: 5 });

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getFeaturedReviews();
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback to static if no dynamic reviews
        const staticItems =
          t("sections.testimonials.items", { returnObjects: true }) || [];
        setReviews(staticItems);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      // Fallback
      const staticItems =
        t("sections.testimonials.items", { returnObjects: true }) || [];
      setReviews(staticItems);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createReview(form);
      setIsOpen(false);
      setForm({ name: "", content: "", rating: 5 });
      // Refresh reviews to show the new one if likely top rated, or just to update state
      fetchReviews();
      alert("Thank you for your feedback!"); // Simple feedback
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4"
          >
            <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              {t("sections.testimonials.badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark uppercase tracking-tight mb-4"
          >
            {t("sections.testimonials.title")}{" "}
            <span className="text-gradient">
              {t("sections.testimonials.title_accent")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/60 max-w-2xl mx-auto font-sans text-lg mb-8"
          >
            {t("sections.testimonials.subtitle")}
          </motion.p>

          {/* Feedback Trigger */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors shadow-lg shadow-brand-dark/20"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Share Your Experience
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-brand-dark/5 rounded-[2rem] p-0 overflow-hidden gap-0">
              <DialogHeader className="p-8 pb-4">
                <DialogTitle className="text-2xl font-display font-bold text-brand-dark uppercase tracking-wide">
                  Rate your Experience
                </DialogTitle>
                <DialogDescription className="text-brand-dark/50 font-sans">
                  We love to hear from our guests. Your feedback helps us serve
                  authentic Madurai flavors better.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-brand-dark/60">
                      Your Name
                    </Label>
                    <Input
                      placeholder="Eg. Priya S"
                      className="rounded-xl border-brand-dark/10 bg-brand-cream/30 focus:bg-white transition-all font-medium py-6"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-brand-dark/60">
                      Rating
                    </Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm({ ...form, rating: star })}
                          className={`p-2 transition-all hover:scale-110 ${
                            form.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              form.rating >= star ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-brand-dark/60">
                      Your Review
                    </Label>
                    <Textarea
                      placeholder="Tell us what you liked..."
                      className="rounded-xl border-brand-dark/10 bg-brand-cream/30 focus:bg-white transition-all font-medium min-h-[120px] resize-none p-4"
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-secondary text-brand-dark font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all text-white hover:text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {reviews.map((testimonial, index) => {
                const initials = (testimonial.name || "Guest")
                  .split(" ")
                  .map((n) => n[0])
                  .join("");
                const color = COLORS[index % COLORS.length];
                return (
                  <motion.div
                    key={testimonial._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5 hover:border-brand-primary/20 transition-all duration-300 hover:-translate-y-2 group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center font-bold text-xl shadow-inner uppercase shrink-0`}
                      >
                        {initials}
                      </div>
                      <Quote className="w-8 h-8 text-brand-dark/10 group-hover:text-brand-primary/20 transition-colors" />
                    </div>

                    <div className="flex gap-1 mb-4 text-brand-secondary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5)
                              ? "fill-current"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-brand-dark/70 font-sans leading-relaxed mb-6 flex-1">
                      "{testimonial.content}"
                    </p>

                    <div className="mt-auto">
                      <h4 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wide">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-brand-dark/40 font-bold uppercase tracking-widest text-[10px]">
                        {testimonial.role || "Guest"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
