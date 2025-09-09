  // src/api/foodApi.js
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function jsonFetch(url, options = {}) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;
    if (!res.ok) {
      // your backend sends { error: "message" } on validation errors
      const msg = data?.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }

  export function createFoodItem(payload) {
    return jsonFetch(`${BASE}/api/food-items`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  export function listFoodItems() {
    return jsonFetch(`${BASE}/api/food-items`);
  }

  export async function getFoodItem(id) {
     const url = `${BASE}/api/food-items/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON, got: ${text.slice(0, 120)}…`);
    }
    return res.json();
  }

  export function updateFoodItem(id, payload) {
    return jsonFetch(`${BASE}/api/food-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  export function deleteFoodItem(id) {
    return jsonFetch(`${BASE}/api/food-items/${id}`, { method: "DELETE" });
  }

  // src/api/foodApi.js
  // add this next to your other exports (listFoodItems, updateFoodItem, deleteFoodItem, ...)

