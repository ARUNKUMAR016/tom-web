// src/pages/Admin/FoodItem.jsx
import React, { useState, useMemo } from "react";
import { createFoodItem } from "../../api/foodapi";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Check, Flame, Plus } from "lucide-react";
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
    isChefRecommended: false,
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
      !form.ingredients
        .map((i) => i.toLowerCase())
        .includes(trimmed.toLowerCase())
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
    if (form.rate === "" || Number(form.rate) <= 0)
      e.rate = "Rate must be positive.";
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
        isChefRecommended: false,
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
    return Array.from({ length: 6 }, (_, i) => i <= form.spiceLevel);
  }, [form.spiceLevel]);

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20">
      {/* Page Header */}
      <header className="flex items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-display uppercase tracking-tight">
              Add Food Item
            </h1>
            <p className="text-sm text-brand-dark/40 font-medium">
              Create a new dish for Taste of Madurai menu
            </p>
          </div>
        </div>

        <Link
          to="/admin/home"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white border border-brand-dark/10 text-brand-dark/60 hover:text-brand-dark hover:border-brand-dark/20 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </header>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl p-8 space-y-6 shadow-sm border border-brand-dark/5"
        >
          <h2 className="text-xl font-bold text-brand-dark font-display uppercase tracking-tight border-b border-brand-dark/5 pb-4">
            Item Details
          </h2>

          {serverError && (
            <div className="text-sm rounded-xl px-4 py-3 bg-red-50 border border-red-100 text-red-600">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Eg: Paneer Butter Masala"
              className="w-full rounded-xl px-4 py-3 text-sm bg-brand-cream/50 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium"
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short, tasty description…"
              className="w-full rounded-xl px-4 py-3 text-sm bg-brand-cream/50 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none font-medium"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm bg-brand-cream/50 border border-brand-dark/10 text-brand-dark focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all appearance-none font-medium cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-dark/40">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.category && (
              <p className="text-xs text-red-500 font-medium">
                {errors.category}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Image <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-brand-dark/10 rounded-xl cursor-pointer hover:bg-brand-cream/50 hover:border-brand-primary/30 transition-all group bg-white"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream mb-3 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5 text-brand-dark/40 group-hover:text-brand-primary transition-colors" />
              </div>
              <p className="text-sm text-brand-dark/60 group-hover:text-brand-dark transition-colors font-medium">
                <span className="text-brand-primary">Click to upload</span> or
                drag & drop
              </p>
              <p className="text-xs text-brand-dark/30 mt-1">
                PNG, JPG, WEBP up to {MAX_IMAGE_MB}MB
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
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                <Check className="h-4 w-4" />
                Selected: {form.image.name}
              </div>
            )}
            {errors.image && (
              <p className="text-xs text-red-500 font-medium">{errors.image}</p>
            )}
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Ingredients <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={onIngredientKeyDown}
                placeholder="Type ingredient & press Enter"
                className="flex-1 rounded-xl px-4 py-3 text-sm bg-brand-cream/50 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="px-6 rounded-xl bg-brand-dark text-white font-bold text-sm hover:bg-brand-primary transition-colors shadow-lg hover:shadow-xl"
              >
                Add
              </button>
            </div>
            {errors.ingredients && (
              <p className="text-xs text-red-500 font-medium">
                {errors.ingredients}
              </p>
            )}
            {form.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {form.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-brand-cream border border-brand-dark/5 text-brand-dark/80"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      className="hover:text-red-500 transition-colors bg-white rounded-full p-0.5"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Rate (SEK) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 text-sm font-bold">
                kr
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.rate}
                onChange={(e) => setField("rate", e.target.value)}
                placeholder="Eg: 179.00"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm bg-brand-cream/50 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-bold"
              />
            </div>
            {errors.rate && (
              <p className="text-xs text-red-500 font-medium">{errors.rate}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider block">
              Type <span className="text-red-500">*</span>
            </span>
            <div className="flex gap-4">
              <label
                className={`flex-1 inline-flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  form.type === "veg"
                    ? "bg-emerald-50 border-emerald-200 shadow-sm"
                    : "bg-white border-brand-dark/10 hover:border-brand-dark/20"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    form.type === "veg"
                      ? "border-emerald-500"
                      : "border-brand-dark/20"
                  }`}
                >
                  {form.type === "veg" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <input
                  type="radio"
                  name="type"
                  value="veg"
                  checked={form.type === "veg"}
                  onChange={() => onTypeChange("veg")}
                  className="hidden"
                />
                <span
                  className={`text-sm font-bold ${
                    form.type === "veg"
                      ? "text-emerald-700"
                      : "text-brand-dark/60"
                  }`}
                >
                  Vegetarian
                </span>
              </label>

              <label
                className={`flex-1 inline-flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  form.type === "nonveg"
                    ? "bg-rose-50 border-rose-200 shadow-sm"
                    : "bg-white border-brand-dark/10 hover:border-brand-dark/20"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    form.type === "nonveg"
                      ? "border-rose-500"
                      : "border-brand-dark/20"
                  }`}
                >
                  {form.type === "nonveg" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  )}
                </div>
                <input
                  type="radio"
                  name="type"
                  value="nonveg"
                  checked={form.type === "nonveg"}
                  onChange={() => onTypeChange("nonveg")}
                  className="hidden"
                />
                <span
                  className={`text-sm font-bold ${
                    form.type === "nonveg"
                      ? "text-rose-700"
                      : "text-brand-dark/60"
                  }`}
                >
                  Non-Veg
                </span>
              </label>
            </div>
          </div>

          {/* Vegan + Gluten-free */}
          <div className="grid sm:grid-cols-2 gap-4">
            <label
              className={`inline-flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                form.vegan
                  ? "bg-emerald-50 border-emerald-200 shadow-sm"
                  : "bg-white border-brand-dark/10"
              } ${
                form.type === "nonveg"
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : "hover:border-brand-dark/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  form.vegan
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-brand-dark/20 bg-white"
                }`}
              >
                {form.vegan && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={form.vegan}
                onChange={(e) => setField("vegan", e.target.checked)}
                disabled={form.type === "nonveg"}
                className="hidden"
              />
              <span
                className={`text-sm font-bold ${
                  form.vegan ? "text-emerald-700" : "text-brand-dark/60"
                }`}
              >
                Vegan
              </span>
            </label>

            <label
              className={`inline-flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                form.glutenFree
                  ? "bg-blue-50 border-blue-200 shadow-sm"
                  : "bg-white border-brand-dark/10 hover:border-brand-dark/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  form.glutenFree
                    ? "bg-blue-500 border-blue-500"
                    : "border-brand-dark/20 bg-white"
                }`}
              >
                {form.glutenFree && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={form.glutenFree}
                onChange={(e) => setField("glutenFree", e.target.checked)}
                className="hidden"
              />
              <span
                className={`text-sm font-bold ${
                  form.glutenFree ? "text-blue-700" : "text-brand-dark/60"
                }`}
              >
                Gluten-free
              </span>
            </label>
          </div>
          {errors.vegan && (
            <p className="text-xs text-red-500 font-medium">{errors.vegan}</p>
          )}

          {/* Chef's Recommended */}
          <label
            className={`inline-flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              form.isChefRecommended
                ? "bg-brand-secondary/10 border-brand-secondary/30 shadow-sm"
                : "bg-white border-brand-dark/10 hover:border-brand-dark/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                form.isChefRecommended
                  ? "bg-brand-secondary border-brand-secondary"
                  : "border-brand-dark/20 bg-white"
              }`}
            >
              {form.isChefRecommended && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <input
              type="checkbox"
              checked={form.isChefRecommended}
              onChange={(e) => setField("isChefRecommended", e.target.checked)}
              className="hidden"
            />
            <div className="flex-1">
              <span
                className={`text-sm font-bold block ${
                  form.isChefRecommended
                    ? "text-brand-secondary"
                    : "text-brand-dark/60"
                }`}
              >
                ⭐ Chef's Recommended
              </span>
              <span className="text-xs text-brand-dark/40">
                Show in Chef's Signature section
              </span>
            </div>
          </label>

          {/* Spice Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
              Spice Level
            </label>
            <div className="bg-brand-cream/30 rounded-xl p-4 border border-brand-dark/5">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={form.spiceLevel}
                onChange={(e) => setField("spiceLevel", Number(e.target.value))}
                className="w-full accent-brand-secondary cursor-grab active:cursor-grabbing"
              />
              <div className="mt-3 flex gap-1 h-2">
                {spiceBar.map((filled, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-colors ${
                      filled ? "" : "bg-brand-dark/10"
                    }`}
                    style={
                      filled
                        ? {
                            background:
                              idx < 2
                                ? "#4ade80" // green
                                : idx < 4
                                ? "#facc15" // yellow
                                : "#ef4444", // red
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-brand-dark/40 font-bold">
                  None
                </span>
                <span className="text-sm font-bold text-brand-dark flex items-center gap-1">
                  {form.spiceLevel > 0 && (
                    <Flame className="w-3 h-3 text-brand-secondary fill-brand-secondary" />
                  )}
                  {spiceText}
                </span>
                <span className="text-xs text-brand-dark/40 font-bold">
                  Fire
                </span>
              </div>
            </div>
            {errors.spiceLevel && (
              <p className="text-xs text-red-500 font-medium">
                {errors.spiceLevel}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center gap-3 border-t border-brand-dark/5">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-brand-dark text-white font-bold text-sm hover:bg-brand-primary hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wider"
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
                  isChefRecommended: false,
                });
                setIngredientInput("");
                setErrors({});
                setServerError("");
              }}
              className="h-12 px-6 rounded-xl bg-brand-cream text-brand-dark/60 font-bold text-sm hover:bg-brand-dark/10 hover:text-brand-dark transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-brand-dark font-display uppercase tracking-tight px-2">
            Live Preview
          </h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-dark/5 sticky top-6">
            {/* Image Area */}
            <div className="relative h-64 bg-brand-cream/50 flex items-center justify-center overflow-hidden group">
              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-brand-dark/20">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand-dark/10 flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Image Preview</span>
                </div>
              )}

              {/* Overlay Gradient (Subtle) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Price Tag */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md shadow-lg px-4 py-2 rounded-full border border-brand-dark/5">
                <span className="text-brand-dark font-bold font-cutive text-lg">
                  {form.rate
                    ? new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                      }).format(Number(form.rate))
                    : "0,00 kr"}
                </span>
              </div>

              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${
                    form.type === "veg"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {badge}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-2xl font-bold text-brand-dark font-display uppercase tracking-tight leading-tight">
                  {form.name || "Item Name"}
                </h3>
              </div>

              <p className="text-brand-dark/60 text-sm leading-relaxed mb-6 font-sans">
                {form.description ||
                  "Your delicious item description will appear here..."}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-cream border border-brand-dark/5 text-xs font-bold text-brand-dark/60 uppercase tracking-wide">
                  {CATEGORIES.find((c) => c.value === form.category)?.label ||
                    "Main Course"}
                </span>

                {form.spiceLevel > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-xs font-bold text-orange-600 border border-orange-100 uppercase tracking-wide">
                    <Flame className="h-3 w-3 fill-orange-500" />
                    {spiceText}
                  </span>
                )}

                {form.vegan && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                    Vegan
                  </span>
                )}

                {form.glutenFree && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-bold text-blue-600 border border-blue-100 uppercase tracking-wide">
                    Gluten-free
                  </span>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] mb-3">
                  Ingredients
                </p>
                {form.ingredients.length ? (
                  <div className="flex flex-wrap gap-2">
                    {form.ingredients.map((ing) => (
                      <span
                        key={`preview-${ing}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-cream/50 border border-brand-dark/5 text-xs font-semibold text-brand-dark/70"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-brand-dark/20 italic">
                    No ingredients added yet.
                  </p>
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
