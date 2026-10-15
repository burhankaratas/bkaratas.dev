/* bkaratas.dev — panel giriş mantığı
   Turnstile token'ı + parola → /api/auth/login → imzalı oturum çerezi */

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

async function setupTurnstile() {
  let siteKey = "";
  try {
    const response = await fetch("/api/auth/config", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    siteKey = (data && data.turnstileSiteKey) || "";
  } catch {
    /* aşağıda ele alınıyor */
  }

  if (!siteKey) {
    els.turnstile.innerHTML =
      '<p class="panel-note">Turnstile Site Key tanımlı değil — Vercel ortam değişkenlerini kontrol edin.</p>';
    if (els.status) els.status.textContent = "koruma: kurulmamış";
    return;
  }

  if (!window.turnstile) {
    try {
      await loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
    } catch {
      showError("Bot koruması yüklenemedi. Sayfayı yenileyin.");
      return;
    }
  }

  if (!window.turnstile) {
    showError("Bot koruması yüklenemedi. Sayfayı yenileyin.");
    return;
  }

  turnstileWidgetId = window.turnstile.render(els.turnstile, {
    sitekey: siteKey,
    theme: "dark",
    callback: (token) => {
      turnstileToken = token;
      clearError();
    },
    "expired-callback": () => {
      turnstileToken = "";
    },
    "error-callback": () => {
      turnstileToken = "";
    },
  });

  if (els.status) els.status.textContent = "koruma: açık";
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
  if (els.status) els.status.textContent = "doğrulanıyor…";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, turnstileToken }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.ok) {
      if (els.status) els.status.textContent = "giriş başarılı";
      const target = data.redirect && data.redirect.startsWith("/panel")
        ? data.redirect
        : nextUrl();
      location.href = target;
      return;
    }

    showError(MESSAGES[data.error] || "Giriş yapılamadı. Bilgileri kontrol edin.");
    if (els.status) els.status.textContent = "hatalı deneme";
    resetTurnstile();
  } catch {
    showError(MESSAGES.network);
    if (els.status) els.status.textContent = "bağlantı hatası";
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
