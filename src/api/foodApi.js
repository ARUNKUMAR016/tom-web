// src/api/foodApi.js
export const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ------------------------------ fetch helpers ------------------------------ */
export async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function formFetch(url, formData, options = {}) {
  const res = await fetch(url, {
    method: options.method || "POST",
    body: formData, // IMPORTANT: do NOT set Content-Type yourself for FormData
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

/* ---------------------------------- utils --------------------------------- */
function appendIfDefined(fd, key, val) {
  if (val === undefined || val === null) return;
  if (key === "ingredients") fd.append(key, JSON.stringify(val || []));
  else if (typeof val === "boolean") fd.append(key, String(val));
  else fd.append(key, String(val));
}

function buildQuery(params = {}) {
  const qp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    // arrays -> repeat params
    if (Array.isArray(v)) {
      v.forEach((item) => qp.append(k, String(item)));
    } else {
      qp.set(k, String(v));
    }
  }
  const s = qp.toString();
  return s ? `?${s}` : "";
}

/* ---------------------------------- CREATE -------------------------------- */
// CREATE (multipart)
// payload = {
//   name, description, rate, type, vegan, glutenFree, isAvailable,
//   ingredients: string[],
//   image: File,
//   category: "main_course"|"appetizer"|"drink"|"combo",
//   spiceLevel: 0..5
// }
export function createFoodItem(payload) {
  const fd = new FormData();
  if (payload.image) fd.append("image", payload.image);

  appendIfDefined(fd, "name", payload.name);
  appendIfDefined(fd, "description", payload.description);
  appendIfDefined(fd, "rate", payload.rate);
  appendIfDefined(fd, "type", payload.type);
  appendIfDefined(fd, "vegan", !!payload.vegan);
  appendIfDefined(fd, "glutenFree", !!payload.glutenFree);
  appendIfDefined(fd, "isAvailable", payload.isAvailable ?? true);
  appendIfDefined(fd, "ingredients", payload.ingredients || []);

  // NEW fields
  appendIfDefined(fd, "category", payload.category); // main_course/appetizer/drink/combo
  appendIfDefined(fd, "spiceLevel", payload.spiceLevel); // 0..5
  appendIfDefined(fd, "isChefRecommended", !!payload.isChefRecommended);

  return formFetch(`${BASE}/api/food-items`, fd, { method: "POST" });
}

/* ----------------------------------- LIST --------------------------------- */
// LIST with optional filters
// filters = { q, category, type, vegan, glutenFree, available, spiceMin, spiceMax, sort }
export function listFoodItems(filters = {}) {
  const query = buildQuery(filters);
  return jsonFetch(`${BASE}/api/food-items${query}`);
}

/* ----------------------------------- GET ---------------------------------- */
export async function getFoodItem(id) {
  const res = await fetch(`${BASE}/api/food-items/${id}`);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON, got: ${text.slice(0, 120)}…`);
  }
  return res.json();
}

/* --------------------------------- UPDATE --------------------------------- */
// UPDATE: if payload.image exists, send multipart; else JSON
// You can pass partial fields; only provided keys are sent.
export function updateFoodItem(id, payload) {
  // Multipart path (image replacement)
  if (payload.image instanceof File) {
    const fd = new FormData();
    fd.append("image", payload.image);

    for (const [k, v] of Object.entries(payload)) {
      if (k === "image") continue;
      if (v === undefined) continue;
      if (k === "ingredients")
        fd.append("ingredients", JSON.stringify(v || []));
      else if (typeof v === "boolean") fd.append(k, String(v));
      else fd.append(k, String(v));
    }
    return formFetch(`${BASE}/api/food-items/${id}`, fd, { method: "PUT" });
  }

  // JSON path (no image change)
  return jsonFetch(`${BASE}/api/food-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* --------------------------------- DELETE --------------------------------- */
export function deleteFoodItem(id) {
  return jsonFetch(`${BASE}/api/food-items/${id}`, { method: "DELETE" });
}

/* ---------------------------- convenience helpers ------------------------- */
// Narrow list by category
export function listByCategory(category, extra = {}) {
  return listFoodItems({ category, ...extra });
}
// Example: list spicy items 3..5
export function listSpicy(min = 3, max = 5, extra = {}) {
  return listFoodItems({ spiceMin: min, spiceMax: max, ...extra });
}
