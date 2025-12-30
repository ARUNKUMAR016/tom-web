const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Resolves a potentially relative image URL to a full absolute URL,
 * preventing duplicate slashes and forcing WebP extension for local uploads.
 * Also supports dynamic resizing for Cloudinary URLs.
 * @param {string} url - The image URL from the DB
 * @param {number} [width] - Optional width for resizing
 * @returns {string} - The fully resolved and optionally transformed URL
 */
export function resolveImage(url, width) {
  if (!url) return "";

  // Cloudinary Dynamic Resizing
  if (url.includes("res.cloudinary.com") && width) {
    // Inject transformation: w_width,c_limit,q_auto,f_auto
    // Cloudinary URLs typical format: https://res.cloudinary.com/<cloud_name>/image/upload/v12345678/path/to/image.jpg
    // We want to insert transformations after '/upload/'
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},c_limit,q_auto,f_auto/${parts[1]}`;
    }
  }

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
