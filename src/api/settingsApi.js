const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function getSettings() {
  return jsonFetch(`${BASE}/api/settings`);
}

export function updateSettings(payload) {
  return jsonFetch(`${BASE}/api/settings`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
