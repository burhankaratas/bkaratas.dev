// Ortak HTTP yardımcıları (Vercel Functions).
// Bu dosya `_` ile başladığı için Vercel tarafından bir endpoint olarak
// yayınlanmaz; yalnızca diğer fonksiyonlar tarafından içe aktarılır.

/** JSON yanıtı üretir; panel/API yanıtları asla önbelleğe alınmaz. */
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

/** İstemci IP adresini (mümkünse) döndürür. Oran sınırlamada kullanılır. */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "0.0.0.0";
}
