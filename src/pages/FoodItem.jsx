import React, { useState } from "react";
import { createFoodItem } from "../api/foodApi";
import NavHeader from "../components/NavHeader"; // <-- import your shared header
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
    if (!form.rate || Number(form.rate) <= 0) e.rate = "Rate must be positive.";
    if (form.description.trim().length < 10)
      e.description = "Description should be at least 10 characters.";
    if (form.ingredients.length === 0)
      e.ingredients = "Add at least one ingredient.";
    if (form.type === "nonveg" && form.vegan)
      e.vegan = "Non-veg item cannot be vegan.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = { ...form, rate: Number(form.rate) };

    try {
      setLoading(true);
      const created = await createFoodItem(payload);

      toast.success(`Saved: ${created.name}`);
      // reset form
      setForm({
        name: "",
        description: "",
        rate: "",
        type: "veg",
        vegan: false,
        glutenFree: false,
        ingredients: [],
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

  return (
    <div className="min-h-screen">
      {/* TOM Header */}
      <NavHeader
        title="Add Food Item"
        subtitle="Create a new dish for Taste of Madurai menu"
        right={
          <Link
            to="/admin/home"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
            title="Back to Admin Home"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        }
      />

      {/* Content */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 p-8">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-white border rounded-3xl shadow-xl p-8 space-y-6 border-slate-200/80"
          >
            <h2 className="text-2xl font-bold text-slate-900">Add Food Item</h2>

            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {serverError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Eg: Paneer Butter Masala"
                className="mt-1 h-12 w-full rounded-xl border px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#FF5200]/50"
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Short, tasty description…"
                className="mt-1 w-full rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#FF5200]/50"
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image <span className="text-red-500">*</span>
              </label>

              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
              >
                <svg
                  className="w-10 h-10 text-slate-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 014-4h1m4-4h.01M12 20h9"
                  />
                </svg>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-[#FF5200]">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setForm((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }));
                    }
                  }}
                />
              </label>

              {errors.image && (
                <p className="mt-1 text-xs text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Ingredients<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={onIngredientKeyDown}
                  placeholder="Type an ingredient and press Enter"
                  className="flex-1 h-12 rounded-xl border px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#FF5200]/50"
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="h-12 rounded-xl border px-4 bg-[#FF5200] text-white font-medium hover:bg-[#e64900]"
                >
                  Add
                </button>
              </div>
              {errors.ingredients && (
                <p className="text-xs text-red-600">{errors.ingredients}</p>
              )}
              {form.ingredients.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing)}
                        className="rounded-full w-5 h-5 grid place-items-center bg-slate-300 hover:bg-slate-400"
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
              <label className="block text-sm font-medium text-slate-700">
                Rate (₹)<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) => setField("rate", e.target.value)}
                  placeholder="Eg: 179.00"
                  className="h-12 w-full rounded-xl border pl-8 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-[#FF5200]/50"
                />
              </div>
              {errors.rate && (
                <p className="text-xs text-red-600">{errors.rate}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Type<span className="text-red-500">*</span>
              </span>
              <div className="mt-2 flex gap-6">
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
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.vegan}
                  onChange={(e) => setField("vegan", e.target.checked)}
                  disabled={form.type === "nonveg"}
                />
                <span
                  className={`text-sm ${
                    form.type === "nonveg" ? "text-slate-400" : ""
                  }`}
                >
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
              <p className="text-xs text-red-600">{errors.vegan}</p>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-xl bg-[#FF5200] text-white px-6 text-[15px] font-semibold hover:bg-[#e64900] disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Item"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: "",
                    description: "",
                    rate: "",
                    type: "veg",
                    vegan: false,
                    glutenFree: false,
                    ingredients: [],
                  });
                  setIngredientInput("");
                  setErrors({});
                  setServerError("");
                }}
                className="h-12 rounded-xl border px-6 text-[15px] hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="bg-white border rounded-3xl shadow-xl p-8 border-slate-200/80">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Preview
            </h3>
            <div className="rounded-2xl border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {form.image ? (
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Preview"
                      className="w-32 h-32 rounded-2xl object-cover border shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-semibold text-slate-900">
                      {form.name || "Item name"}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        form.type === "veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {form.description || "Description will appear here…"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-3xl font-bold text-slate-900">
                      {form.rate ? `₹${Number(form.rate).toFixed(2)}` : "₹0.00"}
                    </div>
                    <div className="flex gap-2">
                      {form.vegan && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Vegan
                        </span>
                      )}
                      {form.glutenFree && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          Gluten-free
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mt-6">
                <p className="text-xs font-medium text-slate-700 mb-2">
                  Ingredients
                </p>
                {form.ingredients.length ? (
                  <div className="flex flex-wrap gap-2">
                    {form.ingredients.map((ing) => (
                      <span
                        key={`preview-${ing}`}
                        className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
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
