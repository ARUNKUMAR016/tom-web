// src/components/FeedbackPopup.jsx
import React, { useMemo, useState } from "react";
import { Star, MessageSquare, Send, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const COLORS = {
  dark: "#253428",
  sage: "#728175",
  sand: "#CDBF9C",
};

// Replace your StarRating with this version
function StarRating({ value, onChange, size = 28 }) {
  const [hover, setHover] = React.useState(0);
  const stars = [1, 2, 3, 4, 5];

  const SAND = "yellow"; // use yellow for fill
  const GRAY = "#D1D5DB"; // tailwind gray-300

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Rating">
      {stars.map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            className="p-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ lineHeight: 0 }}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            {/* Inline SVG star with real fill + stroke */}
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: size,
                height: size,
                transition: "filter 200ms ease, transform 150ms ease",
                filter: active ? "drop-shadow(0 0 8px rgba(205,191,156,0.9))" : "none",
                transform: active ? "translateY(-0.5px)" : "none",
              }}
              fill={active ? SAND : "none"}
              stroke={active ? SAND : GRAY}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {/* clean 5-point star path */}
              <path d="M12 2.6l2.63 5.33 5.89.86-4.26 4.15 1 5.86L12 16.92 6.74 18.8l1-5.86L3.48 8.79l5.89-.86L12 2.6z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}



export default function FeedbackPopup() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ message: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.message.trim()) return;

    try {
      setSubmitting(true);
      // TODO: wire this to your backend (Node/Express) or Google Sheets.
      // await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, ...form }) });
      await new Promise((r) => setTimeout(r, 700));
      setDone(true);
      setForm({ message: "", email: "", phone: "" });
      setRating(5);
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
      {/* Floating Pill Trigger */}
      <DialogTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 group rounded-full px-4 py-2 shadow-md cutive-font"
          style={{
            backgroundColor: COLORS.dark,
            color: COLORS.sand,
          }}
          aria-label="Open feedback"
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquare size={18} className="opacity-90" />
            <span className="text-sm font-semibold">Feedback</span>
          </span>
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition"
            style={{ boxShadow: `0 0 0 6px ${COLORS.sand}22` }}
          />
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent
        className="w-full sm:max-w-md p-0 overflow-hidden rounded-2xl"
        style={{
          borderColor: `${COLORS.sage}40`,
          background: "white",
        }}
      >
        <div className="relative">
          {/* Top Accent */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${COLORS.dark}, ${COLORS.sage}, ${COLORS.dark})`,
            }}
          />

          <DialogHeader className="px-6 pt-5">
            <DialogTitle
              className="cutive-font text-xl"
              style={{ color: COLORS.dark }}
            >
              We value your thoughts
            </DialogTitle>
            <DialogDescription
              className="cutive-font text-sm"
              style={{ color: `${COLORS.sage}` }}
            >
              Help us bring authentic Madurai flavors to Sweden—share quick
              feedback.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 pb-6">
            {done ? (
              <div className="text-center py-8">
                <div
                  className="mx-auto mb-3 h-12 w-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${COLORS.sand}55`,
                    color: COLORS.dark,
                  }}
                >
                  <Send size={20} />
                </div>
                <p
                  className="cutive-font text-base"
                  style={{ color: COLORS.dark }}
                >
                  Thank you! உங்கள் கருத்துக்கு நன்றி 🙏
                </p>
                <p
                  className="cutive-font text-sm mt-1"
                  style={{ color: COLORS.sage }}
                >
                  We read every message.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={ResetAndClose}
                    className="cutive-font"
                    style={{
                      backgroundColor: COLORS.dark,
                      color: COLORS.sand,
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Rating */}
                <div className="space-y-2">
                  <Label
                    className="cutive-font text-sm"
                    style={{ color: COLORS.dark }}
                  >
                    Rate your experience
                  </Label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <Separator
                  className="my-1"
                  style={{ backgroundColor: `${COLORS.sand}66` }}
                />

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="cutive-font text-sm"
                    style={{ color: COLORS.dark }}
                  >
                    Your feedback
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="What did you love? What can we improve?"
                    value={form.message}
                    onChange={onChange}
                    className="cutive-font min-h-[110px] resize-none focus-visible:ring-2"
                    style={{
                      borderColor: `${COLORS.sage}66`,
                    }}
                    required
                  />
                </div>

                {/* Contact (optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="cutive-font text-sm"
                      style={{ color: COLORS.dark }}
                    >
                      Email (optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@example.com"
                      className="cutive-font focus-visible:ring-2"
                      style={{
                        borderColor: `${COLORS.sage}66`,
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="cutive-font text-sm"
                      style={{ color: COLORS.dark }}
                    >
                      Phone (optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+46 ..."
                      className="cutive-font focus-visible:ring-2"
                      style={{
                        borderColor: `${COLORS.sage}66`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="cutive-font text-sm underline decoration-dotted"
                      style={{ color: COLORS.sage }}
                    >
                      Maybe later
                    </button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={submitting || !form.message.trim()}
                    className="cutive-font inline-flex items-center gap-2"
                    style={{
                      backgroundColor: COLORS.dark,
                      color: COLORS.sand,
                    }}
                  >
                    {submitting ? "Sending..." : "Send Feedback"}
                    <Send size={16} />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Close (X) */}
          <DialogClose
            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full"
            aria-label="Close"
            style={{ color: COLORS.sage, backgroundColor: "transparent" }}
          >
            <X size={18} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
