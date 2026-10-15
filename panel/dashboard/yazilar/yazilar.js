/* bkaratas.dev — panel: yazı listesi */
import {
  ensurePanelSession,
  wireLogout,
  panelFetch,
  escapeHtml,
  formatDateTR,
  showFlash,
} from "/panel/panel-common.js";

const els = {
  list: document.getElementById("post-list"),
  flash: document.getElementById("flash"),
  filters: document.getElementById("filters"),
};

let allPosts = [];
let currentFilter = "all";

function statusBadge(status) {
  return status === "published"
    ? '<span class="badge badge-published">yayında</span>'
    : '<span class="badge badge-draft">taslak</span>';
}

function render() {
  const posts = allPosts.filter((p) =>
    currentFilter === "all" ? true : currentFilter === "published" ? p.status === "published" : p.status !== "published"
  );

  if (!posts.length) {
    els.list.innerHTML =
      allPosts.length === 0
        ? '<p class="empty">Henüz yazı yok. “+ Yeni Yazı” ile başla.</p>'
        : '<p class="empty">Bu filtreye uyan yazı yok.</p>';
    return;
  }

  els.list.innerHTML = posts
    .map((post) => {
      const category = post.category
        ? `<span class="badge badge-cat">${escapeHtml(post.category)}</span>`
        : "";
      const view =
        post.status === "published"
          ? `<a class="btn btn-sm" href="/blog/${encodeURIComponent(post.slug)}" target="_blank" rel="noopener">Görüntüle</a>`
          : `<a class="btn btn-sm" href="/blog/${encodeURIComponent(post.slug)}" target="_blank" rel="noopener">Önizle</a>`;
      return `
        <article class="post-item">
          <div class="post-item-main">
            <h2 class="post-item-title">
              <a href="/panel/dashboard/yazilar/duzenle/?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
            </h2>
            <p class="post-item-meta">
              ${statusBadge(post.status)}
              ${category}
              <span class="sep">·</span>
              <span>${escapeHtml(formatDateTR(post.date))}</span>
              <span class="sep">·</span>
              <span>${post.readingMinutes} dk</span>
              <span class="sep">·</span>
              <span>/${escapeHtml(post.slug)}</span>
            </p>
          </div>
          <div class="post-item-actions">
            ${view}
            <a class="btn btn-sm" href="/panel/dashboard/yazilar/duzenle/?slug=${encodeURIComponent(post.slug)}">Düzenle</a>
            <button class="btn btn-sm btn-danger" type="button" data-delete="${escapeHtml(post.slug)}" data-title="${escapeHtml(post.title)}">Sil</button>
          </div>
        </article>`;
    })
    .join("");
}

async function load() {
  try {
    const data = await panelFetch("/api/panel/posts");
    allPosts = data.posts || [];
    render();
  } catch (error) {
    els.list.innerHTML = `<p class="empty">Yazılar yüklenemedi: ${escapeHtml(error.message)}</p>`;
  }
}

els.list.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const slug = button.getAttribute("data-delete");
  const title = button.getAttribute("data-title") || slug;
  if (!confirm(`“${title}” yazısı kalıcı olarak silinsin mi?\n\nBu işlem GitHub deposundan da siler.`)) return;

  button.disabled = true;
  try {
    await panelFetch(`/api/panel/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    showFlash(els.flash, "Yazı silindi. Site ~1 dakika içinde güncellenecek.", "ok");
    allPosts = allPosts.filter((p) => p.slug !== slug);
    render();
  } catch (error) {
    showFlash(els.flash, `Silinemedi: ${error.message}`, "error");
    button.disabled = false;
  }
});

els.filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.getAttribute("data-filter");
  [...els.filters.querySelectorAll("[data-filter]")].forEach((b) =>
    b.classList.toggle("btn-primary", b === button)
  );
  render();
});

async function init() {
  const user = await ensurePanelSession();
  if (!user) return;
  wireLogout();
  // Başlangıçta "Tümü" aktif
  const first = els.filters.querySelector('[data-filter="all"]');
  if (first) first.classList.add("btn-primary");
  load();
}

init();
