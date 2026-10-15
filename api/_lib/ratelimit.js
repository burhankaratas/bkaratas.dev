// Basit bellek-içi oran sınırlama (best-effort).
// Serverless örnekleri geçici olduğu için garanti vermez; kaba kuvvet
// denemelerini yavaşlatmak için ek bir katmandır.

const buckets = new Map();
const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 dakika
const DEFAULT_MAX = 8; // pencere başına en fazla deneme

export function rateLimit(key, { max = DEFAULT_MAX, windowMs = DEFAULT_WINDOW_MS } = {}) {
  const now = Date.now();

  // Ara sıra süresi dolmuş kayıtları temizle (bellek birikmesini önle).
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (now > v.reset) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
  }
  return { ok: true, remaining: max - bucket.count };
}
