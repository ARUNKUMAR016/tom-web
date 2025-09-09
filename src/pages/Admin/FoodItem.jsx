// src/pages/FoodItem.jsx
import React, { useState, useMemo } from "react";
import { createFoodItem } from "../../api/foodApi";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const CATEGORIES = [
  { value: "main_course", label: "Main Course" },
  { value: "appetizer", label: "Appetizer" },
  { value: "drink", label: "Drinks" },
  { value: "combo", label: "Combos" },
];

const SPICE_LABELS = ["None", "Mild", "Medium", "Hot", "Very Hot", "Fire"];

// Brand tokens
const brand = {
  deep: "#253428",   // primary dark
  sage: "#728175",   // accent
  sand: "#CDBF9C",   // light
};

const FoodItem = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    rate: "",
    type: "veg",
    vegan: false,
    glutenFree: false,
    ingredients: [],
    category: "main_course",
    spiceLevel: 0,
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (
      !form.ingredients.map((i) => i.toLowerCase()).includes(trimmed.toLowerCase())
    ) {
      setForm((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, trimmed],
      }));
    }
    setIngredientInput("");
  };

  const onIngredientKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (ing) =>
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ing),
    }));

  const onTypeChange = (val) => {
    if (val === "nonveg" && form.vegan) {
      setForm((prev) => ({ ...prev, type: val, vegan: false }));
    } else {
      setForm((prev) => ({ ...prev, type: val }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.image) e.image = "Image is required.";
    if (form.rate === "" || Number(form.rate) <= 0) e.rate = "Rate must be positive.";
    if (form.description.trim().length < 10)
      e.description = "Description should be at least 10 characters.";
    if (form.ingredients.length === 0)
      e.ingredients = "Add at least one ingredient.";
    if (form.type === "nonveg" && form.vegan)
      e.vegan = "Non-veg item cannot be vegan.";
    if (!form.category) e.category = "Category is required.";
    if (form.spiceLevel < 0 || form.spiceLevel > 5)
      e.spiceLevel = "Choose a spice level between 0 and 5.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (file) => {
    if (!file) {
      setField("image", null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only PNG/JPG/JPEG/WEBP images are allowed.",
      }));
      return;
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_IMAGE_MB) {
      setErrors((prev) => ({
        ...prev,
        image: `Image must be ≤ ${MAX_IMAGE_MB}MB.`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: undefined }));
    setField("image", file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      ...form,
      rate: Number(form.rate),
      spiceLevel: Number(form.spiceLevel),
    };

    try {
      setLoading(true);
      const created = await createFoodItem(payload);
      toast.success(`Saved: ${created.name}`);

      setForm({
        name: "",
        description: "",
        image: null,
        rate: "",
        type: "veg",
        vegan: false,
        glutenFree: false,
        ingredients: [],
        category: "main_course",
        spiceLevel: 0,
      });
      setIngredientInput("");
      setErrors({});
    } catch (err) {
      setServerError(err.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const badge = form.type === "veg" ? "Veg" : "Non-veg";
  const spiceText = SPICE_LABELS[form.spiceLevel] ?? "None";

  const spiceBar = useMemo(() => {
    // 6 segments (0..5). Fill up to spiceLevel
    return Array.from({ length: 6 }, (_, i) => i <= form.spiceLevel);
  }, [form.spiceLevel]);

  return (
    <div
      className="min-h-screen"
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
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#ffffffa8", border: "1px solid #e6dec7" }}
          >
            {/* simple dot/emoji as identity mark */}
            <span style={{ color: "var(--brand-deep)", fontWeight: 700 }}>＋</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "var(--brand-deep)" }}>
              Add Food Item
            </h1>
            <p className="text-xs" style={{ color: "rgba(37,52,40,0.7)" }}>
              Create a new dish for Taste of Madurai menu
            </p>
          </div>
        </div>

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
      </header>

      {/* Content */}
      <div
        className="p-8"
        style={{ background: "linear-gradient(180deg, #f7f3e6 0%, #efe8d4 100%)" }}
      >
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
            style={{ border: "1px solid var(--brand-sand)" }}
          >
            <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Add Food Item
            </h2>

            {serverError && (
              <div
                className="text-sm rounded-xl px-4 py-2"
                style={{ color: "#b91c1c", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                {serverError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Eg: Paneer Butter Masala"
                className="mt-1 h-12 w-full rounded-xl px-4 text-[15px] outline-none"
                style={{ border: "1px solid var(--brand-sand)" }}
              />
              {errors.name && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Short, tasty description…"
                className="mt-1 w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                style={{ border: "1px solid var(--brand-sand)" }}
              />
              {errors.description && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Category<span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="mt-1 h-12 w-full rounded-xl bg-white px-4 text-[15px] outline-none"
                style={{ border: "1px solid var(--brand-sand)" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.category}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#334155" }}>
                Image <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition"
                style={{ borderColor: "var(--brand-sand)", backgroundColor: "#f8fafc" }}
                title="Upload image"
              >
                <svg
                  className="w-10 h-10 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--brand-deep)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h1m4-4h.01M12 20h9" />
                </svg>
                <p className="text-sm">
                  <span className="font-medium" style={{ color: "var(--brand-deep)" }}>
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  PNG, JPG, JPEG, WEBP up to {MAX_IMAGE_MB}MB
                </p>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </label>

              {form.image && (
                <p className="mt-2 text-xs" style={{ color: "#334155" }}>
                  Selected: <span className="font-medium">{form.image.name}</span>
                </p>
              )}
              {errors.image && (
                <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.image}</p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Ingredients<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={onIngredientKeyDown}
                  placeholder="Type an ingredient and press Enter"
                  className="flex-1 h-12 rounded-xl px-4 text-[15px] outline-none"
                  style={{ border: "1px solid var(--brand-sand)" }}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="h-12 rounded-xl px-4 text-white font-medium transition"
                  style={{ backgroundColor: "var(--brand-deep)" }}
                >
                  Add
                </button>
              </div>
              {errors.ingredients && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.ingredients}</p>
              )}
              {form.ingredients.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                      style={{ backgroundColor: "#fff7ed", border: "1px solid var(--brand-sand)", color: "#334155" }}
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing)}
                        className="rounded-full w-5 h-5 grid place-items-center"
                        style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Rate (kr)<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }}>
                  kr
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) => setField("rate", e.target.value)}
                  placeholder="Eg: 179.00"
                  className="h-12 w-full rounded-xl pl-10 pr-4 text-[15px] outline-none"
                  style={{ border: "1px solid var(--brand-sand)" }}
                />
              </div>
              {errors.rate && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.rate}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <span className="block text-sm font-medium" style={{ color: "#334155" }}>
                Type<span className="text-red-500">*</span>
              </span>
              <div className="mt-2 flex gap-6" style={{ color: "#334155" }}>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="veg"
                    checked={form.type === "veg"}
                    onChange={() => onTypeChange("veg")}
                  />
                  Veg
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="nonveg"
                    checked={form.type === "nonveg"}
                    onChange={() => onTypeChange("nonveg")}
                  />
                  Non-veg
                </label>
              </div>
            </div>

            {/* Vegan + Gluten-free */}
            <div className="grid sm:grid-cols-2 gap-3" style={{ color: "#334155" }}>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.vegan}
                  onChange={(e) => setField("vegan", e.target.checked)}
                  disabled={form.type === "nonveg"}
                />
                <span className={`text-sm ${form.type === "nonveg" ? "text-slate-400" : ""}`}>
                  Vegan {form.type === "nonveg" ? "(disabled for Non-veg)" : ""}
                </span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.glutenFree}
                  onChange={(e) => setField("glutenFree", e.target.checked)}
                />
                <span className="text-sm">Gluten-free</span>
              </label>
            </div>
            {errors.vegan && (
              <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.vegan}</p>
            )}

            {/* Spice Level */}
            <div>
              <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                Spice Level
              </label>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={form.spiceLevel}
                  onChange={(e) => setField("spiceLevel", Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs" style={{ color: "#64748b" }}>
                  <span>None</span><span>Mild</span><span>Medium</span>
                  <span>Hot</span><span>Very Hot</span><span>Fire</span>
                </div>

                {/* Pepper heat bar */}
                <div className="mt-3 flex gap-1">
                  {spiceBar.map((filled, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded ${filled ? "" : "bg-slate-200"}`}
                      style={
                        filled
                          ? {
                              background:
                                idx < 2
                                  ? "linear-gradient(90deg, #86efac, #22c55e)"
                                  : idx < 4
                                  ? "linear-gradient(90deg, #fde047, #fb923c)"
                                  : "linear-gradient(90deg, #fb923c, #dc2626)",
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: "#334155" }}>
                  Selected: <span style={{ color: "var(--brand-sage)" }}>{spiceText}</span>
                </p>
              </div>
              {errors.spiceLevel && (
                <p className="text-xs" style={{ color: "#b91c1c" }}>{errors.spiceLevel}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-xl px-6 text-[15px] font-semibold transition disabled:opacity-60"
                style={{ backgroundColor: "var(--brand-deep)", color: "#fff" }}
              >
                {loading ? "Saving..." : "Save Item"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: "",
                    description: "",
                    image: null,
                    rate: "",
                    type: "veg",
                    vegan: false,
                    glutenFree: false,
                    ingredients: [],
                    category: "main_course",
                    spiceLevel: 0,
                  });
                  setIngredientInput("");
                  setErrors({});
                  setServerError("");
                }}
                className="h-12 rounded-xl px-6 text-[15px] transition"
                style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#334155" }}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Preview */}
          <div
            className="bg-white rounded-3xl shadow-xl p-8"
            style={{ border: "1px solid var(--brand-sand)" }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#0f172a" }}>
              Preview
            </h3>
            <div className="rounded-2xl p-6" style={{ border: "1px solid var(--brand-sand)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {form.image ? (
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Preview"
                      className="w-32 h-32 rounded-2xl object-cover border shadow-md"
                      style={{ borderColor: "var(--brand-sand)" }}
                    />
                  ) : (
                    <div
                      className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-dashed text-sm"
                      style={{ borderColor: "var(--brand-sand)", color: "#94a3b8" }}
                    >
                      No image
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-semibold" style={{ color: "#0f172a" }}>
                      {form.name || "Item name"}
                    </h4>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: form.type === "veg" ? "#dcfce7" : "#fee2e2",
                        color: form.type === "veg" ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {badge}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#f1f5f9", color: "#334155" }}
                    >
                      {CATEGORIES.find((c) => c.value === form.category)?.label || "Main Course"}
                    </span>
                    {form.vegan && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>
                        Vegan
                      </span>
                    )}
                    {form.glutenFree && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e0e7ff", color: "#4338ca" }}>
                        Gluten-free
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}>
                      Spice: {SPICE_LABELS[form.spiceLevel]}
                    </span>
                  </div>

                  <p className="text-sm" style={{ color: "#475569" }}>
                    {form.description || "Description will appear here…"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-3xl font-bold" style={{ color: "#0f172a" }}>
                      {form.rate
                        ? new Intl.NumberFormat("sv-SE", {
                            style: "currency",
                            currency: "SEK",
                          }).format(Number(form.rate))
                        : "0,00 kr"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mt-6">
                <p className="text-xs font-medium mb-2" style={{ color: "#334155" }}>
                  Ingredients
                </p>
                {form.ingredients.length ? (
                  <div className="flex flex-wrap gap-2">
                    {form.ingredients.map((ing) => (
                      <span
                        key={`preview-${ing}`}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: "#f1f5f9", color: "#334155" }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "#64748b" }}>No ingredients added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
