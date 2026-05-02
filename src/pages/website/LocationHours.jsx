import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings } from "../../api/settingsApi";
import { useTranslation } from "react-i18next";

const MAPS_LINK =
  "https://www.google.com/maps/place/Mad%C3%A4ngsv%C3%A4gen+7,+129+49+H%C3%A4gersten";

export default function LocationHours() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    getSettings().then(setSettings).catch(console.error);
    return () => ctrl.abort();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(circle, #231F20 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          {/* ─── Info Side ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 sm:space-y-10 order-2 lg:order-1"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4 sm:mb-6">
                <Navigation className="w-4 h-4 text-brand-primary" />
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                  {t("sections.location.badge")}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-dark uppercase tracking-tight mb-4 sm:mb-6 leading-tight">
                {t("sections.location.title")} <br />
                <span className="text-gradient">
                  {t("sections.location.title_accent")}
                </span>
              </h2>

              <p className="text-brand-dark/65 font-sans text-base sm:text-lg leading-relaxed max-w-md">
                {t("sections.location.description")}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Address */}
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-brand-cream/50 border border-brand-dark/5 hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 group-hover:bg-brand-primary group-hover:shadow-brand-primary/20 group-hover:shadow-md transition-all duration-300">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-brand-dark uppercase tracking-wide mb-1 text-sm sm:text-base">
                    {t("sections.location.address_label")}
                  </h4>
                  <p className="text-brand-dark/65 text-sm sm:text-base">
                    Madängsvägen 7, 129 49 Hägersten,<br />Stockholm, Sweden
                  </p>
                  <span className="text-xs text-brand-primary font-bold mt-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-brand-cream/50 border border-brand-dark/5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-secondary" />
                </div>
                <div className="flex-1 w-full">
                  <h4 className="font-display font-bold text-brand-dark uppercase tracking-wide mb-2 sm:mb-3 text-sm sm:text-base">
                    {t("sections.location.hours_label")}
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {settings?.openingHours ? (
                      settings.openingHours.map((slot, i) => (
                        <div
                          key={i}
                          className="flex justify-between border-b border-brand-dark/5 pb-1.5 last:border-0 last:pb-0"
                        >
                          <span className="font-semibold text-brand-dark/55">{slot.day}</span>
                          <span className="font-bold text-brand-dark tabular-nums">
                            {slot.open} – {slot.close}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1.5">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-3 skeleton-shimmer rounded w-20" />
                            <div className="h-3 skeleton-shimmer rounded w-24" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="tel:+46734991206"
                  className="flex-1 h-12 sm:h-14 rounded-full bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase tracking-widest shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {t("sections.location.call_us")}
                </a>
                <a
                  href="mailto:info@tasteofmadurai.com"
                  className="flex-1 h-12 sm:h-14 rounded-full border-2 border-brand-dark/10 hover:bg-brand-dark/5 text-brand-dark font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {t("sections.location.email_label")}
                </a>
              </div>
            </div>
          </motion.div>

          {/* ─── Map Side ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[320px] sm:h-[450px] lg:h-[600px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-brand-dark/10 order-1 lg:order-2"
          >
            <iframe
              src="https://maps.google.com/maps?q=Mad%C3%A4ngsv%C3%A4gen+7,+129+49+H%C3%A4gersten&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 pointer-events-none border-[8px] sm:border-[10px] border-white/20 rounded-[2rem] sm:rounded-[3rem]" />
            {/* "Open Maps" overlay CTA */}
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-brand-dark font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-brand-primary hover:text-white transition-all duration-300"
            >
              <ExternalLink className="w-3 h-3" />
              Open Maps
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
