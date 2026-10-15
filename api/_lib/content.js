// İçerik katmanı — yazılar ÖZEL içerik deposunda (`bkaratas-content`) `yazilar/*.md`
// dosyalarında saklanır. Depo = veritabanı (site reposunda içerik bulunmaz).
//
// Okuma: GitHub Contents API (token ile) → bellek içi 60 sn önbellek.
//   Depo PRIVATE olduğu için GITHUB_TOKEN ZORUNLUDUR; `raw.githubusercontent` kullanılamaz.
//   Panel kaydettiğinde ilgili örnek (instance) önbelleği anında temizler; diğer örnekler
//   en fazla 60 sn içinde tazelenir. İçerik güncellemesi DEPLOY GEREKTİRMEZ.
//
// Yazma işlemleri burada YAPILMAZ; panel GitHub Contents API kullanır (github.js).
import matter from "gray-matter";

const POSTS_DIR = "yazilar";
const CACHE_TTL = 60 * 1000; // 60 sn

let cache = { at: 0, posts: null };

/** İçerik deposu (özel). */
export function contentRepo() {
  return process.env.GITHUB_CONTENT_REPO || "burhankaratas/bkaratas-content";
}
/** İçerik deposu dalı. */
export function contentBranch() {
  return process.env.GITHUB_CONTENT_BRANCH || "main";
}
function apiBase() {
  return process.env.GITHUB_API_BASE || "https://api.github.com";
}

function authHeaders(extra = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN tanımlı değil. Özel içerik deposunu okumak için Vercel ortam değişkenlerine ekleyin."
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "bkaratas.dev",
    ...extra,
  };
}

function contentsUrl(filePath) {
  return `${apiBase()}/repos/${contentRepo()}/contents/${filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/** Yalnızca güvenli slug karakterlerine izin ver (path traversal engeli). */
export function normalizeSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (slug.length > 96) return null;
  return slug;
}

function asString(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asTags(value) {
  if (Array.isArray(value)) {
    return value.map((t) => asString(t).trim()).filter(Boolean).slice(0, 24);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 24);
  }
  return [];
}

/** HTML gövdeden okuma süresi (dakika) kestirimi. */
export function readingMinutesFromHtml(html) {
  const text = asString(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 1;
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** HTML gövdeden düz metin (özet için). */
export function plainTextFromHtml(html) {
  return asString(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveExcerpt(html, max = 200) {
  const text = plainTextFromHtml(html);
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Ham markdown + frontmatter'ı yazı nesnesine dönüştürür. */
export function parsePost(raw, fallbackSlug = "") {
  let parsed;
  try {
    parsed = matter(raw);
  } catch {
    return null;
  }
  const data = parsed.data || {};
  const body = asString(parsed.content).trim();

  const slug = normalizeSlug(data.slug) || normalizeSlug(fallbackSlug);
  if (!slug) return null;

  const status = data.status === "published" ? "published" : "draft";
  const date = asString(data.date) || asString(data.createdAt) || "";
  const createdAt = asString(data.createdAt) || date;
  const updatedAt = asString(data.updatedAt) || createdAt;
  const time = Date.parse(date) || Date.parse(createdAt) || 0;

  return {
    slug,
    title: asString(data.title).trim() || "Başlıksız",
    category: asString(data.category).trim(),
    tags: asTags(data.tags),
    excerpt: asString(data.excerpt).trim(),
    status,
    date,
    createdAt,
    updatedAt,
    readingMinutes: Number(data.readingMinutes) > 0
      ? Number(data.readingMinutes)
      : readingMinutesFromHtml(body),
    time,
    body,
  };
}

/** Frontmatter + gövdeyi markdown dosyasına çevirir. */
export function serializePost(post) {
  const data = {
    title: post.title,
    slug: post.slug,
  };
  if (post.category) data.category = post.category;
  if (post.tags && post.tags.length) data.tags = post.tags;
  if (post.excerpt) data.excerpt = post.excerpt;
  data.status = post.status;
  data.date = post.date;
  data.createdAt = post.createdAt;
  data.updatedAt = post.updatedAt;
  data.readingMinutes = post.readingMinutes;
  data.bodyFormat = "html";

  return matter.stringify(`\n${post.body || ""}\n`, data);
}

/* ---------------------------------- okuma --------------------------------- */

async function listSlugs() {
  const url = `${contentsUrl(POSTS_DIR)}?ref=${encodeURIComponent(contentBranch())}`;
  const response = await fetch(url, { headers: authHeaders() });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`GitHub listeleme başarısız (${response.status})`);
  const items = await response.json();
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i.type === "file" && typeof i.name === "string" && i.name.endsWith(".md"))
    .map((i) => i.name.replace(/\.md$/, ""))
    .filter((s) => normalizeSlug(s));
}

async function readRaw(slug) {
  const url = `${contentsUrl(`${POSTS_DIR}/${slug}.md`)}?ref=${encodeURIComponent(contentBranch())}`;
  const response = await fetch(url, {
    headers: authHeaders({ Accept: "application/vnd.github.raw" }),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub okuma başarısız (${response.status})`);
  return response.text();
}

/** Tek bir yazıyı listeden bağımsız okur. */
async function readSingle(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const raw = await readRaw(normalized);
  if (!raw) return null;
  return parsePost(raw, normalized);
}

/** Tüm yazıları (taslak dahil) yükler; bellek önbelleği kullanır. */
export async function loadPosts({ force = false } = {}) {
  if (!force && cache.posts && Date.now() - cache.at < CACHE_TTL) {
    return cache.posts;
  }
  const slugs = await listSlugs();
  const raws = await Promise.all(
    slugs.map(async (slug) => ({ slug, raw: await readRaw(slug) }))
  );
  const posts = [];
  for (const { slug, raw } of raws) {
    if (!raw) continue;
    const post = parsePost(raw, slug);
    if (post) posts.push(post);
  }
  posts.sort((a, b) => (b.time || 0) - (a.time || 0) || a.title.localeCompare(b.title, "tr"));
  cache = { at: Date.now(), posts };
  return posts;
}

/** Önbelleği temizler (panel yazma işleminden sonra). */
export function invalidateContentCache() {
  cache = { at: 0, posts: null };
}

export async function listPublished() {
  const posts = await loadPosts();
  return posts.filter((p) => p.status === "published");
}

export async function getPublished(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const posts = await loadPosts();
  const post = posts.find((p) => p.slug === normalized);
  return post && post.status === "published" ? post : null;
}

export async function getAny(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const posts = await loadPosts();
  const found = posts.find((p) => p.slug === normalized);
  if (found) return found;
  // Önbellekte yok (ör. henüz tazelenmedi): dosyayı doğrudan oku.
  return readSingle(normalized);
}

export async function slugExists(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;
  const slugs = await listSlugs();
  return slugs.includes(normalized);
}

/** Panel için: taslak + yayında özet listesi. */
export async function listAllSummaries() {
  const posts = await loadPosts();
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: p.status,
    date: p.date || p.createdAt,
    updatedAt: p.updatedAt,
    readingMinutes: p.readingMinutes,
  }));
}
