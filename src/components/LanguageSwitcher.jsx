import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function change(e) {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    try { localStorage.setItem("lang", lang); } catch {}
  }

  // Restore from localStorage on first render
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }

  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={i18n.language}
      onChange={change}
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="sv">SV</option>
    </select>
  );
}
