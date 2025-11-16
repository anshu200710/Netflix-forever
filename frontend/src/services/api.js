// src/services/api.js

// Normalize base URL (remove trailing slashes)
function normalizeBase(url) {
  if (!url) return "";
  return url.replace(/\/+$/, ""); // remove trailing /
}

// Detect base URL:
// - In production: use VITE_API_BASE_URL if given, otherwise same-origin
// - In development: use VITE_API_BASE_URL or fallback to localhost:5000
let API_BASE = "";

if (import.meta.env.VITE_API_BASE_URL) {
  // If you set it in .env, always respect that
  API_BASE = normalizeBase(import.meta.env.VITE_API_BASE_URL);
} else if (import.meta.env.PROD) {
  // Production: assume backend is reverse proxied behind same domain
  // e.g. Nginx: /api -> Node, /uploads -> Node
  API_BASE = ""; // use relative URLs like /api/...
} else {
  // Development fallback
  API_BASE = "http://localhost:5000";
}

function buildFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // If API_BASE is empty, assume same origin (Nginx proxies /uploads)
  if (!API_BASE) return path;

  return `${API_BASE}${path}`;
}

export { buildFileUrl };

// ------------- API HELPERS ------------- //

async function handleJson(res, defaultErrorMsg) {
  if (!res.ok) {
    // Try to read backend error message if available
    let message = defaultErrorMsg;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res.json();
}

export async function createCreator(name) {
  const res = await fetch(`${API_BASE}/api/creator/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return handleJson(res, "Failed to create creator");
}

export async function uploadCreatorVideos(creatorId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("videos", file));

  const res = await fetch(`${API_BASE}/api/video/upload/${creatorId}`, {
    method: "POST",
    body: formData,
  });

  return handleJson(res, "Failed to upload videos");
}

export async function getPublicCreator(slug) {
  const res = await fetch(`${API_BASE}/api/public/${slug}`);
  return handleJson(res, "Creator page not found");
}

export async function getVideoById(id) {
  const res = await fetch(`${API_BASE}/api/video/${id}`);
  return handleJson(res, "Video not found");
}
