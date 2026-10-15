/* bkaratas.dev — panel kontrol ekranı
   Oturum yoksa /panel sayfasına yönlendirir (sunucu tarafı korumaya ek katman). */

const els = {
  user: document.getElementById("panel-user"),
  logout: document.getElementById("logout"),
  sessionSub: document.getElementById("panel-session-sub"),
};

async function init() {
  try {
    const response = await fetch("/api/auth/session", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();

    if (!data || !data.authenticated) {
      location.replace("/panel");
      return;
    }

    if (els.user && data.user && data.user.id) {
      els.user.textContent = data.user.id;
    }
  } catch {
    location.replace("/panel");
  }
}

if (els.logout) {
  els.logout.addEventListener("click", async () => {
    els.logout.disabled = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* yönlendirme yine de yapılır */
    }
    location.replace("/panel");
  });
}

init();
