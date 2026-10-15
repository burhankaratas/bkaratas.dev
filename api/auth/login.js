// POST /api/auth/login
// Gövde: { password: string, turnstileToken?: string }
// 1) Turnstile bot doğrulaması  2) Parola kontrolü  3) İmzalı oturum çerezi
import { json, getClientIp } from "../_lib/http.js";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { verifyPassword } from "../_lib/password.js";
import { createSession, signSession, sessionCookie } from "../_lib/session.js";
import { rateLimit } from "../_lib/ratelimit.js";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
    }

    const ip = getClientIp(request);

    const limit = rateLimit(`login:${ip}`);
    if (!limit.ok) {
      return json(
        { ok: false, error: "too_many_attempts", retryAfter: limit.retryAfter },
        429,
        { "Retry-After": String(limit.retryAfter) }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_body" }, 400);
    }

    const password = typeof body?.password === "string" ? body.password : "";
    const turnstileToken =
      typeof body?.turnstileToken === "string" ? body.turnstileToken : "";

    // 1) Bot koruması
    try {
      const human = await verifyTurnstile(turnstileToken, ip);
      if (!human) {
        return json({ ok: false, error: "turnstile_failed" }, 400);
      }
    } catch (error) {
      console.error("[login] turnstile", error);
      return json({ ok: false, error: "turnstile_unavailable" }, 502);
    }

    // 2) Parola
    try {
      if (!verifyPassword(password)) {
        return json({ ok: false, error: "invalid_credentials" }, 401);
      }
    } catch (error) {
      console.error("[login] password", error);
      return json({ ok: false, error: "server_misconfigured" }, 500);
    }

    // 3) Oturum
    try {
      const { payload, ttl } = createSession();
      const cookie = sessionCookie(signSession(payload), ttl);
      return json({ ok: true, redirect: "/panel/dashboard" }, 200, {
        "Set-Cookie": cookie,
      });
    } catch (error) {
      console.error("[login] session", error);
      return json({ ok: false, error: "server_misconfigured" }, 500);
    }
  },
};
