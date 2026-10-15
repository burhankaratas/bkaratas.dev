// Parola doğrulama.
// Öncelik: PANEL_PASSWORD_HASH (scrypt). Basitlik için PANEL_PASSWORD de desteklenir
// ama güvenli olan hash yöntemidir. `scripts/hash-password.mjs` ile üretilir.
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/** "scrypt$<saltHex>$<hashHex>" biçiminde bir parola özeti üretir. */
export function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

function constantTimeEqualString(a, b) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) {
    // Uzunluk sızıntısını azaltmak için sabit zamanlı bir karşılaştırma yap.
    timingSafeEqual(bufferA, bufferA);
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

function verifyHashed(password, stored) {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    throw new Error("PANEL_PASSWORD_HASH biçimi geçersiz (beklenen: scrypt$salt$hash).");
  }
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/** Girilen parolayı ortam değişkenleriyle karşılaştırır. */
export function verifyPassword(input) {
  if (typeof input !== "string" || input.length === 0) return false;

  const hashed = process.env.PANEL_PASSWORD_HASH;
  if (hashed) return verifyHashed(input, hashed);

  const plain = process.env.PANEL_PASSWORD;
  if (plain) return constantTimeEqualString(input, plain);

  throw new Error("PANEL_PASSWORD_HASH ya da PANEL_PASSWORD tanımlı değil.");
}
