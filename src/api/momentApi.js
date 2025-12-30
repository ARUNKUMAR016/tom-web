// src/api/momentApi.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function listMoments(activeOnly = true) {
  const query = activeOnly ? "?active=true" : "";
  const res = await fetch(`${BASE}/api/moments${query}`);
  if (!res.ok) throw new Error(`Failed to fetch moments: ${res.status}`);
  return res.json();
}

export async function getMoment(id) {
  const res = await fetch(`${BASE}/api/moments/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch moment: ${res.status}`);
  return res.json();
}

export async function createMoment(formData) {
  const res = await fetch(`${BASE}/api/moments`, {
    method: "POST",
    body: formData, // FormData with image
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create moment");
  }
  return res.json();
}

export async function updateMoment(id, formData) {
  const res = await fetch(`${BASE}/api/moments/${id}`, {
    method: "PUT",
    body: formData, // FormData with optional new image
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update moment");
  }
  return res.json();
}

export async function deleteMoment(id) {
  const res = await fetch(`${BASE}/api/moments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete moment");
  }
  return res.json();
}
