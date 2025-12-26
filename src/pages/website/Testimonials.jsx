import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Erik Svensson",
    role: "Local Foodie",
    content:
      "The most authentic South Indian food I've had in Stockholm. The dosas are crispy and the chutneys are incredibly fresh. A hidden gem!",
    rating: 5,
    initials: "ES",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Priya Krishna",
    role: "Regular Customer",
    content:
      "Reminds me of home. The mutton biryani is exactly how it tastes in Madurai. The staff is so warm and welcoming.",
    rating: 5,
    initials: "PK",
    color: "bg-red-100 text-brand-primary",
  },
  {
    id: 3,
    name: "Lars Jensen",
    role: "Chef",
    content:
      "Incredible depth of flavor in every dish. You can taste the quality of the hand-ground spices. Highly recommended for spice lovers.",
    rating: 5,
    initials: "LJ",
    color: "bg-orange-100 text-brand-secondary",
  },
];

export default function Testimonials() {
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
              Guest Love
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark uppercase tracking-tight mb-4"
          >
            What our <span className="text-gradient">Guests Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/60 max-w-2xl mx-auto font-sans text-lg"
          >
            Don't just take our word for it. Here's what our community loves
            about the Taste of Madurai experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5 hover:border-brand-primary/20 transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${testimonial.color} flex items-center justify-center font-bold text-xl shadow-inner`}
                >
                  {testimonial.initials}
                </div>
                <Quote className="w-8 h-8 text-brand-dark/10 group-hover:text-brand-primary/20 transition-colors" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-brand-secondary fill-brand-secondary"
                  />
                ))}
              </div>

              <p className="text-brand-dark/70 font-sans leading-relaxed mb-6 min-h-[80px]">
                "{testimonial.content}"
              </p>

              <div>
                <h4 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wide">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-brand-dark/40 font-bold uppercase tracking-widest text-[10px]">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
