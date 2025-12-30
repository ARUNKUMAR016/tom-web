// src/pages/AllItems.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  listFoodItems,
  deleteFoodItem,
  updateFoodItem,
} from "../../api/foodapi";
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
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { resolveImage } from "@/lib/imageUtils";
import { Switch } from "@/components/ui/switch";

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
        isChefRecommended: !!it.isChefRecommended,
        _ingredientInput: "",
        // Image fields:
        imageFile: null,
        imagePreview: resolveImage(it.imageUrl, 400) || null,
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
        isChefRecommended: !!payload.isChefRecommended,
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

  // ───────────────────────── Availability Toggle
  const toggleAvailability = async (id, currentStatus) => {
    // Optimistic update
    const prevItems = [...items];
    setItems((current) =>
      current.map((item) => {
        if (String(item.id || item._id) === id) {
          return { ...item, isAvailable: !currentStatus };
        }
        return item;
      })
    );

    try {
      await updateFoodItem(id, { isAvailable: !currentStatus });
      toast.success(
        !currentStatus ? "Marked as Available" : "Marked as Unavailable"
      );
    } catch (e) {
      // Revert on failure
      setItems(prevItems);
      toast.error("Failed to update status");
      console.error(e);
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-display uppercase tracking-tight">
              All Food Items
            </h1>
            <p className="text-sm text-brand-dark/40 font-medium">
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
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all bg-brand-primary text-white hover:bg-brand-primary/90 hover:scale-105 shadow-lg shadow-brand-primary/20"
          >
            <PlusCircle className="h-4 w-4" />
            Add New
          </Link>
        </div>
      </header>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white border border-brand-dark/5 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ingredient, description…"
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm bg-brand-cream/30 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-xl px-4 py-3 text-sm bg-white border border-brand-dark/10 text-brand-dark focus:outline-none focus:border-brand-primary/50 cursor-pointer hover:bg-brand-cream transition-colors font-medium shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-veg</option>
          </select>

          <select
            className="rounded-xl px-4 py-3 text-sm bg-white border border-brand-dark/10 text-brand-dark focus:outline-none focus:border-brand-primary/50 cursor-pointer hover:bg-brand-cream transition-colors font-medium shadow-sm"
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
          <label className="inline-flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                filterVegan
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-brand-dark/20 group-hover:border-brand-dark/40"
              }`}
            >
              {filterVegan && <Check className="w-3 h-3 text-white" />}
            </div>
            <input
              type="checkbox"
              checked={filterVegan}
              onChange={(e) => setFilterVegan(e.target.checked)}
              className="hidden"
            />
            Vegan
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                filterGluten
                  ? "bg-blue-500 border-blue-500"
                  : "border-brand-dark/20 group-hover:border-brand-dark/40"
              }`}
            >
              {filterGluten && <Check className="w-3 h-3 text-white" />}
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
              className="rounded-3xl p-4 bg-white border border-brand-dark/5 animate-pulse shadow-sm"
            >
              <div className="h-48 w-full rounded-2xl bg-brand-cream mb-4" />
              <div className="h-6 w-2/3 bg-brand-cream rounded mb-2" />
              <div className="h-4 w-full bg-brand-cream rounded mb-2" />
              <div className="h-4 w-1/2 bg-brand-cream rounded" />
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
                className="group relative overflow-hidden rounded-3xl bg-white border border-brand-dark/5 premium-shadow-hover"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  {it.imageUrl ? (
                    <img
                      src={resolveImage(it.imageUrl, 400)}
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
                  <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-brand-secondary text-brand-dark font-display font-bold text-sm shadow-xl border border-white/40 backdrop-blur-md">
                    {new Intl.NumberFormat("sv-SE", {
                      style: "currency",
                      currency: "SEK",
                    }).format(it.rate)}
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                        it.type === "veg"
                          ? "bg-emerald-500/90 text-white border-white/20"
                          : "bg-brand-primary/90 text-white border-white/20"
                      }`}
                    >
                      {it.type}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 relative z-20">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold text-brand-dark leading-tight font-display uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                      {it.name}
                    </h2>
                    <div
                      className="flex items-center gap-2"
                      title="Toggle Availability"
                    >
                      <Switch
                        checked={!!it.isAvailable}
                        onCheckedChange={() =>
                          toggleAvailability(id, !!it.isAvailable)
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-brand-dark/60 font-medium line-clamp-2 mb-4 h-10">
                    {it.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {categoryLabel && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-cream border border-brand-dark/5 text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                    )}

                    {it.isChefRecommended && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-secondary/20 border border-brand-secondary/30 text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
                        ⭐ CHEF'S PICK
                      </span>
                    )}

                    {typeof it.spiceLevel === "number" && it.spiceLevel > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                        <Flame className="h-3 w-3 fill-orange-500" />
                        {spiceText}
                      </span>
                    )}

                    {it.vegan && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Vegan
                      </span>
                    )}
                    {it.glutenFree && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        GF
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-brand-dark/5">
                    <button
                      onClick={() => startEdit(it)}
                      className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-brand-cream hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs uppercase tracking-widest transition-all duration-300"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => askDelete(it)}
                      className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-all duration-300 border border-red-100"
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

  const spiceText = SPICE_LABELS[state.spiceLevel] ?? "None";
  const spiceBar = Array.from({ length: 6 }, (_, i) => i <= state.spiceLevel);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header - Clean & Minimal */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Pencil className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark font-display uppercase tracking-wide">
                Edit Item
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ID: {id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body - Clean 2-Col Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left Column: Media & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Image Preview Card */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Dish Image
                </label>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                  {state.imagePreview ? (
                    <img
                      src={state.imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300">
                      <ImageOff className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024)
                          return alert("max 5mb");
                        onPickImage(file);
                      }}
                    />
                    <Pencil className="w-8 h-8 text-white mb-2" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      Change
                    </span>
                  </div>
                </div>
                {state.hasNewImage && (
                  <p className="text-center text-xs font-bold text-brand-primary animate-pulse">
                    * New image selected
                  </p>
                )}
              </div>

              {/* Spice Level Card */}
              <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100/50">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                    Spice Level
                  </span>
                </div>
                <div className="relative h-12 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={state.spiceLevel}
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], spiceLevel: Number(e.target.value) },
                      }))
                    }
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full flex gap-1 h-3">
                    {spiceBar.map((filled, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          filled
                            ? idx < 2
                              ? "bg-green-400"
                              : idx < 4
                              ? "bg-yellow-400"
                              : "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 font-bold text-orange-900/40">
                  <span>Mild</span>
                  <span className="text-orange-600">{spiceText}</span>
                  <span>Fire</span>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-dark"
                    value={state.name}
                    placeholder="Item Name"
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Price (SEK)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-dark"
                    value={state.rate}
                    placeholder="0.00"
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], rate: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-brand-dark resize-none"
                  value={state.description}
                  placeholder="Describe the dish..."
                  onChange={(e) =>
                    onChange((s) => ({
                      ...s,
                      [id]: { ...s[id], description: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Type Toggles */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Type
                  </label>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    {["veg", "nonveg"].map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          onChange((s) => ({
                            ...s,
                            [id]: {
                              ...s[id],
                              type: t,
                              vegan: t === "nonveg" ? false : s[id].vegan,
                            },
                          }))
                        }
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                          state.type === t
                            ? "bg-white text-brand-dark shadow-sm scale-100"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {t === "veg" ? "Vegetarian" : "Non-Veg"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-dark cursor-pointer"
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
              <div className="flex gap-4 pt-2">
                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    state.vegan
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-100 hover:border-gray-200"
                  } ${
                    state.type === "nonveg"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      state.vegan
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <input
                    type="checkbox"
                    checked={state.vegan}
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], vegan: e.target.checked },
                      }))
                    }
                    disabled={state.type === "nonveg"}
                    className="hidden"
                  />
                  <span
                    className={`text-xs font-bold uppercase ${
                      state.vegan ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    Vegan
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    state.glutenFree
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      state.glutenFree
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <input
                    type="checkbox"
                    checked={state.glutenFree}
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], glutenFree: e.target.checked },
                      }))
                    }
                    className="hidden"
                  />
                  <span
                    className={`text-xs font-bold uppercase ${
                      state.glutenFree ? "text-blue-700" : "text-gray-400"
                    }`}
                  >
                    Gluten Free
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    state.isChefRecommended
                      ? "border-brand-secondary bg-brand-secondary/10"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      state.isChefRecommended
                        ? "bg-brand-secondary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <input
                    type="checkbox"
                    checked={state.isChefRecommended}
                    onChange={(e) =>
                      onChange((s) => ({
                        ...s,
                        [id]: { ...s[id], isChefRecommended: e.target.checked },
                      }))
                    }
                    className="hidden"
                  />
                  <span
                    className={`text-xs font-bold uppercase ${
                      state.isChefRecommended
                        ? "text-brand-secondary"
                        : "text-gray-400"
                    }`}
                  >
                    ⭐ Chef's Pick
                  </span>
                </label>
              </div>

              {/* Ingredients */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Ingredients
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-sm"
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
                    className="bg-brand-dark text-white px-6 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-primary transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(state.ingredients || []).map((ing, idx) => (
                    <span
                      key={idx}
                      className="pl-3 pr-2 py-1.5 rounded-lg bg-gray-100 text-brand-dark text-xs font-bold flex items-center gap-2 group hover:bg-red-50 hover:text-red-500 transition-colors cursor-default"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => onRemoveIngredient(idx)}
                        className="opacity-20 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-400 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-8 py-3 rounded-xl bg-brand-primary text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:scale-105 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
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
        className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white border border-brand-dark/5 shadow-2xl relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-dark/5 px-6 py-4 bg-red-50">
          <h3 className="text-lg font-bold text-red-600 font-display uppercase tracking-tight">
            Delete Item
          </h3>
          <button
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white text-brand-dark/40 hover:text-red-600 transition-colors shadow-sm"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-8 text-sm text-brand-dark/60 font-medium">
          Are you sure you want to delete{" "}
          <span className="font-bold text-brand-primary">{name}</span>? This
          action cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-brand-dark/5 px-6 py-4 bg-brand-cream/30">
          <button
            onClick={onCancel}
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-dark/40 hover:text-brand-dark hover:bg-white transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 active:scale-95"
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
