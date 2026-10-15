// Cloudflare Turnstile doğrulaması (sunucu tarafı).
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Turnstile token'ını Cloudflare'e doğrulatır.
 * - Secret yoksa: üretimde hata fırlatır; geliştirmede atlar (kolaylık için).
 * - Token yoksa/geçersizse false döndürür.
 */
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("TURNSTILE_SECRET_KEY tanımlı değil.");
    }
    console.warn("[turnstile] TURNSTILE_SECRET_KEY yok — doğrulama atlandı (yalnızca geliştirme).");
    return true;
  }

  if (!token || typeof token !== "string") return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "0.0.0.0") body.set("remoteip", ip);

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Turnstile siteverify HTTP ${response.status}`);
  }

  const data = await response.json().catch(() => null);
  return Boolean(data && data.success === true);
}
