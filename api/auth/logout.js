// POST /api/auth/logout — oturum çerezini siler.
import { json } from "../_lib/http.js";
import { clearCookie } from "../_lib/session.js";

export default {
  fetch(request) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
    }
    return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
  },
};
