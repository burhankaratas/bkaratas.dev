// POST /api/panel/uploads — görsel yükler ve repoya (content/uploads) işler.
// Gövde (JSON): { filename, contentType, dataBase64 }  veya  { filename, dataUrl }
// Döndürür: { ok, url, previewUrl }
import { json } from "../_lib/http.js";
import { requireSession } from "../_lib/guard.js";
import { slugify } from "../_lib/slug.js";
import { githubConfigured, putBinaryFile, rawUrl } from "../_lib/github.js";

const UPLOADS_DIR = "content/uploads";
const MAX_BYTES = 3.5 * 1024 * 1024; // 3.5 MB

const EXT_BY_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

function parseDataUrl(dataUrl) {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(String(dataUrl || ""));
  if (!match) return null;
  const [, contentType, isBase64, data] = match;
  if (!isBase64) return null; // yalnızca base64 veri kabul edilir
  return { contentType, dataBase64: data };
}

export default {
  async fetch(request) {
    const { response } = requireSession(request);
    if (response) return response;

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
    }
    if (!githubConfigured()) {
      return json({ ok: false, error: "github_not_configured" }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_body" }, 400);
    }

    let contentType = String(body?.contentType || "").toLowerCase();
    let dataBase64 = String(body?.dataBase64 || "");
    const filename = String(body?.filename || "");

    if (body?.dataUrl) {
      const parsed = parseDataUrl(body.dataUrl);
      if (!parsed) return json({ ok: false, error: "invalid_data_url" }, 400);
      contentType = parsed.contentType;
      dataBase64 = parsed.dataBase64;
    }

    if (!EXT_BY_TYPE[contentType]) {
      return json({ ok: false, error: "unsupported_type", message: "Yalnızca görsel dosyaları yüklenebilir." }, 415);
    }
    if (!dataBase64) {
      return json({ ok: false, error: "empty_file" }, 400);
    }

    // Boyut kontrolü (base64 → byte yaklaşımı)
    const approxBytes = Math.floor((dataBase64.length * 3) / 4);
    if (approxBytes > MAX_BYTES) {
      return json({ ok: false, error: "too_large", message: "Görsel en fazla 3.5 MB olabilir." }, 413);
    }

    const ext = EXT_BY_TYPE[contentType];
    const base = slugify(filename.replace(/\.[^.]+$/, "")) || "gorsel";
    const name = `${Date.now()}-${base}.${ext}`;
    const filePath = `${UPLOADS_DIR}/${name}`;

    try {
      await putBinaryFile(filePath, dataBase64, `Panel: görsel yüklendi — ${name}`);
      return json({
        ok: true,
        url: `/${filePath}`,
        previewUrl: rawUrl(filePath),
        name,
      });
    } catch (error) {
      console.error("[panel.uploads]", error);
      return json({ ok: false, error: "github_error", message: String(error.message || "") }, 502);
    }
  },
};
