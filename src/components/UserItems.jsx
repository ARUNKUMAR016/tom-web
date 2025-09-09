import React, { useEffect, useState, useMemo } from "react";
import { listFoodItems } from "../api/foodApi";
import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Indian veg/non-veg symbol (square with dot) */
function VegMark({ type = "veg", className = "" }) {
  const isVeg = type === "veg";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] ring-1 ring-current ${className}`}
      style={{ width: 16, height: 16, color: isVeg ? "#17803a" : "#b2332a" }}
      title={isVeg ? "Veg" : "Non-veg"}
    >
      <span className="rounded-full" style={{ width: 8, height: 8, background: "currentColor" }} />
    </span>
  );
}

/** tiny overlay chip inside image */
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-800 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

export default function UserItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listFoodItems();
        setItems(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ordered = useMemo(() => {
    // soft grouping: veg first, then nonveg; stable aesthetic order
    const copy = [...items];
    copy.sort((a, b) => (a.type === b.type ? 0 : a.type === "veg" ? -1 : 1));
    return copy;
  }, [items]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="h-28 w-28 rounded-2xl bg-amber-100/70" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!ordered.length) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto w-12 rounded-full bg-white p-3 shadow">
          <span className="block text-xl">🪔</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-slate-800">Menu will be served shortly</h3>
        <p className="text-sm text-slate-600">Please check back in a little while.</p>
      </section>
    );
  }

  return (
    <section
      className="
        mx-auto max-w-6xl px-6 py-16
        bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(255,163,0,0.06),transparent),radial-gradient(1000px_500px_at_90%_110%,rgba(125,26,26,0.06),transparent)]
      "
    >
      {/* Section heading with Tamil subhead */}
      <header className="mb-10">
        <p className="text-[13px] tracking-[0.2em] font-semibold text-[#7d1a1a]">TASTE OF MADURAI</p>
        <h2 className="mt-1 font-serif text-3xl md:text-4xl font-bold text-slate-900">
          Signature Dishes
        </h2>
        <p className="mt-1 text-sm text-slate-600">தமிழ் நாட்டு சுவைகள் • Flavours of Tamil Nadu</p>
      </header>

      {/* two-column elegant list, no “cards” */}
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {ordered.map((it, idx) => {
          const id = String(it.id || it._id);
          return (
            <Link
              to={`/items/${id}`}
              key={id}
              className="group flex gap-6"
              title={`View ${it.name}`}
            >
              {/* image: smaller, refined border, slight parallax on hover */}
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-amber-200/70">
                {it.imageUrl ? (
                  <img
                    src={`${API_BASE}${it.imageUrl}`}
                    alt={it.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fb = e.currentTarget.nextSibling;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`${it.imageUrl ? "hidden" : "flex"} h-full w-full items-center justify-center bg-amber-50`}
                >
                  <ImageOff className="h-6 w-6 text-slate-400" />
                </div>

                {/* overlay badges in the image */}
                <div className="absolute left-2 top-2 flex items-center gap-1">
                  <VegMark type={it.type} />
                  <Chip>{it.type}</Chip>
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  {it.vegan && <Chip>🌿 Vegan</Chip>}
                  {it.glutenFree && <Chip>🚫🌾 GF</Chip>}
                </div>
                <div className="absolute bottom-2 right-2 rounded-full bg-[#FF5200]/95 px-2.5 py-0.5 text-[12px] font-semibold text-white shadow">
                  ₹{Number(it.rate).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* text block */}
              <div className="flex-1 border-b border-dotted border-amber-200/70 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl font-semibold text-slate-900 leading-tight group-hover:text-[#7d1a1a]">
                    {it.name}
                  </h3>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-700">
                  {it.description}
                </p>

                {!!it.ingredients?.length && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {it.ingredients.slice(0, 6).map((g, i) => (
                      <li
                        key={i}
                        className="rounded-full bg-white px-2.5 py-0.5 text-[11px] text-amber-900 ring-1 ring-amber-200"
                      >
                        {g}
                      </li>
                    ))}
                    {it.ingredients.length > 6 && (
                      <li className="text-[11px] text-slate-500">
                        +{it.ingredients.length - 6} more
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
