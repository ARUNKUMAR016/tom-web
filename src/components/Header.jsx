// src/components/Header.jsx
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Instagram, X, Menu, ShoppingBag } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

/* ---------------- Animations ---------------- */
const menuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.3 } },
  closed: { opacity: 0, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastToggleRef = useRef(0);
  const location = useLocation();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleRef.current < 300) return;
    lastToggleRef.current = now;
    setOpen((p) => !p);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-dark/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2 sm:gap-3 z-50 relative"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <img
              src="/logo1 (2).svg"
              alt="Taste of Madurai Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain relative z-10"
              style={{
                // Adjust filter to match new palette if needed, or remove for original logo colors
                filter:
                  "brightness(0) saturate(100%) invert(14%) sepia(35%) saturate(366%) hue-rotate(314deg) brightness(97%) contrast(98%)", // Dark charcoal
              }}
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display uppercase text-xl sm:text-2xl font-bold text-brand-dark leading-none tracking-tight">
              {t("brand")}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-brand-primary font-bold">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-6">
            <DesktopItem to="/" end>
              {t("nav.home")}
            </DesktopItem>
            <DesktopItem to="/menu">{t("nav.menu")}</DesktopItem>
            <DesktopItem to="/contact">{t("nav.contact")}</DesktopItem>
          </nav>

          <div className="flex items-center gap-3 pl-4 border-l border-brand-dark/10">
            <LanguageSwitcher />
            <Button
              asChild
              className="bg-brand-primary hover:bg-red-700 text-white rounded-full px-6 font-bold uppercase tracking-wide text-xs shadow-lg shadow-brand-primary/20 transition-transform active:scale-95"
            >
              <Link to="/menu">
                {t("nav.orderUs")} <ShoppingBag className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          className="flex md:hidden relative z-50 h-10 w-10 rounded-full hover:bg-brand-dark/5"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          <Menu className="h-6 w-6 text-brand-dark" />
        </Button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 z-[9998] bg-brand-dark/20 backdrop-blur-sm"
              aria-hidden="true"
              onPointerDown={close}
            />

            {/* Right drawer */}
            <motion.aside
              key="panel"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed right-0 top-0 bottom-0 z-[9999] w-full sm:w-[24rem] bg-brand-cream border-l border-brand-dark/10 shadow-2xl flex flex-col"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand-dark/5">
                <span className="font-display text-xl font-bold text-brand-dark uppercase">
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={close}
                  className="h-10 w-10 rounded-full hover:bg-brand-dark/10"
                >
                  <X className="h-6 w-6 text-brand-dark" />
                </Button>
              </div>

              {/* Nav list */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <MobileItem to="/" end onClick={close}>
                    {t("nav.home")}
                  </MobileItem>
                  <MobileItem to="/menu" onClick={close}>
                    {t("nav.menu")}
                  </MobileItem>
                  <MobileItem to="/kki" onClick={close}>
                    Order Online
                  </MobileItem>
                  <MobileItem to="/contact" onClick={close}>
                    {t("nav.contact")}
                  </MobileItem>

                  <motion.li variants={itemVariants} className="pt-8">
                    <Button
                      asChild
                      className="w-full bg-brand-primary text-white rounded-xl py-6 text-lg font-bold uppercase hover:bg-red-700"
                      onClick={close}
                    >
                      <Link to="/menu">{t("common.open")}</Link>
                    </Button>
                  </motion.li>

                  <motion.li variants={itemVariants} className="pt-8">
                    <div className="h-px w-full bg-brand-dark/10 mb-6" />
                    <div className="flex justify-between items-center px-2">
                      <span className="text-sm font-medium text-brand-dark/60">
                        {t("footer.language")}
                      </span>
                      <LanguageSwitcher />
                    </div>
                  </motion.li>
                </motion.ul>
              </nav>

              {/* Footer info */}
              <div className="p-6 bg-brand-dark text-brand-cream">
                <p className="text-brand-secondary text-xs font-bold uppercase tracking-wider mb-1">
                  Opening Hours
                </p>
                <p className="font-sans text-lg">Sat & Sun · 10:00 – 19:00</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- Subcomponents ---------------- */
function DesktopItem({ to, end = false, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
          isActive
            ? "text-brand-primary"
            : "text-brand-dark/70 hover:text-brand-primary"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileItem({ to, end = false, children, onClick }) {
  return (
    <motion.li variants={itemVariants}>
      <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-brand-primary/10 text-brand-primary font-bold"
              : "text-brand-dark hover:bg-brand-dark/5 font-medium"
          }`
        }
      >
        <span className="text-lg">{children}</span>
      </NavLink>
    </motion.li>
  );
}
