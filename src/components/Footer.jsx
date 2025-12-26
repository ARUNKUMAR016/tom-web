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
} from "lucide-react";
import { getSettings } from "../api/settingsApi";
import { useTranslation } from "react-i18next";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
  },
};

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
          setDaysLabel("Open Days");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-brand-dark text-brand-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-secondary opacity-20" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo1 (2).svg"
                alt="Taste of Madurai Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                style={{
                  filter:
                    "brightness(0) invert(1) sepia(10%) saturate(500%) hue-rotate(320deg) opacity(0.9)", // Make it cream/white
                }}
              />
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-cream uppercase tracking-wide">
                  Taste of Madurai
                </h1>
                <p className="text-[10px] text-brand-secondary tracking-[0.2em] uppercase font-bold">
                  Authentic South Indian
                </p>
              </div>
            </div>
            <p className="text-brand-cream/60 text-sm leading-relaxed max-w-xs font-sans">
              {t("hero.description")}
            </p>
            <div className="flex gap-3 sm:gap-4">
              <SocialLink
                href="https://www.instagram.com/taste_ofmadurai"
                icon={Instagram}
                label="Instagram"
              />
              <SocialLink
                href="https://www.facebook.com/tasteofmadurai"
                icon={Facebook}
                label="Facebook"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-display text-lg font-bold text-brand-secondary uppercase tracking-wider">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink to="/">{t("nav.home")}</FooterLink>
              <FooterLink to="/menu">{t("nav.menu")}</FooterLink>
              <FooterLink to="/kki">{t("nav.orderUs")}</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-display text-lg font-bold text-brand-secondary uppercase tracking-wider">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-sm text-brand-cream/70 font-sans">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-brand-primary shrink-0" />
                <a
                  href="https://maps.app.goo.gl/by2HLDymUM9L14kR6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-secondary transition-colors"
                >
                  Madängsvägen 7,
                  <br />
                  129 49 Hägersten,
                  <br />
                  Stockholm, Sweden
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-primary shrink-0" />
                <a
                  href="tel:+46734991206"
                  className="hover:text-brand-secondary transition-colors"
                >
                  +46-734991206
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-primary shrink-0" />
                <a
                  href="mailto:info@tasteofmadurai.com"
                  className="hover:text-brand-secondary transition-colors"
                >
                  info@tasteofmadurai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & CTA */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-display text-lg font-bold text-brand-secondary uppercase tracking-wider">
              {t("nav.openingHours")}
            </h3>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-brand-primary font-bold text-sm uppercase">
                  {daysLabel}
                </span>
                <span className="text-brand-cream font-bold text-sm font-sans">
                  {hours}
                </span>
              </div>
            </div>
            <Button
              asChild
              className="w-full bg-brand-primary text-white hover:bg-brand-secondary hover:text-brand-dark font-bold rounded-xl h-12 text-sm uppercase tracking-wide shadow-lg shadow-brand-primary/20 transition-all duration-300"
            >
              <a
                href="http://foodora.se/restaurant/vbdi/taste-of-madurai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                {t("nav.orderUs")} - Foodora
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-cream/30 font-sans">
          <p>
            © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-brand-secondary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-brand-secondary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-brand-accent hover:bg-brand-gold hover:text-brand-ink transition-all duration-300 hover:scale-110"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

function FooterLink({ to, children }) {
  return (
    <li className="block">
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-neutral-ivory/70 hover:text-brand-gold hover:translate-x-1 transition-all duration-300"
      >
        <span className="h-1 w-1 rounded-full bg-brand-accent/50" />
        {children}
      </Link>
    </li>
  );
}
