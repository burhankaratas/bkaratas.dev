// GET /api/auth/config — panel istemcisine herkese açık ayarları verir.
// (Turnstile site key gizli değildir; secret anahtar asla gönderilmez.)
import { json } from "../_lib/http.js";

export default {
  fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "GET" });
    }

    return json({
      ok: true,
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
    });
  },
};
