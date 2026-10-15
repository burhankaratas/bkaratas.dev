/* bkaratas.dev — panel giriş mantığı
   Turnstile token'ı + kullanıcı adı/parola → /api/auth/login → imzalı oturum çerezi */

const els = {
  form: document.getElementById("login-form"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  submit: document.getElementById("login-submit"),
  error: document.getElementById("login-error"),
  turnstile: document.getElementById("turnstile"),
  status: document.getElementById("login-status"),
};

let turnstileToken = "";
let turnstileWidgetId = null;
let turnstileSiteKey = "";
let turnstileRendered = false;

const MESSAGES = {
  invalid_credentials: "Kullanıcı adı veya parola hatalı. Lütfen tekrar deneyin.",
  turnstile_failed: "Bot doğrulaması başarısız oldu. Sayfayı yenileyip tekrar deneyin.",
  turnstile_unavailable: "Bot doğrulaması şu anda kullanılamıyor. Daha sonra tekrar deneyin.",
  turnstile_misconfigured:
    "Turnstile anahtarları hatalı: Site Key ve Secret Key karıştırılmış olabilir. Ortam değişkenlerini kontrol edin.",
  too_many_attempts: "Çok fazla hatalı deneme yapıldı. Lütfen biraz sonra tekrar deneyin.",
  server_misconfigured: "Sunucu yapılandırması eksik. Ortam değişkenlerini kontrol edin.",
  invalid_body: "İstek geçersiz. Sayfayı yenileyip tekrar deneyin.",
  network: "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.",
};

function showError(message) {
  if (!els.error) return;
  els.error.textContent = message;
  els.error.hidden = false;
}

function clearError() {
  if (!els.error) return;
  els.error.hidden = true;
  els.error.textContent = "";
}

function setBusy(busy) {
  if (!els.submit) return;
  els.submit.disabled = busy;
  els.submit.textContent = busy ? "Doğrulanıyor…" : "Giriş Yap";
}

function setStatus(text) {
  if (els.status) els.status.textContent = text;
}

/** Sunucudan gelen Turnstile teşhis bilgisini mesaja ekler. */
function detailSuffix(data) {
  if (!data || (data.error !== "turnstile_failed" && data.error !== "turnstile_misconfigured")) {
    return "";
  }
  const parts = [];
  if (data.reason) parts.push(data.reason);
  if (Array.isArray(data.codes) && data.codes.length) parts.push(data.codes.join(", "));
  return parts.length ? ` [${parts.join(" · ")}]` : "";
}

function nextUrl() {
  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  if (next && next.startsWith("/panel")) return next;
  return "/panel/dashboard";
}

async function alreadyLoggedIn() {
  try {
    const response = await fetch("/api/auth/session", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    return Boolean(data && data.authenticated);
  } catch {
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Widget'ı çizer. Yalnızca Turnstile API'si HAZIR olduğunda
 * (window.turnstile.render bir fonksiyon olduğunda) çağrılır.
 */
function renderTurnstile() {
  if (turnstileRendered) return;
  if (!window.turnstile || typeof window.turnstile.render !== "function") return;

  turnstileRendered = true;
  try {
    turnstileWidgetId = window.turnstile.render(els.turnstile, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      callback: (token) => {
        turnstileToken = token;
        setStatus("koruma: açık");
        clearError();
      },
      "expired-callback": () => {
        turnstileToken = "";
        setStatus("koruma: süresi doldu");
      },
      "error-callback": (code) => {
        turnstileToken = "";
        turnstileRendered = false;
        setStatus("koruma: hata");
        showError(
          `Turnstile hatası (kod: ${code}). Alan adı (hostname) ve anahtar ayarlarını kontrol edin.`
        );
      },
    });
    setStatus("koruma: yükleniyor…");
  } catch (error) {
    turnstileRendered = false;
    showError(
      "Bot koruması başlatılamadı" +
        (error && error.message ? `: ${error.message}` : ".")
    );
  }
}

// Cloudflare api.js hazır olduğunda bu global fonksiyonu çağırır
// (script …?onload=onTurnstileLoad ile yüklenir).
window.onTurnstileLoad = renderTurnstile;

/** API hazır olana kadar kısa aralıklarla bekler (onload gelmezse güvenlik ağı). */
function pollForTurnstile(tries) {
  if (turnstileRendered) return;
  if (window.turnstile && typeof window.turnstile.render === "function") {
    renderTurnstile();
    return;
  }
  if (tries <= 0) {
    setStatus("koruma: yüklenemedi");
    if (!els.error || els.error.hidden) {
      showError(
        "Bot koruması yüklenemedi. Reklam engelleyici veya tarayıcı kalkanı (uBlock, Brave Shields vb.) engelliyor olabilir."
      );
    }
    return;
  }
  setTimeout(() => pollForTurnstile(tries - 1), 250);
}

async function setupTurnstile() {
  try {
    const response = await fetch("/api/auth/config", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    turnstileSiteKey = (data && data.turnstileSiteKey) || "";
  } catch {
    /* aşağıda ele alınıyor */
  }

  if (!turnstileSiteKey) {
    els.turnstile.innerHTML =
      '<p class="panel-note">Turnstile Site Key tanımlı değil — Vercel ortam değişkenlerini kontrol edin.</p>';
    setStatus("koruma: kurulmamış");
    return;
  }

  const SRC =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";

  // Script zaten yüklüyse doğrudan çiz.
  if (window.turnstile && typeof window.turnstile.render === "function") {
    renderTurnstile();
    return;
  }

  try {
    await loadScript(SRC);
  } catch {
    setStatus("koruma: yüklenemedi");
    showError("Bot koruması yüklenemedi. Reklam engelleyici veya ağ engelliyor olabilir.");
    return;
  }

  pollForTurnstile(40);
}

function resetTurnstile() {
  turnstileToken = "";
  if (window.turnstile && turnstileWidgetId !== null) {
    try {
      window.turnstile.reset(turnstileWidgetId);
    } catch {
      /* yok say */
    }
  }
}

async function onSubmit(event) {
  event.preventDefault();
  clearError();

  const username = els.username.value.trim();
  const password = els.password.value;

  if (!username) {
    showError("Lütfen kullanıcı adınızı girin.");
    els.username.focus();
    return;
  }
  if (!password) {
    showError("Lütfen parolanızı girin.");
    els.password.focus();
    return;
  }

  setBusy(true);
  setStatus("doğrulanıyor…");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, turnstileToken }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.ok) {
      setStatus("giriş başarılı");
      const target = data.redirect && data.redirect.startsWith("/panel")
        ? data.redirect
        : nextUrl();
      location.href = target;
      return;
    }

    showError(
      (MESSAGES[data.error] || "Giriş yapılamadı. Bilgileri kontrol edin.") +
        detailSuffix(data)
    );
    setStatus("hatalı deneme");
    resetTurnstile();
  } catch {
    showError(MESSAGES.network);
    setStatus("bağlantı hatası");
  } finally {
    setBusy(false);
  }
}

(async function init() {
  if (await alreadyLoggedIn()) {
    location.replace("/panel/dashboard");
    return;
  }

  els.form.addEventListener("submit", onSubmit);
  await setupTurnstile();
})();
