// Blog sayfalarının sunucu tarafında üretilen HTML'i.
// Görsel dil ana siteyle uyumludur: koyu zemin, amber vurgu, mono etiketler.
//
// Not: Bu modül bilinçli olarak hafif tutulur. `escapeHtml` burada yerel olarak
// tanımlanır; `sanitize-html` (ağır CJS bağımlılık) yalnızca panel yazma yolunda
// kullanılır ve public blog render zincirine dahil edilmez.

/** HTML kaçışı (metin alanları şablona gömülmeden önce). */
function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SITE = "https://bkaratas.dev";
const YEAR = new Date().getFullYear();

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function formatDate(iso) {
  const time = Date.parse(iso || "");
  if (!time) return "";
  const d = new Date(time);
  return `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}

function absUrl(p) {
  if (!p) return "";
  if (/^https?:\/\//.test(p)) return p;
  return SITE + (p.startsWith("/") ? p : `/${p}`);
}

function header() {
  return `
  <header class="blog-header">
    <div class="wrap blog-header-inner">
      <a class="brand" href="/" aria-label="bkaratas.dev">
        <span class="slash">//</span><span>bkaratas.dev</span>
      </a>
      <nav class="blog-nav" aria-label="Site">
        <a href="/">Ana Sayfa</a>
        <a href="/#projeler">Projeler</a>
        <a class="is-active" href="/blog">Blog</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="blog-footer">
    <div class="wrap blog-footer-inner">
      <p>© ${YEAR} Mahmut Burhan Karataş</p>
      <p class="mono">Vanilla HTML · CSS · JavaScript</p>
      <a class="mono" href="/blog">~/blog</a>
    </div>
  </footer>`;
}

function layout({ title, description, canonical, body, ogImage, jsonLd, robots = "index, follow" }) {
  const fullTitle = title ? `${title} — bkaratas.dev` : "Blog — bkaratas.dev";
  const desc = description || "Mahmut Burhan Karataş'ın yazıları: yazılım, ürün geliştirme ve notlar.";
  const canonicalUrl = canonical ? absUrl(canonical) : SITE + "/blog";
  const og = ogImage
    ? `<meta property="og:image" content="${escapeHtml(absUrl(ogImage))}">
  <meta name="twitter:image" content="${escapeHtml(absUrl(ogImage))}">`
    : `<meta property="og:image" content="${SITE}/assets/og.png">
  <meta name="twitter:image" content="${SITE}/assets/og.png">`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#0a0a0b">
  <meta name="author" content="Mahmut Burhan Karataş">

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" hreflang="tr" href="${escapeHtml(canonicalUrl)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="bkaratas.dev">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:title" content="${escapeHtml(title || "Blog")}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${og}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title || "Blog")}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/blog.css">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
  <a class="skip-link" href="#icerik">İçeriğe geç</a>
  ${header()}
  ${body}
  ${footer()}
</body>
</html>`;
}

function postCard(post) {
  const category = post.category
    ? `<span class="dot-sep">·</span><span class="card-cat">${escapeHtml(post.category)}</span>`
    : "";
  return `
    <article class="post-card">
      <div class="card-main">
        <p class="card-meta mono">
          <time datetime="${escapeHtml(post.date || post.createdAt)}">${escapeHtml(formatDate(post.date || post.createdAt))}</time>
          <span class="dot-sep">·</span><span>${post.readingMinutes} dk okuma</span>${category}
        </p>
        <h2 class="card-title">
          <a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
        </h2>
        ${post.excerpt ? `<p class="card-excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
        <a class="card-more mono" href="/blog/${encodeURIComponent(post.slug)}">devamını oku <span aria-hidden="true">→</span></a>
      </div>
    </article>`;
}

export function renderListPage(posts) {
  const body = `
  <main id="icerik" class="wrap blog-main">
    <div class="section-label">
      <span class="sec-num">//</span>
      <span>yazılar</span>
      <span class="sec-rule"></span>
    </div>
    <h1 class="page-title">Blog</h1>
    <p class="page-intro">Yazılım, ürün geliştirme ve öğrendiklerim üzerine notlar.</p>

    <div class="post-list">
      ${posts.map(postCard).join("\n")}
    </div>
  </main>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "bkaratas.dev — Blog",
    url: `${SITE}/blog`,
    inLanguage: "tr-TR",
    author: { "@type": "Person", name: "Mahmut Burhan Karataş", url: SITE },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date || p.createdAt,
    })),
  };

  return layout({
    title: "Blog",
    description: "Mahmut Burhan Karataş'ın yazılım ve ürün geliştirme üzerine yazıları.",
    canonical: "/blog",
    body,
    jsonLd,
  });
}

export function renderEmptyListPage() {
  const body = `
  <main id="icerik" class="wrap blog-main">
    <div class="section-label">
      <span class="sec-num">//</span>
      <span>yazılar</span>
      <span class="sec-rule"></span>
    </div>
    <h1 class="page-title">Blog</h1>
    <p class="page-intro">Henüz yayımlanmış bir yazı yok. Yakında burada olacak.</p>
    <p><a class="mono" href="/">← ana sayfaya dön</a></p>
  </main>`;
  return layout({
    title: "Blog",
    description: "Mahmut Burhan Karataş'ın yazıları.",
    canonical: "/blog",
    body,
    robots: "noindex, follow",
  });
}

export function renderPostPage(post, allPosts = [], { preview = false } = {}) {
  const previewBar = preview
    ? `<div class="preview-bar" role="status">
      <span class="preview-tag">önizleme</span>
      <span>${post.status === "published" ? "Yayında" : "Taslak"} — yalnızca panel oturumuyla görülebilir, arama motorlarına kapalıdır.</span>
    </div>`
    : "";
  const tags = post.tags && post.tags.length
    ? `<ul class="chips">${post.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
    : "";
  const category = post.category
    ? `<span class="dot-sep">·</span><span>${escapeHtml(post.category)}</span>`
    : "";

  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const body = `
  <main id="icerik" class="wrap">
    ${previewBar}
    <article class="post">
      <p class="breadcrumb mono"><a href="/blog">← tüm yazılar</a></p>
      <header class="post-head">
        <div class="section-label">
          <span class="sec-num">//</span>
          <span>${escapeHtml(post.category || "yazı")}</span>
          <span class="sec-rule"></span>
        </div>
        <h1 class="post-title">${escapeHtml(post.title)}</h1>
        <p class="post-meta mono">
          <time datetime="${escapeHtml(post.date || post.createdAt)}">${escapeHtml(formatDate(post.date || post.createdAt))}</time>
          <span class="dot-sep">·</span><span>${post.readingMinutes} dk okuma</span>${category}
        </p>
      </header>
      <div class="article-body">
        ${post.body || ""}
      </div>
      ${tags}
      <p class="post-back"><a class="mono" href="/blog">← tüm yazılar</a></p>
    </article>
    ${
      related.length
        ? `<aside class="related">
      <div class="section-label"><span class="sec-num">//</span><span>diğer yazılar</span><span class="sec-rule"></span></div>
      <ul class="related-list">
        ${related
          .map(
            (p) =>
              `<li><a href="/blog/${encodeURIComponent(p.slug)}"><span class="related-title">${escapeHtml(p.title)}</span><span class="mono related-meta">${escapeHtml(formatDate(p.date || p.createdAt))}</span></a></li>`
          )
          .join("")}
      </ul>
    </aside>`
        : ""
    }
  </main>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: `${SITE}/assets/og.png`,
    datePublished: post.date || post.createdAt,
    dateModified: post.updatedAt || post.date || post.createdAt,
    author: { "@type": "Person", name: "Mahmut Burhan Karataş", url: SITE },
    publisher: {
      "@type": "Person",
      name: "Mahmut Burhan Karataş",
      url: SITE,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
    inLanguage: "tr-TR",
    keywords: (post.tags || []).join(", ") || undefined,
  };

  return layout({
    title: post.title,
    description: post.excerpt || undefined,
    canonical: `/blog/${post.slug}`,
    body,
    jsonLd,
    robots: preview ? "noindex, nofollow" : "index, follow",
  });
}

export function renderNotFound() {
  const body = `
  <main id="icerik" class="wrap blog-main">
    <div class="section-label"><span class="sec-num">//</span><span>404</span><span class="sec-rule"></span></div>
    <h1 class="page-title">Yazı bulunamadı</h1>
    <p class="page-intro">Aradığınız yazı yayında değil veya taşınmış olabilir.</p>
    <p><a class="mono" href="/blog">← tüm yazılar</a></p>
  </main>`;
  return layout({
    title: "Bulunamadı",
    description: "Aradığınız yazı bulunamadı.",
    canonical: "/blog",
    body,
    robots: "noindex, follow",
  });
}
