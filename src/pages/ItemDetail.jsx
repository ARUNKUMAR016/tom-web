// src/pages/ItemDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFoodItem } from "../api/foodApi";
import {
  ArrowLeft,
  Utensils,
  Leaf,
  WheatOff,
  IndianRupee,
  RefreshCcw,
  Home,
} from "lucide-react";
import { toast } from "sonner";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFoodItem(id);
      setItem(data);
    } catch (e) {
      const msg = e?.message || "Failed to load item";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- UI helpers ---
  const displayId = useMemo(() => String(item?._id || item?.id || id || ""), [item, id]);
  const fmt = (d) => (d ? new Date(d).toLocaleString() : "-");
  const isVeg = item?.type === "veg";

  // --- Loading state (animated skeleton) ---
  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Home className="h-4 w-4" />
            <span className="animate-pulse rounded bg-slate-200 px-10 py-1" />
          </div>
        </div>

        {/* Card skeleton */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/60 via-transparent to-slate-50" />

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Utensils className="h-5 w-5 text-[#FF5200]" />
              </div>
              <div>
                <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-6 w-20 animate-pulse rounded bg-slate-200 ml-auto" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200 ml-auto" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="h-5 w-16 animate-pulse rounded bg-slate-200" />
            <span className="h-5 w-16 animate-pulse rounded bg-slate-200" />
            <span className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-5 h-20 w-full animate-pulse rounded-xl bg-slate-100" />

          <div className="mt-6 grid gap-3 text-xs sm:grid-cols-2">
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // --- Error / Not found ---
  if (error || !item) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <Link to="/allitems" className="text-sm text-[#FF5200] hover:underline">
            All Items
          </Link>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-700">
          <div className="flex items-start justify-between">
            <p className="text-sm">{error || "Item not found"}</p>
            <button
              onClick={fetchItem}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white/70 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
              title="Retry"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Content ---
  const {
    name,
    description,
    rate,
    type,
    vegan,
    glutenFree,
    ingredients = [],
    isAvailable,
    createdAt,
    updatedAt,
  } = item;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Top bar with breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-slate-700">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span>›</span>
            <Link to="/allitems" className="hover:text-slate-700">
              Menu
            </Link>
            <span>›</span>
            <span className="text-slate-700 font-medium truncate max-w-[40ch]" title={name}>
              {name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <Link
              to="/allitems"
              className="rounded-xl border border-orange-200 px-3 py-2 text-sm text-[#FF5200] hover:bg-orange-50"
            >
              All Items
            </Link>
          </div>
        </div>

        {/* Detail card */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          {/* soft background wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/70 via-transparent to-slate-50" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Title + icon */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Utensils className="h-5 w-5 text-[#FF5200]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{name}</h1>
                <p className="text-xs text-slate-500">
                  ID: <span className="font-mono">{displayId}</span>
                </p>
              </div>
            </div>

            {/* Price + availability */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-[#FF5200]">
                <IndianRupee className="h-4 w-4" />
                <span className="text-lg font-semibold">{rate}</span>
              </div>
              <div className="mt-1 text-xs">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 ${
                    isAvailable === false
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {isAvailable === false ? "Unavailable" : "Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 border ${
                isVeg
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
              title={type === "veg" ? "Vegetarian" : "Non-vegetarian"}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
              {type}
            </span>

            {vegan && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200"
                title="Vegan"
              >
                <Leaf className="h-3.5 w-3.5" />
                Vegan
              </span>
            )}

            {glutenFree && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700 border border-indigo-200"
                title="Gluten-free"
              >
                <WheatOff className="h-3.5 w-3.5" />
                Gluten-free
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="relative mt-5 text-[15px] leading-7 text-slate-700">
              {description}
            </p>
          )}

          {/* Ingredients */}
          <div className="relative mt-6">
            <h3 className="text-sm font-semibold text-slate-900">Ingredients</h3>
            {ingredients.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {ingredients.map((g, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No ingredients listed.</p>
            )}
          </div>

          {/* Meta */}
          <div className="relative mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div>
              <span className="font-medium text-slate-700">Created:</span>{" "}
              {fmt(createdAt)}
            </div>
            <div>
              <span className="font-medium text-slate-700">Updated:</span>{" "}
              {fmt(updatedAt)}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/allitems"
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Manage Items
          </Link>
          {/* Future: add "Edit", "Duplicate", "Delete" buttons or a drawer here */}
        </div>
      </div>
    </div>
  );
}
