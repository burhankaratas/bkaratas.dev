// Cloudflare Turnstile doğrulaması (sunucu tarafı).
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Turnstile token'ını Cloudflare'e doğrulatır.
 * - Secret yoksa: üretimde hata fırlatır; geliştirmede atlar (kolaylık için).
 * - Dönüş: { ok: true } veya { ok: false, reason, errorCodes }
 *   errorCodes: Cloudflare'in döndürdüğü hata kodları (örn. invalid-input-secret).
 */
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("TURNSTILE_SECRET_KEY tanımlı değil.");
    }
    console.warn("[turnstile] TURNSTILE_SECRET_KEY yok — doğrulama atlandı (yalnızca geliştirme).");
    return { ok: true, reason: "disabled" };
  }

  if (!token || typeof token !== "string") {
    return { ok: false, reason: "missing_token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "0.0.0.0") body.set("remoteip", ip);

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
  });

  // Cloudflare, geçersiz girdilerde 400 döndürebilir ama gövdede yine de
  // JSON (error-codes) bulunur. Bu yüzden gövdeyi durum kodundan bağımsız okuyoruz.
  const data = await response.json().catch(() => null);

  if (!data) {
    throw new Error(`Turnstile siteverify yanıtı okunamadı (HTTP ${response.status}).`);
  }

  if (data.success === true) {
    return { ok: true };
  }

  return {
    ok: false,
    reason: "rejected",
    errorCodes: Array.isArray(data["error-codes"]) ? data["error-codes"] : [],
  };
}
