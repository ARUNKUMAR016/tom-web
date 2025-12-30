const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getActiveOffers = async () => {
  const res = await fetch(`${API_BASE}/api/offers`);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
};

export const getAllOffers = async () => {
  const token = localStorage.getItem("token"); // if auth needed later
  const res = await fetch(`${API_BASE}/api/offers/all`);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
};

export const createOffer = async (data) => {
  const res = await fetch(`${API_BASE}/api/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create offer");
  }
  return res.json();
};

export const updateOffer = async (id, data) => {
  const res = await fetch(`${API_BASE}/api/offers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update offer");
  }
  return res.json();
};

export const deleteOffer = async (id) => {
  const res = await fetch(`${API_BASE}/api/offers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
};
