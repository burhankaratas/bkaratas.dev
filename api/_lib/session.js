// Oturum (session) yönetimi.
// Harici bağımlılık yoktur: imzalı (HMAC-SHA256) HttpOnly çerez kullanır.
// Sunucu tarafında durum tutmaya gerek kalmaz (stateless session).
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "bk_panel";
const DEFAULT_TTL = 60 * 60 * 12; // 12 saat

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(value) {
  return Buffer.from(String(value).replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function getSecret() {
  const secret = process.env.PANEL_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("PANEL_SESSION_SECRET tanımlı değil ya da çok kısa (en az 16 karakter).");
  }
  return secret;
}

/** Oturum yükünü (payload) imzalayıp tek bir token döndürür. */
export function signSession(payload) {
  const body = b64url(JSON.stringify(payload));
  const mac = b64url(createHmac("sha256", getSecret()).update(body).digest());
  return `${body}.${mac}`;
}

/** Token'ı doğrular; geçerliyse payload'u, aksi halde null döndürür. */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, mac] = parts;

  let expected;
  let given;
  try {
    expected = createHmac("sha256", getSecret()).update(body).digest();
    given = fromB64url(mac);
  } catch {
    return null;
  }

  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8"));
  } catch {
    return null;
  }

  if (!payload || typeof payload.exp !== "number") return null;
  if (Date.now() >= payload.exp * 1000) return null;

  return payload;
}

/** Yeni bir oturum payload'u üretir. */
export function createSession({ ttl = DEFAULT_TTL } = {}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    payload: { sub: "admin", iat: now, exp: now + ttl },
    ttl,
  };
}

function useSecureCookie() {
  const env = process.env.VERCEL_ENV;
  if (env === "production" || env === "preview") return true;
  return process.env.NODE_ENV === "production" && !process.env.VERCEL;
}

/** Oturum çerezini (Set-Cookie başlığı) üretir. */
export function sessionCookie(token, maxAge = DEFAULT_TTL) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (useSecureCookie()) parts.push("Secure");
  return parts.join("; ");
}

/** Oturumu sonlandıran boş çerez. */
export function clearCookie() {
  const parts = [`${COOKIE_NAME}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (useSecureCookie()) parts.push("Secure");
  return parts.join("; ");
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const pair of header.split(";")) {
    const index = pair.indexOf("=");
    if (index < 0) continue;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

/** İstekteki çerezden geçerli oturumu okur (yoksa null). */
export function readSessionFromRequest(request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  return verifySessionToken(cookies[COOKIE_NAME]);
}
