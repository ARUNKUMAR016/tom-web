// src/pages/AllItems.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { listFoodItems, deleteFoodItem, updateFoodItem } from "../../api/foodApi";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Save,
  X,
  PlusCircle,
  ArrowLeft,
  ImageOff,
  Search,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "main_course", label: "Main Course" },
  { value: "appetizer", label: "Appetizer" },
  { value: "drink", label: "Drinks" },
  { value: "combo", label: "Combos" },
];

const SPICE_LABELS = ["None", "Mild", "Medium", "Hot", "Very Hot", "Fire"];

// Brand tokens (use inline to avoid Tailwind config changes)
const brand = {
  deep: "#253428",  // primary dark
  sage: "#728175",  // accent
  sand: "#CDBF9C",  // light
};

export default function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGluten, setFilterGluten] = useState(false);

  const [error, setError] = useState("");

  // Edit state
  const [edit, setEdit] = useState({});
  const [editId, setEditId] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ───────────────────────── Data load (server-side filters)
  const load = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await listFoodItems(params);
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load();
  }, []);

  // Debounced reload when filters/search change
  useEffect(() => {
    const h = setTimeout(() => {
      const filters = {
        q: q.trim() || undefined,
        type: filterType === "all" ? undefined : filterType,
        category: filterCategory === "all" ? undefined : filterCategory,
        vegan: filterVegan ? true : undefined,
        glutenFree: filterGluten ? true : undefined,
        sort: "-createdAt",
      };
      load(filters);
    }, 300);
    return () => clearTimeout(h);
  }, [q, filterType, filterCategory, filterVegan, filterGluten]);

  // ───────────────────────── Client-side extra term filter (optional)
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => {
      const termOk =
        it.name?.toLowerCase().includes(term) ||
        it.description?.toLowerCase().includes(term) ||
        (it.ingredients || []).some((g) => g.toLowerCase().includes(term));
      return termOk;
    });
  }, [items, q]);

  // ───────────────────────── Edit helpers
  const startEdit = (it) => {
    const id = String(it.id || it._id);
    setEdit((s) => ({
      ...s,
      [id]: {
        name: it.name ?? "",
        rate: it.rate ?? "",
        description: it.description ?? "",
        type: it.type ?? "veg",
        vegan: !!it.vegan,
        glutenFree: !!it.glutenFree,
        ingredients: Array.isArray(it.ingredients) ? [...it.ingredients] : [],
        category: it.category || "main_course",
        spiceLevel:
          typeof it.spiceLevel === "number" && it.spiceLevel >= 0
            ? it.spiceLevel
            : 0,
        _ingredientInput: "",
        // Image fields:
        imageFile: null,
        imagePreview: it.imageUrl ? `${API_BASE}${it.imageUrl}` : null,
        hasNewImage: false,
      },
    }));
    setEditId(id);
  };

  const cancelEdit = (id) => {
    const st = edit[id];
    if (st?.imagePreview && st.imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(st.imagePreview);
      } catch {}
    }
    setEdit((s) => {
      const n = { ...s };
      delete n[id];
      return n;
    });
    setEditId(null);
  };

  const saveEdit = async (id) => {
    try {
      const payload = edit[id];
      if (!payload?.name?.trim()) return toast.error("Name is required");
      if (payload.rate === "" || isNaN(Number(payload.rate)))
        return toast.error("Rate must be a number");

      const common = {
        name: payload.name.trim(),
        rate: Number(payload.rate),
        description: payload.description?.trim() ?? "",
        type: payload.type,
        vegan: !!payload.vegan,
        glutenFree: !!payload.glutenFree,
        category: payload.category,
        spiceLevel: Number(payload.spiceLevel ?? 0),
        ingredients: (payload.ingredients || [])
          .map((g) => String(g).trim())
          .filter(Boolean),
      };

      let body;
      if (payload.hasNewImage && payload.imageFile) {
        body = { ...common, image: payload.imageFile }; // multipart path
      } else {
        body = { ...common };
      }

      const updated = await updateFoodItem(id, body);
      setItems((prev) =>
        prev.map((x) => (String(x.id || x._id) === id ? updated : x))
      );
      cancelEdit(id);
      toast.success(`Updated: ${updated.name}`);
    } catch (e) {
      toast.error(e.message || "Update failed");
    }
  };

  // ───────────────────────── Delete flow (with dialog)
  const askDelete = (it) => {
    const id = String(it.id || it._id);
    setDeleteTarget({ id, name: it.name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleting(true);
    const prev = items;
    try {
      setItems((cur) => cur.filter((x) => String(x.id || x._id) !== id));
      await deleteFoodItem(id);
      toast.success(`Deleted: ${name}`);
      setDeleteTarget(null);
    } catch (e) {
      setItems(prev);
      toast.error(e.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // --- Ingredients (per edited card) ---
  const addIngredient = (id) => {
    setEdit((s) => {
      const input = s[id]._ingredientInput?.trim();
      if (!input) return s;
      const exists = (s[id].ingredients || []).some(
        (g) => g.toLowerCase() === input.toLowerCase()
      );
      if (exists) return { ...s, [id]: { ...s[id], _ingredientInput: "" } };
      return {
        ...s,
        [id]: {
          ...s[id],
          ingredients: [...(s[id].ingredients || []), input],
          _ingredientInput: "",
        },
      };
    });
  };

  const removeIngredient = (id, idx) => {
    setEdit((s) => {
      const next = [...(s[id].ingredients || [])];
      next.splice(idx, 1);
      return { ...s, [id]: { ...s[id], ingredients: next } };
    });
  };

  const onIngredientKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(id);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)]"
      style={{
        ["--brand-deep"]: brand.deep,
        ["--brand-sage"]: brand.sage,
        ["--brand-sand"]: brand.sand,
      }}
    >
      {/* Page Header (replaces NavHeader) */}
      <header
        className="flex items-center justify-between gap-4 px-5 py-4 border-b"
        style={{ backgroundColor: "var(--brand-sand)", borderColor: "#e6dec7" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg"
               style={{ backgroundColor: "#ffffffa8", border: "1px solid #e6dec7" }}>
            <Search className="h-4 w-4" style={{ color: "var(--brand-deep)" }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "var(--brand-deep)" }}>
              All Food Items
            </h1>
            <p className="text-xs" style={{ color: "rgba(37,52,40,0.7)" }}>
              Manage every dish — edit, filter, and remove.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/home"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid #e6dec7",
              color: "var(--brand-deep)",
            }}
            title="Back to Admin Home"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/admin/items/new"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: "var(--brand-deep)",
              color: "#fff",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
            title="Add New Item"
          >
            <PlusCircle className="h-4 w-4" />
            Add New
          </Link>
        </div>
      </header>

      <div
        className="px-5 py-6"
        style={{ background: "linear-gradient(180deg, #f7f3e6 0%, #efe8d4 100%)" }}
      >
        {/* Controls */}
        <div
          className="mb-6 flex flex-wrap items-center gap-3 rounded-xl p-2 shadow-sm"
          style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "#94a3b8" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, ingredient, description…"
              className="w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                boxShadow: "inset 0 0 0 0 transparent",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(114,129,117,0.25)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 0 transparent")}
            />
          </div>

          {/* Type */}
          <select
            className="w-[160px] rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #e2e8f0", color: "#0f172a" }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-veg</option>
          </select>

          {/* Category */}
          <select
            className="w-[190px] rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #e2e8f0", color: "#0f172a" }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Vegan */}
          <label className="inline-flex items-center gap-2 text-sm px-2 py-1" style={{ color: "#334155" }}>
            <input
              type="checkbox"
              checked={filterVegan}
              onChange={(e) => setFilterVegan(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Vegan
          </label>

          {/* Gluten-free */}
          <label className="inline-flex items-center gap-2 text-sm px-2 py-1" style={{ color: "#334155" }}>
            <input
              type="checkbox"
              checked={filterGluten}
              onChange={(e) => setFilterGluten(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Gluten-free
          </label>
        </div>

        {error && (
          <div
            className="mb-4 rounded-xl px-3 py-2 text-sm"
            style={{ border: "1px solid #fecaca", backgroundColor: "#fef2f2", color: "#b91c1c" }}
          >
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 shadow-sm animate-pulse"
                style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
              >
                <div className="h-40 w-full rounded-lg bg-slate-200 mb-3" />
                <div className="h-5 w-2/3 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-full bg-slate-200 rounded mb-1" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={q} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => {
              const id = String(it.id || it._id);
              const categoryLabel =
                CATEGORY_OPTIONS.find((c) => c.value === it.category)?.label ||
                undefined;
              const spiceText =
                typeof it.spiceLevel === "number"
                  ? SPICE_LABELS[it.spiceLevel] || `${it.spiceLevel}`
                  : null;

              return (
                <div
                  key={id}
                  className="group relative overflow-hidden rounded-2xl shadow-sm transition hover:shadow-md"
                  style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
                >
                  {/* Image */}
                  <div className="relative">
                    {it.imageUrl ? (
                      <img
                        src={`${API_BASE}${it.imageUrl}`}
                        alt={it.name}
                        className="h-44 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextSibling;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Fallback */}
                    <div
                      className={`${it.imageUrl ? "hidden" : "flex"} h-44 w-full items-center justify-center`}
                      style={{ backgroundColor: "#f1f5f9" }}
                    >
                      <ImageOff className="h-6 w-6" style={{ color: "#94a3b8" }} />
                    </div>

                    {/* Price chip */}
                    <div
                      className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "var(--brand-deep)",
                        border: "1px solid var(--brand-sand)",
                      }}
                    >
                      {new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                      }).format(it.rate)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold leading-tight" style={{ color: "#0f172a" }}>
                        {it.name}
                      </h2>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(it)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
                          style={{ borderColor: "#e2e8f0", color: "#334155" }}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => askDelete(it)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-rose-50 hover:bg-rose-100"
                          style={{ borderColor: "#fecdd3", color: "#be123c" }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 text-sm" style={{ color: "#475569" }}>
                      {it.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: it.type === "veg" ? "#dcfce7" : "#fee2e2",
                          color: it.type === "veg" ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {it.type}
                      </span>

                      {categoryLabel && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5"
                          style={{ backgroundColor: "#fff7ed", color: "#b45309", border: "1px dashed #fde68a" }}
                        >
                          {categoryLabel}
                        </span>
                      )}

                      {typeof it.spiceLevel === "number" && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                          style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}
                        >
                          <Flame className="h-3 w-3" />
                          {spiceText}
                        </span>
                      )}

                      {it.vegan && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5"
                              style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>
                          Vegan
                        </span>
                      )}
                      {it.glutenFree && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5"
                              style={{ backgroundColor: "#e0e7ff", color: "#4338ca" }}>
                          GF
                        </span>
                      )}
                    </div>

                    {!!it.ingredients?.length && (
                      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs"
                          style={{ color: "#475569" }}>
                        {it.ingredients.map((g, i) => (
                          <li key={i} className="truncate">• {g}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex items-center">
                      <Link
                        to={`/items/${id}`}
                        className="ml-auto text-sm hover:underline"
                        style={{ color: "var(--brand-sage)" }}
                        title="View details"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editId && (
        <EditDialog
          id={editId}
          state={edit[editId]}
          onClose={() => cancelEdit(editId)}
          onChange={setEdit}
          onSave={() => saveEdit(editId)}
          onAddIngredient={() => addIngredient(editId)}
          onRemoveIngredient={(idx) => removeIngredient(editId, idx)}
          onIngredientKeyDown={(e) => onIngredientKeyDown(e, editId)}
          onPickImage={(file) =>
            setEdit((s) => {
              const prevPreview = s[editId]?.imagePreview;
              if (prevPreview && prevPreview.startsWith("blob:")) {
                try {
                  URL.revokeObjectURL(prevPreview);
                } catch {}
              }
              const url = file ? URL.createObjectURL(file) : null;
              return {
                ...s,
                [editId]: {
                  ...s[editId],
                  imageFile: file ?? null,
                  imagePreview: url ?? s[editId].imagePreview,
                  hasNewImage: !!file,
                },
              };
            })
          }
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          name={deleteTarget.name}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

/* ───────────────────────── Empty State ───────────────────────── */
function EmptyState({ query }) {
  return (
    <div
      className="rounded-2xl border border-dashed p-10 text-center"
      style={{ borderColor: "var(--brand-sand)", backgroundColor: "#faf6ea" }}
    >
      <div
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-sm"
        style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
      >
        <Search className="h-5 w-5" style={{ color: "#ea580c" }} />
      </div>
      <h3 className="text-base font-semibold" style={{ color: "#1f2937" }}>
        {query ? "No matching items" : "No items yet"}
      </h3>
      <p className="mt-1 text-sm" style={{ color: "#475569" }}>
        {query
          ? "Try a different keyword or clear the filters."
          : "Add your first dish to get started."}
      </p>
      <Link
        to="/fooditems"
        className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium hover:opacity-95"
        style={{ backgroundColor: "var(--brand-deep)", color: "#fff" }}
      >
        <PlusCircle className="h-4 w-4" />
        Add New
      </Link>
    </div>
  );
}

/* ───────────────────────── Edit Dialog ───────────────────────── */
function EditDialog({
  id,
  state,
  onClose,
  onChange,
  onSave,
  onAddIngredient,
  onRemoveIngredient,
  onIngredientKeyDown,
  onPickImage,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = dialogRef.current?.querySelector("input, textarea, button, select");
    el?.focus();
  }, []);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!state) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--brand-deep)" }}>Edit Item</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          {/* Image */}
          <Labeled label="Image">
            <div className="mt-2 flex items-start gap-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center"
                   style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                {state.imagePreview ? (
                  <img
                    src={state.imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs" style={{ color: "#94a3b8" }}>No image</span>
                )}
              </div>
              <div className="flex-1">
                <label
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition"
                  style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        return alert("Please choose an image under 5 MB.");
                      }
                      onPickImage(file);
                    }}
                  />
                  Change image
                </label>

                {state.hasNewImage && (
                  <p className="mt-2 text-xs" style={{ color: "#b45309" }}>
                    A new image will be uploaded when you click <b>Save</b>.
                  </p>
                )}
              </div>
            </div>
          </Labeled>

          {/* Name */}
          <Labeled label="Name" className="mt-4">
            <input
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ border: "1px solid var(--brand-sand)" }}
              value={state.name}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], name: e.target.value },
                }))
              }
            />
          </Labeled>

          {/* Rate */}
          <Labeled label="Rate" className="mt-3">
            <input
              type="number"
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ border: "1px solid var(--brand-sand)" }}
              value={state.rate}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], rate: e.target.value },
                }))
              }
            />
          </Labeled>

          {/* Type */}
          <Labeled label="Type" className="mt-3">
            <div className="mt-1 flex gap-4">
              <Radio
                name={`type-${id}`}
                checked={state.type === "veg"}
                onChange={() =>
                  onChange((s) => ({ ...s, [id]: { ...s[id], type: "veg" } }))
                }
                label="Veg"
              />
              <Radio
                name={`type-${id}`}
                checked={state.type === "nonveg"}
                onChange={() =>
                  onChange((s) => ({
                    ...s,
                    [id]: { ...s[id], type: "nonveg" },
                  }))
                }
                label="Non-veg"
              />
            </div>
          </Labeled>

          {/* Category */}
          <Labeled label="Category" className="mt-3">
            <select
              className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-sm focus:outline-none"
              style={{ border: "1px solid var(--brand-sand)" }}
              value={state.category}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], category: e.target.value },
                }))
              }
            >
              {CATEGORY_OPTIONS.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Labeled>

          {/* Vegan & Gluten Free */}
          <div className="mt-3 flex flex-wrap items-center gap-6">
            <Checkbox
              checked={!!state.vegan}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], vegan: e.target.checked },
                }))
              }
              label="Vegan"
            />
            <Checkbox
              checked={!!state.glutenFree}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], glutenFree: e.target.checked },
                }))
              }
              label="Gluten-free"
            />
          </div>

          {/* Spice Level */}
          <Labeled label="Spice Level" className="mt-3">
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={Number(state.spiceLevel ?? 0)}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], spiceLevel: Number(e.target.value) },
                }))
              }
              className="w-full"
            />
            <div className="mt-1 text-xs" style={{ color: "#475569" }}>
              {SPICE_LABELS[state.spiceLevel] ?? "None"}
            </div>
          </Labeled>

          {/* Ingredients */}
          <Labeled label="Ingredients" className="mt-3">
            <div className="mt-2 flex flex-wrap gap-2">
              {(state.ingredients || []).map((g, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                  style={{ backgroundColor: "#fff7ed", border: "1px solid var(--brand-sand)", color: "#334155" }}
                >
                  {g}
                  <button
                    type="button"
                    className="rounded-full px-1 leading-none"
                    style={{ border: "1px solid #fcd34d" }}
                    onClick={() => onRemoveIngredient(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ border: "1px solid var(--brand-sand)" }}
                placeholder="Type an ingredient and press Enter"
                value={state._ingredientInput || ""}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    [id]: { ...s[id], _ingredientInput: e.target.value },
                  }))
                }
                onKeyDown={(e) => onIngredientKeyDown(e, id)}
              />
              <button
                type="button"
                onClick={() => onAddIngredient(id)}
                className="rounded-lg px-3 py-2 text-sm transition"
                style={{ backgroundColor: "#fff", border: "1px solid var(--brand-sand)" }}
              >
                Add
              </button>
            </div>
          </Labeled>

          {/* Description */}
          <Labeled label="Description" className="mt-3">
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ border: "1px solid var(--brand-sand)" }}
              value={state.description}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], description: e.target.value },
                }))
              }
            />
          </Labeled>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-3" style={{ borderColor: "#e5e7eb" }}>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition"
            style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#334155" }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition"
            style={{ backgroundColor: "var(--brand-deep)", color: "#fff" }}
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Delete Dialog ───────────────────────── */
function DeleteDialog({ name, loading, onCancel, onConfirm }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div
        ref={boxRef}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="text-base font-semibold" style={{ color: "#be123c" }}>Delete item</h3>
          <button
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-4 text-sm" style={{ color: "#334155" }}>
          Are you sure you want to delete{" "}
          <span className="font-semibold" style={{ color: "#111827" }}>{name}</span>? This action cannot be
          undone.
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3" style={{ borderColor: "#e5e7eb" }}>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition"
            style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#334155" }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60"
            style={{ backgroundColor: "#e11d48", color: "#fff" }}
            disabled={loading}
          >
            {loading ? (
              "Deleting…"
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Small UI helpers ───────────────────────── */
function Labeled({ label, className = "", children }) {
  return (
    <div className={className}>
      <label className="text-xs" style={{ color: "#64748b" }}>{label}</label>
      {children}
    </div>
  );
}
function Radio({ label, ...props }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
      <input type="radio" {...props} />
      {label}
    </label>
  );
}
function Checkbox({ label, ...props }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
