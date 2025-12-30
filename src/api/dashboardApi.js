const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/api/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};
