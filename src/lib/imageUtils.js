const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Resolves a potentially relative image URL to a full absolute URL,
 * preventing duplicate slashes and forcing WebP extension for local uploads.
 * @param {string} url - The image URL from the DB (e.g., "/uploads/123.jpg" or "https://...")
 * @returns {string} - The fully resolved URL (e.g., "http://localhost:5000/uploads/123.webp")
 */
export function resolveImage(url) {
  if (!url) return "";

  // If it's already a full URL (firebase, s3, etc.), return as is
  // But if it points to our own server but was stored as full URL, we might still want to optimize?
  // For now, assume external links are fine.
  if (url.startsWith("http")) return url;

  // Clean lead slash
  let cleanUrl = url.startsWith("/") ? url.slice(1) : url;

  // OPTIMIZATION:
  // If we are serving from our local /uploads/, force the extension to .webp
  // because convert-all.js ensures we have a .webp version for every image.
  // This drastically reduces load size.
  if (cleanUrl.startsWith("uploads/")) {
    cleanUrl = cleanUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }

  return `${API_BASE}/${cleanUrl}`;
}
