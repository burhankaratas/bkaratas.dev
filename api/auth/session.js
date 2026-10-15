// GET /api/auth/session — mevcut oturumun durumunu bildirir.
import { json } from "../_lib/http.js";
import { readSessionFromRequest } from "../_lib/session.js";

export default {
  fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "GET" });
    }

    let session = null;
    try {
      session = readSessionFromRequest(request);
    } catch {
      session = null;
    }

    return json({
      ok: true,
      authenticated: Boolean(session),
      user: session ? { id: session.sub } : null,
    });
  },
};
