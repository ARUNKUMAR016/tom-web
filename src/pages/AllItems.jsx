// src/pages/AllItems.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { listFoodItems, deleteFoodItem, updateFoodItem } from "../api/foodApi";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Save, X, PlusCircle, ArrowLeft } from "lucide-react";
import NavHeader from "../components/NavHeader";
import { toast } from "sonner";

export default function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState("");

  // Edit state
  const [edit, setEdit] = useState({});
  const [editId, setEditId] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  // ───────────────────────── Data load
  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listFoodItems();
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  // ───────────────────────── Filters
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((it) => {
      const typeOk = filterType === "all" ? true : it.type === filterType;
      const termOk =
        !term ||
        it.name?.toLowerCase().includes(term) ||
        it.description?.toLowerCase().includes(term) ||
        (it.ingredients || []).some((g) => g.toLowerCase().includes(term));
      return typeOk && termOk;
    });
  }, [items, q, filterType]);

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
        _ingredientInput: "",
      },
    }));
    setEditId(id); // open dialog
  };

  const cancelEdit = (id) => {
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

      const body = {
        name: payload.name.trim(),
        rate: Number(payload.rate),
        description: payload.description?.trim() ?? "",
        type: payload.type,
        vegan: !!payload.vegan,
        glutenFree: !!payload.glutenFree,
        ingredients: (payload.ingredients || [])
          .map((g) => String(g).trim())
          .filter(Boolean),
      };

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
      // optimistic remove
      setItems((cur) => cur.filter((x) => String(x.id || x._id) !== id));
      await deleteFoodItem(id);
      toast.success(`Deleted: ${name}`);
      setDeleteTarget(null);
    } catch (e) {
      // revert on failure
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
    <div className="min-h-[calc(100vh-4rem)]">
      <NavHeader
        title="All Food Items"
        subtitle="Manage every dish — edit, filter, and remove."
        right={
          <div className="flex gap-2">
            <Link
              to="/admin/home"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
              title="Back to Admin Home"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>

            <Link
              to="/fooditems"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
              title="Add New Item"
            >
              <PlusCircle className="h-4 w-4" />
              Add New
            </Link>
          </div>
        }
      />

      <div className="px-5 py-6 bg-[#fff7ed] min-h-screen">
        {/* Controls */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ingredient, description…"
            className="flex-1 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
          />
          <select
            className="w-[220px] rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-veg</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading…</p>
        ) : filtered.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => {
              const id = String(it.id || it._id);

              return (
                <div
                  key={id}
                  className="relative rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
                >
                  {/* Corner actions */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button
                      onClick={() => startEdit(it)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 backdrop-blur text-slate-700 hover:bg-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => askDelete(it)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50/90 backdrop-blur text-rose-700 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="pr-25">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold text-[#0f172a]">
                          {it.name}
                        </h2>
                        <p className="text-sm text-slate-600">
                          {it.description}
                        </p>
                      </div>
                      <span className="text-base font-semibold text-[#FF5200]">
                        ₹{it.rate}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <span
                        className={`inline-block rounded px-2 py-0.5 ${
                          it.type === "veg"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {it.type}
                      </span>
                      {it.vegan && (
                        <span className="ml-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-emerald-700">
                          Vegan
                        </span>
                      )}
                      {it.glutenFree && (
                        <span className="ml-2 inline-block rounded bg-indigo-100 px-2 py-0.5 text-indigo-700">
                          GF
                        </span>
                      )}
                    </div>

                    {!!it.ingredients?.length && (
                      <ul className="mt-2 list-disc list-inside text-xs text-slate-600">
                        {it.ingredients.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to={`/items/${id}`}
                      className="ml-auto text-sm text-[#FF5200] hover:underline"
                      title="View details"
                    >
                      View
                    </Link>
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
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = dialogRef.current?.querySelector("input, textarea, button");
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
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Edit Item</h3>
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
          {/* Name */}
          <div className="mb-3">
            <label className="text-xs text-slate-600">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
              value={state.name}
              onChange={(e) =>
                onChange((s) => ({ ...s, [id]: { ...s[id], name: e.target.value } }))
              }
            />
          </div>

          {/* Rate */}
          <div className="mb-3">
            <label className="text-xs text-slate-600">Rate</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
              value={state.rate}
              onChange={(e) =>
                onChange((s) => ({ ...s, [id]: { ...s[id], rate: e.target.value } }))
              }
            />
          </div>

          {/* Type */}
          <div className="mb-3">
            <label className="text-xs text-slate-600">Type</label>
            <div className="mt-1 flex gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`type-${id}`}
                  checked={state.type === "veg"}
                  onChange={() =>
                    onChange((s) => ({ ...s, [id]: { ...s[id], type: "veg" } }))
                  }
                />
                Veg
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`type-${id}`}
                  checked={state.type === "nonveg"}
                  onChange={() =>
                    onChange((s) => ({ ...s, [id]: { ...s[id], type: "nonveg" } }))
                  }
                />
                Non-veg
              </label>
            </div>
          </div>

          {/* Vegan & Gluten Free */}
          <div className="mb-3 flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!state.vegan}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    [id]: { ...s[id], vegan: e.target.checked },
                  }))
                }
              />
              Vegan
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!state.glutenFree}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    [id]: { ...s[id], glutenFree: e.target.checked },
                  }))
                }
              />
              Gluten-free
            </label>
          </div>

          {/* Ingredients */}
          <div className="mb-3">
            <label className="text-xs text-slate-600">Ingredients</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(state.ingredients || []).map((g, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-slate-700"
                >
                  {g}
                  <button
                    type="button"
                    className="rounded-full border border-orange-300 px-1 leading-none hover:bg-orange-100"
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
                className="flex-1 rounded-lg border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
                placeholder="Type an ingredient and press Enter"
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
                className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm hover:bg-orange-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-1">
            <label className="text-xs text-slate-600">Description</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
              value={state.description}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  [id]: { ...s[id], description: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-1 rounded-lg bg-[#FF5200] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
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
        className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold text-rose-700">Delete item</h3>
          <button
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-4 text-sm text-slate-700">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{name}</span>? This action cannot be
          undone.
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Deleting…" : <><Trash2 className="h-4 w-4" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}
