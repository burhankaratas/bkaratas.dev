// POST /api/panel/hash — yeni parola için scrypt hash üretir (oturum korumalı).
// Üretilen hash'i PANEL_PASSWORD_HASH ortam değişkenine atayarak şifre değiştirme sağlanır.
import { json } from "../_lib/http.js";
import { requireSession } from "../_lib/guard.js";
import { hashPassword } from "../_lib/password.js";

export default {
  async fetch(request) {
    const { response } = requireSession(request);
    if (response) return response;

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405);
    }

    let body;
    try { body = await request.json(); } catch {
      return json({ ok: false, error: "invalid_body" }, 400);
    }

    const password = String(body?.password || "").trim();
    if (!password || password.length < 8) {
      return json({ ok: false, error: "too_short",
        message: "Parola en az 8 karakter olmalı." }, 400);
    }

    const hash = hashPassword(password);
    return json({ ok: true, hash });
  },
};
