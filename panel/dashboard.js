/* bkaratas.dev — panel kontrol ekranı
   Oturum yoksa /panel sayfasına yönlendirir (sunucu tarafı korumaya ek katman). */

const els = {
  user: document.getElementById("panel-user"),
  logout: document.getElementById("logout"),
  sessionSub: document.getElementById("panel-session-sub"),
  statPublished: document.getElementById("stat-published"),
  statDrafts: document.getElementById("stat-drafts"),
};

async function loadStats() {
  try {
    const response = await fetch("/api/panel/posts", { headers: { Accept: "application/json" } });
    if (!response.ok) return;
    const data = await response.json();
    if (!data || !data.ok) return;
    const posts = data.posts || [];
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status !== "published").length;
    if (els.statPublished) els.statPublished.textContent = String(published);
    if (els.statDrafts) els.statDrafts.textContent = String(drafts);
  } catch {
    /* istatistikler opsiyonel */
  }
}

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

    loadStats();
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
