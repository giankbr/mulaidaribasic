import { readFileSync } from "node:fs";
import { basename } from "node:path";

const API_BASE = "https://api.upload-post.com/api";

function authHeaders(apiKey, idempotencyKey) {
  const headers = { Authorization: `Apikey ${apiKey}` };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  return headers;
}

function appendScheduling(form, options = {}) {
  const { addToQueue, scheduledDate, timezone } = options;
  if (addToQueue) {
    form.append("add_to_queue", "true");
    return;
  }
  if (scheduledDate) {
    form.append("scheduled_date", scheduledDate);
    if (timezone) form.append("timezone", timezone);
  }
}

/**
 * Upload a reel video to TikTok via Upload-Post.
 * @param {{ apiKey: string, profile: string, videoPath: string, caption: string, options?: object }} params
 */
export async function uploadReelVideo({ apiKey, profile, videoPath, caption, options = {} }) {
  const form = new FormData();
  const bytes = readFileSync(videoPath);
  form.append("user", profile);
  form.append("platform[]", "tiktok");
  form.append("video", new Blob([bytes], { type: "video/mp4" }), basename(videoPath));
  form.append("title", caption.slice(0, 2200));
  form.append("tiktok_title", caption.slice(0, 2200));
  form.append("async_upload", "true");

  if (options.privacyLevel) form.append("privacy_level", options.privacyLevel);
  if (options.postMode) form.append("post_mode", options.postMode);
  if (options.isAigc) form.append("is_aigc", "true");

  appendScheduling(form, options);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: authHeaders(apiKey, options.idempotencyKey),
    body: form,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || body.error || `Upload failed (${res.status})`);
  }
  return body;
}

/**
 * Upload a photo carousel to TikTok via Upload-Post.
 * @param {{ apiKey: string, profile: string, photoPaths: string[], caption: string, options?: object }} params
 */
export async function uploadPhotoCarousel({ apiKey, profile, photoPaths, caption, options = {} }) {
  const form = new FormData();
  form.append("user", profile);
  form.append("platform[]", "tiktok");

  for (const photoPath of photoPaths) {
    const bytes = readFileSync(photoPath);
    form.append("photos[]", new Blob([bytes], { type: "image/png" }), basename(photoPath));
  }

  form.append("title", caption.slice(0, 90));
  form.append("tiktok_title", caption.slice(0, 90));
  if (caption.length > 90) form.append("description", caption);
  form.append("async_upload", "true");

  if (options.postMode) form.append("post_mode", options.postMode);
  appendScheduling(form, options);

  const res = await fetch(`${API_BASE}/upload_photos`, {
    method: "POST",
    headers: authHeaders(apiKey, options.idempotencyKey),
    body: form,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || body.error || `Upload failed (${res.status})`);
  }
  return body;
}
