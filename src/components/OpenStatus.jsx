import React, { useEffect, useState, useMemo } from "react";
import { getSettings } from "../api/settingsApi";

// Configure your hours here (Europe/Stockholm time)
const TIMEZONE = "Europe/Stockholm";

function toMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

function nowInMinutes(timeZone) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return toMinutes(`${parts.hour}:${parts.minute}`);
}

function getDayInTZ(timeZone) {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short" })
      .formatToParts(new Date())
      .find((p) => p.type === "weekday")
      .value // Map "Sun".."Sat" to JS 0..6
      .replace(/.*/, (w) =>
        ({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[w])
      )
  );
}

const DAYS_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function OpenStatus({ className = "" }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const status = useMemo(() => {
    if (!settings) return { isOpen: false, text: "Loading..." };

    // 1. Manual Override
    if (settings.isShopOpen === false) {
      return { isOpen: false, text: "Closed" };
    }

    const dayIndex = getDayInTZ(TIMEZONE);
    const dayName = DAYS_MAP[dayIndex];
    const mins = nowInMinutes(TIMEZONE);

    // 2. Special Closed Dates
    const todayStr = new Date().toISOString().split("T")[0];
    if (settings.specialClosedDates?.some((d) => d.startsWith(todayStr))) {
      return { isOpen: false, text: "Closed (Holiday)" };
    }

    // 3. Weekly Closed Days
    if (settings.closedDays?.includes(dayName)) {
      return { isOpen: false, text: "Closed Today" };
    }

    // 4. Time Check
    const openMins = toMinutes(settings.openingTime);
    const closeMins = toMinutes(settings.closingTime);

    if (mins >= openMins && mins < closeMins) {
      return { isOpen: true, text: "Open now", detail: `• Closes ${settings.closingTime}` };
    } else if (mins < openMins) {
      return { isOpen: false, text: "Closed", detail: `• Opens ${settings.openingTime}` };
    } else {
      return { isOpen: false, text: "Closed", detail: `• Opens tomorrow` };
    }
  }, [settings]);

  if (!settings) return null;

  return (
    <div
      className={`cutive-font inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${className}`}
      aria-live="polite"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          status.isOpen ? "bg-emerald-500" : "bg-rose-500"
        }`}
        aria-hidden
      />
      <span className={`${status.isOpen ? "text-emerald-600" : "text-rose-500"}`}>
        {status.text}
      </span>
      <span className="text-[#728175]">{status.detail}</span>
    </div>
  );
}
