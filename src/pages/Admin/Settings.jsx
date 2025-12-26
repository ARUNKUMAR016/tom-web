// src/pages/Admin/Settings.jsx
import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../api/settingsApi";
import { toast } from "sonner";
import { Save, Clock, CalendarOff, Power, CheckCircle2 } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    openingTime: "11:00",
    closingTime: "22:00",
    closedDays: [],
    specialClosedDates: [],
    isShopOpen: true,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setForm({
        openingTime: data.openingTime || "11:00",
        closingTime: data.closingTime || "22:00",
        closedDays: data.closedDays || [],
        specialClosedDates: (data.specialClosedDates || []).map(
          (d) => new Date(d).toISOString().split("T")[0]
        ),
        isShopOpen: data.isShopOpen ?? true,
      });
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      await updateSettings(form);
      toast.success("Settings saved successfully");
    } catch (e) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists = prev.closedDays.includes(day);
      return {
        ...prev,
        closedDays: exists
          ? prev.closedDays.filter((d) => d !== day)
          : [...prev.closedDays, day],
      };
    });
  };

  const addDate = (e) => {
    const val = e.target.value;
    if (!val) return;
    if (!form.specialClosedDates.includes(val)) {
      setForm((prev) => ({
        ...prev,
        specialClosedDates: [...prev.specialClosedDates, val],
      }));
    }
    e.target.value = "";
  };

  const removeDate = (date) => {
    setForm((prev) => ({
      ...prev,
      specialClosedDates: prev.specialClosedDates.filter((d) => d !== date),
    }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-brand-dark/50 animate-pulse font-cutive">
        Loading settings...
      </div>
    );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-brand-dark/10 pb-6">
        <div>
          <h1 className="font-cutive text-4xl font-bold text-brand-dark">
            Restaurant Settings
          </h1>
          <p className="text-brand-dark/60 mt-2 text-lg">
            Manage operating hours and availability.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="hidden md:flex items-center gap-2 bg-brand-dark text-white border border-brand-dark px-6 py-3 rounded-xl hover:bg-brand-primary hover:border-brand-primary disabled:opacity-50 transition shadow-lg font-medium"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hours Card */}
        <section className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm space-y-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 text-brand-dark mb-2">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cutive text-xl font-bold">Opening Hours</h2>
              <p className="text-sm text-brand-dark/40">
                Standard daily schedule
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">
                Opens At
              </label>
              <input
                type="time"
                value={form.openingTime}
                onChange={(e) =>
                  setForm({ ...form, openingTime: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-brand-cream/50 border border-brand-dark/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all outline-none font-medium text-lg text-brand-dark placeholder-brand-dark/20 text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">
                Closes At
              </label>
              <input
                type="time"
                value={form.closingTime}
                onChange={(e) =>
                  setForm({ ...form, closingTime: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-brand-cream/50 border border-brand-dark/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all outline-none font-medium text-lg text-brand-dark placeholder-brand-dark/20 text-center"
              />
            </div>
          </div>
        </section>

        {/* Status Override Card */}
        <section className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm space-y-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 text-brand-dark mb-2">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cutive text-xl font-bold">Shop Status</h2>
              <p className="text-sm text-brand-dark/40">Emergency override</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-brand-cream/50 rounded-2xl border border-brand-dark/5">
            <div>
              <div className="font-bold text-brand-dark text-lg">
                Manual Override
              </div>
              <div className="text-sm text-brand-dark/40 mt-1">
                Force the shop to appear{" "}
                <span
                  className={
                    form.isShopOpen
                      ? "text-emerald-600 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {form.isShopOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isShopOpen}
                onChange={(e) =>
                  setForm({ ...form, isShopOpen: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
        </section>

        {/* Closed Days Card */}
        <section className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-brand-dark">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <CalendarOff className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-cutive text-xl font-bold">
                  Weekly Holidays
                </h2>
                <p className="text-sm text-brand-dark/40">
                  Regular closed days
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex gap-2 bg-brand-cream p-1 rounded-xl border border-brand-dark/5">
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    closedDays: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ],
                  }))
                }
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:bg-white text-brand-dark/40 hover:text-brand-dark hover:shadow-sm"
              >
                Weekends Only
              </button>
              <div className="w-px bg-brand-dark/10 my-1" />
              <button
                onClick={() => setForm((prev) => ({ ...prev, closedDays: [] }))}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:bg-white text-brand-dark/40 hover:text-brand-dark hover:shadow-sm"
              >
                Every Day
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {DAYS.map((day) => {
              const isClosed = form.closedDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
                    isClosed
                      ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                      : "bg-white border-brand-dark/10 text-brand-dark/60 hover:border-brand-dark/20 hover:text-brand-dark"
                  }`}
                >
                  {day}
                  {isClosed && (
                    <CheckCircle2 className="w-5 h-5 absolute -top-2 -right-2 bg-white text-blue-600 rounded-full border border-blue-100 shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Special Dates Card */}
        <section className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 text-brand-dark mb-2">
            <div className="p-3 bg-fuchsia-100 rounded-xl text-fuchsia-600">
              <CalendarOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cutive text-xl font-bold">
                Special Closed Dates
              </h2>
              <p className="text-sm text-brand-dark/40">
                Holidays and exceptions
              </p>
            </div>
          </div>

          <div className="bg-brand-cream/50 p-6 rounded-2xl border border-brand-dark/5">
            <div className="flex gap-4 mb-4">
              <input
                type="date"
                onChange={addDate}
                className="flex-1 p-3 rounded-xl border border-brand-dark/10 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 bg-white text-brand-dark font-medium outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {form.specialClosedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg text-sm font-medium text-fuchsia-700 border border-fuchsia-100 shadow-sm group"
                >
                  <span>
                    {new Date(date).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                  <button
                    onClick={() => removeDate(date)}
                    className="text-fuchsia-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.specialClosedDates.length === 0 && (
                <div className="w-full text-center py-8 text-brand-dark/30 italic text-sm">
                  No special dates added yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Save Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center justify-center w-14 h-14 bg-brand-dark text-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent" />
          ) : (
            <Save className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
