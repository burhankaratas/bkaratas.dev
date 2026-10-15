// Panel API'leri için oturum koruması.
import { readSessionFromRequest } from "./session.js";
import { json } from "./http.js";

/**
 * İstekte geçerli panel oturumu arar.
 * Döndürür: { session } veya { response } (401 yanıtı).
 */
export function requireSession(request) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return { session: null, response: json({ ok: false, error: "unauthorized" }, 401) };
  }
  return { session, response: null };
}
