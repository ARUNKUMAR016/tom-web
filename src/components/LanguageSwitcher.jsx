import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  function change(lang) {
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }

  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "sv", label: "SV", flag: "🇸🇪" },
  ];

  return (
    <div className="relative inline-flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-brand-accent/20 shadow-sm">
      <Globe className="h-4 w-4 text-brand-muted" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => change(lang.code)}
          className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            i18n.language === lang.code
              ? "bg-brand-ink text-brand-gold shadow-md"
              : "text-brand-ink/70 hover:text-brand-ink hover:bg-brand-gold/10"
          }`}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
