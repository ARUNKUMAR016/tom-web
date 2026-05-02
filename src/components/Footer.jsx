import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { getSettings } from "../api/settingsApi";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [hours, setHours] = useState("10:00 – 19:00");
  const [daysLabel, setDaysLabel] = useState("Mon - Sun");

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data.openingTime && data.closingTime) {
          setHours(`${data.openingTime} – ${data.closingTime}`);
        }
        // Calculate Label
        const closed = data.closedDays || [];
        const weekdays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ];
        const isWeekendsOnly =
          weekdays.every((d) => closed.includes(d)) &&
          !closed.includes("Saturday") &&
          !closed.includes("Sunday");

        if (isWeekendsOnly) {
          setDaysLabel("Sat & Sun");
        } else if (closed.length === 0) {
          setDaysLabel("Mon - Sun");
        } else {
          setDaysLabel(t("nav.openingHours"));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative bg-brand-dark text-brand-cream overflow-hidden pt-24 pb-12">
      {/* Watermark Logo */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.03] pointer-events-none">
        <img
          src="/logo1 (2).svg"
          alt="Watermark"
          className="w-[80vw] max-w-[800px] h-auto grayscale invert"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section: CTA & Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24 border-b border-white/10 pb-12">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-none mb-6">
              Experience the <br />
              <span className="text-brand-primary">True Taste</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="rounded-full h-14 px-8 bg-brand-cream text-brand-dark font-bold uppercase tracking-wide hover:bg-brand-secondary hover:text-brand-dark transition-all"
              >
                <a
                  href="http://foodora.se/restaurant/vbdi/taste-of-madurai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("nav.orderUs")} <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full h-14 px-8 border-white/20 text-brand-cream hover:bg-white/10 hover:text-white font-bold uppercase tracking-wide"
              >
                <Link to="/contact">{t("nav.contact")}</Link>
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <SocialCircle
              href="https://www.instagram.com/taste_ofmadurai"
              icon={Instagram}
            />
            <SocialCircle
              href="https://www.facebook.com/tasteofmadurai"
              icon={Facebook}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand & Address */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <img
                src="/logo1 (2).svg"
                alt="Logo"
                className="w-12 h-12 invert brightness-0 opacity-90"
              />
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-wider">
                  {t("brand")}
                </h3>
                <p className="text-[10px] text-brand-primary uppercase tracking-[0.2em]">
                  {t("tagline")}
                </p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-brand-cream/60 font-light">
              <p className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
                <span>
                  Madängsvägen 7, 129 49 Hägersten,
                  <br />
                  Stockholm, Sweden
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <a
                  href="tel:+46734991206"
                  className="hover:text-brand-cream transition-colors"
                >
                  +46-734991206
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                <a
                  href="mailto:info@tasteofmadurai.com"
                  className="hover:text-brand-cream transition-colors"
                >
                  info@tasteofmadurai.com
                </a>
              </p>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm text-brand-primary mb-6">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-4 text-brand-cream/70 font-medium">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-cream transition-colors flex items-center gap-2 group"
                >
                  {t("nav.home")}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="hover:text-brand-cream transition-colors flex items-center gap-2 group"
                >
                  {t("nav.menu")}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-brand-cream transition-colors flex items-center gap-2 group"
                >
                  {t("footer.about")}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-brand-cream transition-colors flex items-center gap-2 group"
                >
                  {t("footer.reviews")}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm text-brand-primary mb-6">
              Legal
            </h4>
            <ul className="space-y-4 text-brand-cream/70 font-medium">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-brand-cream transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-cream transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-brand-cream transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours Card */}
          <div className="md:col-span-3">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="font-bold uppercase tracking-widest text-sm text-brand-primary mb-4">
                {t("nav.openingHours")}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-brand-cream font-bold text-xl">
                  {daysLabel}
                </span>
                <div className="text-right">
                  <span className="block text-brand-cream/60 text-xs uppercase">
                    Time
                  </span>
                  <span className="block text-brand-cream font-mono">
                    {hours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-brand-cream/30 uppercase tracking-widest">
          <p>
            © {new Date().getFullYear()} {t("brand")}. All Rights Reserved.
          </p>
          <p>Designed with ❤️ in Stockholm</p>
        </div>
      </div>
    </footer>
  );
}

function SocialCircle({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 group"
    >
      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </a>
  );
}
