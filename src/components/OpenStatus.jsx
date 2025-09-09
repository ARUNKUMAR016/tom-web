import React, { useMemo } from "react";

// Configure your hours here (Europe/Stockholm time)
const TIMEZONE = "Europe/Stockholm";
// JS getDay(): 0 Sun, 6 Sat
const WEEKLY_HOURS = [
  { day: 6, open: "10:00", close: "19:00", label: "Saturday" },
  { day: 0, open: "10:00", close: "19:00", label: "Sunday" },
];

function toMinutes(hhmm) {
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
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return toMinutes(`${parts.hour}:${parts.minute}`);
}

function getDayInTZ(timeZone) {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short" })
    .formatToParts(new Date())
    .find(p => p.type === "weekday").value
    // Map "Sun".."Sat" to JS 0..6
    .replace(/.*/, (w) => ({Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6})[w]));
}

export default function OpenStatus({ className = "" }) {
  const { isOpen, current, next } = useMemo(() => {
    const day = getDayInTZ(TIMEZONE);
    const mins = nowInMinutes(TIMEZONE);

    const today = WEEKLY_HOURS.find(h => h.day === day);
    const openNow = today
      ? mins >= toMinutes(today.open) && mins < toMinutes(today.close)
      : false;

    // Find the next opening slot
    const order = Array.from({ length: 7 }, (_, i) => (day + i) % 7);
    let nextSlot = null;
    for (const d of order) {
      const slot = WEEKLY_HOURS.find(h => h.day === d);
      if (!slot) continue;
      if (d === day) {
        if (mins < toMinutes(slot.open)) { nextSlot = slot; break; }
        // if already open, the “next” is next week’s same day
        if (openNow) {
          // next week
          nextSlot = slot;
          break;
        }
      } else { nextSlot = slot; break; }
    }

    return { isOpen: openNow, current: today || null, next: nextSlot || null };
  }, []);

  const timeRange = (slot) => slot ? `${slot.open}–${slot.close}` : "";

  return (
    <div
      className={`cutive-font inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${className}`}
      aria-live="polite"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          isOpen ? "bg-emerald-500" : "bg-rose-500"
        }`}
        aria-hidden
      />
      <span className={`${isOpen ? "text-emerald-600" : "text-rose-500"}`}>
        {isOpen ? "Open now" : "Closed"}
      </span>
      <span className="text-[#728175]">
        {isOpen
          ? `• Closes ${current?.close || ""}`
          : next
            ? `• Opens ${next.label} ${next.open}`
            : ""}
      </span>
    </div>
  );
}
