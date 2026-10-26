import { ensurePanelSession, wireLogout, panelFetch, showFlash } from "/panel/panel-common.js";

function formatTTL(expSeconds) {
  const diff = expSeconds - Math.floor(Date.now() / 1000);
  if (diff <= 0) return "süresi dolmuş";
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  if (h > 0) return `${h} saat ${m} dakika`;
  return `${m} dakika`;
}

async function init() {
  const user = await ensurePanelSession();
  wireLogout();

  const flash = document.getElementById("flash");

  // Oturum bilgisini /api/auth/session'dan daha detaylı çek
  try {
    const res = await fetch("/api/auth/session", { headers: { Accept: "application/json" } });
    const data = await res.json();
    if (data && data.authenticated) {
      const userEl = document.getElementById("session-user");
      const ttlEl = document.getElementById("session-ttl");
      if (userEl && data.user) userEl.textContent = data.user.id || "admin";
      // TTL bilgisi session API'den gelmiyor; user nesnesindeki exp varsa göster
      if (ttlEl) {
        const exp = user && user.exp;
        ttlEl.textContent = exp ? formatTTL(exp) : "12 saat (varsayılan)";
      }
    }
  } catch {
    /* session bilgisi gösterilemedi, devam */
  }

  // Hash üreteci
  const hashBtn = document.getElementById("hash-btn");
  const hashResult = document.getElementById("hash-result");
  const hashValue = document.getElementById("hash-value");
  const copyBtn = document.getElementById("copy-btn");
  const passwordInput = document.getElementById("new-password");

  hashBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();
    if (!password) {
      showFlash(flash, "Parola boş olamaz.", "error");
      return;
    }
    hashBtn.disabled = true;
    hashBtn.textContent = "Üretiliyor…";
    try {
      const data = await panelFetch("/api/panel/hash", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      hashValue.textContent = data.hash;
      hashResult.hidden = false;
      passwordInput.value = "";
    } catch (err) {
      showFlash(flash, `Hash üretilemedi: ${err.message}`, "error");
    } finally {
      hashBtn.disabled = false;
      hashBtn.textContent = "Hash Üret";
    }
  });

  copyBtn.addEventListener("click", async () => {
    const text = hashValue.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Kopyalandı ✓";
      setTimeout(() => { copyBtn.textContent = "Kopyala"; }, 2000);
    } catch {
      showFlash(flash, "Panoya kopyalanamadı; metni elle seçip kopyala.", "error");
    }
  });
}

init();
