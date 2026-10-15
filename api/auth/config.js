// GET /api/auth/config — panel istemcisine herkese açık ayarları verir.
// (Turnstile site key gizli değildir; secret anahtar asla gönderilmez.)
import { json } from "../_lib/http.js";

/** Turnstile Site Key ~24, Secret Key ~35 karakterdir. */
const SITE_KEY_MAX = 28;
const SECRET_KEY_MIN = 30;

export default {
  fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "GET" });
    }

    const siteKey = (process.env.TURNSTILE_SITE_KEY || "").trim();
    const secretKey = (process.env.TURNSTILE_SECRET_KEY || "").trim();

    // Anahtarlar yer değiştirmişse secret'ı tarayıcıya ASLA göndermeyelim.
    const looksLikeSecret = siteKey.length >= SECRET_KEY_MIN;
    const secretLooksLikeSiteKey = secretKey.length > 0 && secretKey.length < SECRET_KEY_MIN;
    const identical = siteKey.length > 0 && siteKey === secretKey;

    if (looksLikeSecret || secretLooksLikeSiteKey || identical) {
      console.error(
        "[config] Turnstile anahtarları hatalı görünüyor. " +
          `TURNSTILE_SITE_KEY uzunluk=${siteKey.length} (beklenen ~24), ` +
          `TURNSTILE_SECRET_KEY uzunluk=${secretKey.length} (beklenen ~35). ` +
          "Site Key ve Secret Key yer değiştirmiş olabilir."
      );
      return json(
        {
          ok: false,
          error: "turnstile_keys_swapped",
          siteKeyLength: siteKey.length,
        },
        500
      );
    }

    return json({
      ok: true,
      turnstileSiteKey: siteKey,
    });
  },
};
