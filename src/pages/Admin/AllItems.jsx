// src/pages/AllItems.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  listFoodItems,
  deleteFoodItem,
  updateFoodItem,
} from "../../api/foodApi";
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
import { resolveImage } from "@/lib/imageUtils";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "main_course", label: "Main Course" },
  { value: "appetizer", label: "Appetizer" },
  { value: "drink", label: "Drinks" },
  { value: "combo", label: "Combos" },
];

const SPICE_LABELS = ["None", "Mild", "Medium", "Hot", "Very Hot", "Fire"];

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
        imagePreview: resolveImage(it.imageUrl) || null,
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
    <div className="min-h-[calc(100vh-4rem)] pb-20">
      {/* Page Header */}
      <header className="flex items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-gold/10 text-neon-gold border border-neon-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-cutive">
              All Food Items
            </h1>
            <p className="text-sm text-white/40">
              Manage every dish — edit, filter, and remove.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/home"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/admin/items/new"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all bg-neon-gold text-black hover:bg-neon-gold/90 hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <PlusCircle className="h-4 w-4" />
            Add New
          </Link>
        </div>
      </header>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-admin-card backdrop-blur-md border border-admin-border">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ingredient, description…"
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm bg-black/40 border border-admin-border text-white placeholder-white/20 focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-xl px-4 py-3 text-sm bg-black/40 border border-admin-border text-white/80 focus:outline-none focus:border-neon-gold/50 cursor-pointer hover:bg-black/60 transition-colors"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-veg</option>
          </select>

          <select
            className="rounded-xl px-4 py-3 text-sm bg-black/40 border border-admin-border text-white/80 focus:outline-none focus:border-neon-gold/50 cursor-pointer hover:bg-black/60 transition-colors"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4 px-2">
          <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                filterVegan
                  ? "bg-neon-green border-neon-green"
                  : "border-white/20 group-hover:border-white/40"
              }`}
            >
              {filterVegan && <div className="w-2 h-2 bg-black rounded-sm" />}
            </div>
            <input
              type="checkbox"
              checked={filterVegan}
              onChange={(e) => setFilterVegan(e.target.checked)}
              className="hidden"
            />
            Vegan
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                filterGluten
                  ? "bg-neon-blue border-neon-blue"
                  : "border-white/20 group-hover:border-white/40"
              }`}
            >
              {filterGluten && <div className="w-2 h-2 bg-black rounded-sm" />}
            </div>
            <input
              type="checkbox"
              checked={filterGluten}
              onChange={(e) => setFilterGluten(e.target.checked)}
              className="hidden"
            />
            Gluten-free
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-4 bg-admin-card border border-admin-border animate-pulse"
            >
              <div className="h-48 w-full rounded-2xl bg-white/5 mb-4" />
              <div className="h-6 w-2/3 bg-white/5 rounded mb-2" />
              <div className="h-4 w-full bg-white/5 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group relative overflow-hidden rounded-3xl bg-admin-card backdrop-blur-md border border-admin-border transition-all duration-300 hover:-translate-y-1 hover:border-neon-gold/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  {it.imageUrl ? (
                    <img
                      src={resolveImage(it.imageUrl)}
                      alt={it.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback */}
                  <div
                    className={`${
                      it.imageUrl ? "hidden" : "flex"
                    } h-full w-full items-center justify-center bg-white/5`}
                  >
                    <ImageOff className="h-8 w-8 text-white/20" />
                  </div>

                  {/* Price chip */}
                  <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-neon-gold font-bold text-sm shadow-lg">
                    {new Intl.NumberFormat("sv-SE", {
                      style: "currency",
                      currency: "SEK",
                    }).format(it.rate)}
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        it.type === "veg"
                          ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {it.type}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 relative z-20">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold text-white leading-tight font-cutive group-hover:text-neon-gold transition-colors">
                      {it.name}
                    </h2>
                  </div>

                  <p className="text-sm text-white/60 line-clamp-2 mb-4 h-10">
                    {it.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {categoryLabel && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60">
                        {categoryLabel}
                      </span>
                    )}

                    {typeof it.spiceLevel === "number" && it.spiceLevel > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
                        <Flame className="h-3 w-3" />
                        {spiceText}
                      </span>
                    )}

                    {it.vegan && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-neon-green/5 border border-neon-green/10 text-xs text-neon-green/80">
                        Vegan
                      </span>
                    )}
                    {it.glutenFree && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-neon-blue/5 border border-neon-blue/10 text-xs text-neon-blue/80">
                        GF
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => startEdit(it)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => askDelete(it)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center bg-white/5">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner">
        <Search className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="text-lg font-bold text-white font-cutive">
        {query ? "No matching items" : "No items yet"}
      </h3>
      <p className="mt-2 text-sm text-white/40 max-w-xs mx-auto">
        {query
          ? "Try a different keyword or clear the filters."
          : "Add your first dish to get started."}
      </p>
      <Link
        to="/admin/items/new"
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold bg-neon-gold text-black hover:bg-neon-gold/90 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
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
    const el = dialogRef.current?.querySelector(
      "input, textarea, button, select"
    );
    el?.focus();
  }, []);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!state) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-[#1a1c20] border border-white/10 shadow-2xl ring-1 ring-white/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-white/5">
          <h3 className="text-lg font-bold text-white font-cutive">
            Edit Item
          </h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="grid gap-6">
            {/* Image */}
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 relative group">
                {state.imagePreview ? (
                  <img
                    src={state.imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-white/20">No image</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Pencil className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Item Image
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm cursor-pointer transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white">
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
                  <PlusCircle className="h-4 w-4" />
                  Change Image
                </label>

                {state.hasNewImage && (
                  <p className="mt-3 text-xs text-neon-gold">
                    * New image selected. Save to apply.
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Name
                </label>
                <input
                  className="w-full rounded-xl px-4 py-3 text-sm bg-black/40 border border-white/10 text-white focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all"
                  value={state.name}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], name: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Rate (SEK)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl px-4 py-3 text-sm bg-black/40 border border-white/10 text-white focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all"
                  value={state.rate}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], rate: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm bg-black/40 border border-white/10 text-white focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all resize-none"
                value={state.description}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    [id]: { ...s[id], description: e.target.value },
                  }))
                }
              />
            </div>

            {/* Type & Category */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Type
                </label>
                <div className="flex gap-4 p-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        state.type === "veg"
                          ? "border-neon-green"
                          : "border-white/20"
                      }`}
                    >
                      {state.type === "veg" && (
                        <div className="w-2 h-2 rounded-full bg-neon-green" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name={`type-${id}`}
                      className="hidden"
                      checked={state.type === "veg"}
                      onChange={() =>
                        onChange((s) => ({
                          ...s,
                          [id]: { ...s[id], type: "veg" },
                        }))
                      }
                    />
                    <span className="text-sm text-white">Veg</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        state.type === "nonveg"
                          ? "border-red-500"
                          : "border-white/20"
                      }`}
                    >
                      {state.type === "nonveg" && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name={`type-${id}`}
                      className="hidden"
                      checked={state.type === "nonveg"}
                      onChange={() =>
                        onChange((s) => ({
                          ...s,
                          [id]: { ...s[id], type: "nonveg" },
                        }))
                      }
                    />
                    <span className="text-sm text-white">Non-veg</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Category
                </label>
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm bg-black/40 border border-white/10 text-white focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all"
                  value={state.category}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], category: e.target.value },
                    }))
                  }
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    state.vegan
                      ? "bg-neon-green border-neon-green"
                      : "border-white/20 bg-black/40"
                  }`}
                >
                  {state.vegan && (
                    <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={state.vegan}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], vegan: e.target.checked },
                    }))
                  }
                  disabled={state.type === "nonveg"}
                />
                <span
                  className={`text-sm ${
                    state.type === "nonveg" ? "text-white/20" : "text-white"
                  }`}
                >
                  Vegan
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    state.glutenFree
                      ? "bg-neon-blue border-neon-blue"
                      : "border-white/20 bg-black/40"
                  }`}
                >
                  {state.glutenFree && (
                    <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={state.glutenFree}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], glutenFree: e.target.checked },
                    }))
                  }
                />
                <span className="text-sm text-white">Gluten-free</span>
              </label>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Ingredients
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl px-4 py-3 text-sm bg-black/40 border border-white/10 text-white focus:outline-none focus:border-neon-gold/50 focus:ring-1 focus:ring-neon-gold/50 transition-all"
                  placeholder="Add ingredient..."
                  value={state._ingredientInput || ""}
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], _ingredientInput: e.target.value },
                    }))
                  }
                  onKeyDown={onIngredientKeyDown}
                />
                <button
                  type="button"
                  onClick={onAddIngredient}
                  className="px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(state.ingredients || []).map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs bg-white/5 border border-white/10 text-white/80"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(idx)}
                      className="hover:text-red-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-4 bg-white/5">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-xl px-6 py-2.5 text-sm font-bold bg-neon-gold text-black hover:bg-neon-gold/90 shadow-lg shadow-neon-gold/10 transition-all"
          >
            Save Changes
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div
        ref={boxRef}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-[#1a1c20] border border-white/10 shadow-2xl ring-1 ring-white/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-white/5">
          <h3 className="text-lg font-bold text-red-400 font-cutive">
            Delete Item
          </h3>
          <button
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 text-sm text-white/80">
          Are you sure you want to delete{" "}
          <span className="font-bold text-white">{name}</span>? This action
          cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-4 bg-white/5">
          <button
            onClick={onCancel}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
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
