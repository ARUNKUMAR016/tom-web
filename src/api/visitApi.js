const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const trackVisit = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/visits/track`, {
      method: "POST",
    });
    if (!res.ok) {
      console.warn("Failed to track visit");
    }
  } catch (err) {
    console.warn("Error tracking visit:", err);
  }
};
