import React from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const offersArr = []; // Loaded via t()

import { useTranslation } from "react-i18next";

export default function SpecialOffers() {
  const { t } = useTranslation();

  /* DYNAMIC OFFERS LOGIC */
  const [offersList, setOffersList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    import("../../api/offerApi").then(({ getActiveOffers }) => {
      getActiveOffers()
        .then((data) => {
          setOffersList(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, []);

  if (!loading && offersList.length === 0) return null; // Hide section if no offers
  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-dark/5 border border-brand-dark/10 mb-4"
          >
            <Tag className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">
              {t("sections.special_offers.badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark uppercase tracking-tight"
          >
            {t("sections.special_offers.title")}{" "}
            <span className="text-gradient">
              {t("sections.special_offers.title_accent")}
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offersList.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative group rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${offer.color}`}
              />

              <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${offer.color}`}
                  >
                    {offer.tag}
                  </div>
                  {offer.originalPrice && (
                    <span className="text-sm font-bold text-brand-dark/40 line-through decoration-brand-primary/50">
                      {offer.originalPrice}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-display font-bold text-brand-dark uppercase tracking-tight mb-3 group-hover:text-brand-primary transition-colors">
                  {offer.title}
                </h3>

                <p className="text-brand-dark/60 font-sans text-sm mb-8 leading-relaxed flex-grow">
                  {offer.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <span className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest block mb-1">
                      {t("sections.menu.price")}
                    </span>
                    <span className="text-3xl font-display font-bold text-brand-dark">
                      {offer.price}
                    </span>
                  </div>
                  <Button className="rounded-full w-12 h-12 p-0 bg-brand-dark hover:bg-brand-primary transition-colors flex items-center justify-center group-hover:scale-110 duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
