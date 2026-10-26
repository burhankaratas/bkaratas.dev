// GET /api/site-content — sitenin dinamik içeriklerini döndürür (herkese açık).
// GitHub content repo'sundaki site.json dosyasını okur.
import { getFile } from "./_lib/github.js";
import { json } from "./_lib/http.js";

const EMPTY = { tr: {}, en: {}, skills: {}, social: {} };
const CACHE = "public, s-maxage=60, stale-while-revalidate=300";

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed" }, 405);
    }
    try {
      const file = await getFile("site.json");
      if (!file) return json({ ok: true, content: EMPTY }, 200, { "Cache-Control": CACHE });
      const content = JSON.parse(file.content);
      return json({ ok: true, content }, 200, { "Cache-Control": CACHE });
    } catch {
      return json({ ok: true, content: EMPTY }, 200, { "Cache-Control": CACHE });
    }
  },
};
