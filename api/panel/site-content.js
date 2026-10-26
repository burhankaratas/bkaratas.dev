// GET/POST /api/panel/site-content — site içeriklerini okur/yazar (oturum korumalı).
// GitHub content repo'sundaki site.json dosyasını yönetir.
import { json } from "../_lib/http.js";
import { requireSession } from "../_lib/guard.js";
import { githubConfigured, getFile, putTextFile } from "../_lib/github.js";

export default {
  async fetch(request) {
    const { response } = requireSession(request);
    if (response) return response;

    if (request.method === "GET") {
      try {
        const file = await getFile("site.json");
        if (!file) return json({ ok: true, content: null });
        return json({ ok: true, content: JSON.parse(file.content) });
      } catch (err) {
        return json({ ok: false, error: "read_error", message: String(err.message || "") }, 502);
      }
    }

    if (request.method === "POST") {
      if (!githubConfigured()) {
        return json({ ok: false, error: "github_not_configured",
          message: "GITHUB_TOKEN tanımlı değil." }, 500);
      }
      let body;
      try { body = await request.json(); } catch {
        return json({ ok: false, error: "invalid_body" }, 400);
      }
      if (!body || typeof body.content !== "object") {
        return json({ ok: false, error: "content_required" }, 400);
      }
      try {
        await putTextFile("site.json", JSON.stringify(body.content, null, 2),
          "Panel: site içerikleri güncellendi");
        return json({ ok: true });
      } catch (err) {
        return json({ ok: false, error: "github_error", message: String(err.message || "") }, 502);
      }
    }

    return json({ ok: false, error: "method_not_allowed" }, 405);
  },
};
