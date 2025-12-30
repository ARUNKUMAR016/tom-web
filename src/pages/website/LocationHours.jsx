import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings } from "../../api/settingsApi";
import { useTranslation } from "react-i18next";

export default function LocationHours() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
                <Navigation className="w-4 h-4 text-brand-primary" />
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                  {t("sections.location.badge")}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-display font-bold text-brand-dark uppercase tracking-tight mb-6">
                {t("sections.location.title")} <br />
                <span className="text-gradient">
                  {t("sections.location.title_accent")}
                </span>
              </h2>

              <p className="text-brand-dark/70 font-sans text-lg leading-relaxed max-w-md">
                {t("sections.location.description")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-brand-cream/50 border border-brand-dark/5">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-brand-dark uppercase tracking-wide mb-1">
                    {t("sections.location.address_label")}
                  </h4>
                  <p className="text-brand-dark/70">
                    Madängsvägen 7, <br />
                    129 49 Hägersten, Stockholm, Sweden
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-3xl bg-brand-cream/50 border border-brand-dark/5">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="w-6 h-6 text-brand-secondary" />
                </div>
                <div className="w-full">
                  <h4 className="font-display font-bold text-brand-dark uppercase tracking-wide mb-2">
                    {t("sections.location.hours_label")}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {settings?.openingHours ? (
                      settings.openingHours.map((slot, i) => (
                        <div
                          key={i}
                          className="flex justify-between border-b border-brand-dark/5 pb-1 last:border-0 last:pb-0"
                        >
                          <span className="font-bold text-brand-dark/60">
                            {slot.day}
                          </span>
                          <span className="font-bold text-brand-dark">
                            {slot.open} - {slot.close}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-brand-dark/70">
                        {t("sections.location.loading_hours")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 h-14 rounded-full bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase tracking-widest shadow-lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {t("sections.location.call_us")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-full border-2 border-brand-dark/10 hover:bg-brand-dark/5 text-brand-dark font-bold uppercase tracking-widest"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t("sections.location.email_label")}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-brand-dark/10"
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

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none border-[10px] border-white/20 rounded-[3rem]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
