// src/pages/website/Feedback.jsx
import React, { useState } from "react";
import { MessageSquare, Send, X, Star } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { createReview } from "../../api/reviewApi";
import { toast } from "sonner";

// Lucide Star Rating Component
function StarRating({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {stars.map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full transition-transform hover:scale-110"
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                active
                  ? "fill-brand-secondary text-brand-secondary" // Orange/Gold filled
                  : "fill-transparent text-gray-300" // Gray empty
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackPopup() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({
    name: "",
    message: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.message.trim() || !form.name.trim()) {
      toast.error("Please provide your name and message");
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        name: form.name.trim(),
        content: form.message.trim(),
        rating: rating,
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setDone(true);
      setForm({ name: "", message: "", email: "", phone: "" });
      setRating(5);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  const ResetAndClose = () => {
    setDone(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setDone(false);
      }}
    >
      {/* Trigger Button - Matches Site Theme */}
      <DialogTrigger asChild>
        <button
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 group bg-brand-primary text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 font-cutive border border-white/10"
          aria-label="Open feedback"
        >
          <MessageSquare size={20} className="fill-white/20" />
          <span className="font-bold text-sm hidden sm:inline">
            {t("sections.feedback.trigger")}
          </span>

          {/* Pulse Effect */}
          <span className="absolute inset-0 rounded-full animate-ping bg-brand-primary/50 -z-10" />
        </button>
      </DialogTrigger>

      {/* Modern Modal Design */}
      <DialogContent className="max-w-md w-full p-0 overflow-hidden border-none bg-white rounded-3xl shadow-2xl">
        <div className="relative">
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

          <DialogHeader className="px-8 pt-8 pb-2 text-left">
            <DialogTitle className="font-cutive text-2xl font-bold text-brand-dark">
              {t("sections.feedback.title")}
            </DialogTitle>
            <DialogDescription className="text-brand-dark/60 mt-1 font-sans">
              {t("sections.feedback.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8 pt-4">
            {done ? (
              <div className="text-center py-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-sm">
                  <Send size={28} className="-ml-1 translate-y-0.5" />
                </div>
                <h3 className="font-cutive text-xl font-bold text-brand-dark mb-2">
                  {t("sections.feedback.success_title")}
                </h3>
                <p className="text-brand-dark/60 mb-8 max-w-[200px] text-sm">
                  {t("sections.feedback.success_msg")}
                </p>
                <Button
                  onClick={ResetAndClose}
                  className="bg-brand-dark text-white hover:bg-black rounded-xl px-8 w-full font-bold h-12"
                >
                  {t("sections.feedback.close")}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-3 bg-brand-cream/50 p-4 rounded-2xl border border-brand-dark/5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-brand-dark/50">
                    {t("sections.feedback.rate_label")}
                  </Label>
                  <div className="flex justify-center py-2">
                    <StarRating value={rating} onChange={setRating} size={32} />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-bold text-brand-dark"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={onChange}
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all h-11"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-bold text-brand-dark"
                  >
                    {t("sections.feedback.message_label")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("sections.feedback.message_placeholder")}
                    value={form.message}
                    onChange={onChange}
                    className="min-h-[120px] resize-none rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-400 font-sans"
                    required
                  />
                </div>

                {/* Contact (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-bold text-brand-dark"
                    >
                      {t("sections.feedback.email_label")}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        {t("sections.feedback.optional")}
                      </span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@doe.com"
                      value={form.email}
                      onChange={onChange}
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-bold text-brand-dark"
                    >
                      {t("sections.feedback.phone_label")}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        {t("sections.feedback.optional")}
                      </span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+46..."
                      value={form.phone}
                      onChange={onChange}
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all h-11"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 rounded-xl text-brand-dark/60 hover:text-brand-dark hover:bg-gray-100 font-bold"
                    >
                      {t("sections.feedback.cancel")}
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={submitting || !form.message.trim()}
                    className="flex-[2] rounded-xl bg-brand-primary hover:bg-red-700 text-white font-bold h-12 shadow-lg hover:shadow-brand-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {submitting
                      ? t("sections.feedback.sending")
                      : t("sections.feedback.send")}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <DialogClose className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X size={20} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
