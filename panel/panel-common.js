/* bkaratas.dev — panel ortak yardımcıları (oturum, fetch, biçimlendirme). */

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

/** HTML kaçışı (kullanıcı/içerik metinlerini DOM'a basmadan önce). */
export function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatDateTR(iso) {
  const time = Date.parse(iso || "");
  if (!time) return "—";
  const d = new Date(time);
  return `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}

/** Oturum yoksa giriş sayfasına yönlendirir. Kullanıcı adını döndürür. */
export async function ensurePanelSession() {
  try {
    const response = await fetch("/api/auth/session", { headers: { Accept: "application/json" } });
    const data = await response.json();
    if (!data || !data.authenticated) {
      location.replace("/panel");
      return null;
    }
    const userEl = document.getElementById("panel-user");
    if (userEl && data.user && data.user.id) userEl.textContent = data.user.id;
    return data.user || {};
  } catch {
    location.replace("/panel");
    return null;
  }
}

export function wireLogout() {
  const button = document.getElementById("logout");
  if (!button) return;
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* yönlendirme yine de yapılır */
    }
    location.replace("/panel");
  });
}

/** JSON fetch; 401'de panele yönlendirir. Hata durumunda { error } fırlatır. */
export async function panelFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    ...options,
  });
  if (response.status === 401) {
    location.replace("/panel");
    throw new Error("unauthorized");
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok || (data && data.ok === false)) {
    const message = (data && (data.message || data.error)) || `İstek başarısız (${response.status})`;
    throw new Error(message);
  }
  return data;
}

/** Basit bildirim çubuğu. type: "ok" | "error" | "" */
export function showFlash(el, message, type = "") {
  if (!el) return;
  el.textContent = message;
  el.classList.remove("is-ok", "is-error");
  if (type === "ok") el.classList.add("is-ok");
  if (type === "error") el.classList.add("is-error");
  el.classList.add("is-visible");
  if (showFlash._timer) clearTimeout(showFlash._timer);
  showFlash._timer = setTimeout(() => el.classList.remove("is-visible"), 5000);
}
