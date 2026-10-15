// İçerik katmanı — yazılar `content/yazilar/*.md` dosyalarında saklanır.
//
// Okuma stratejisi (kullanıcı isteği: istek anında GitHub API'ye gidilmesin):
//   1. Önce deploy ile birlikte gelen YEREL dosyalardan okunur (fs).
//   2. Yerel dosya bulunamazsa (ör. includeFiles yoksa) yalnızca o an
//      raw.githubusercontent.com'dan (API değil) çekilir.
//   3. Sonuç bellek içinde 24 saat önbelleğe alınır. Yeni deploy (yeni içerik)
//      yeni örnek (instance) başlattığı için önbellek kendiliğinden tazelenir.
//
// Yazma işlemleri burada YAPILMAZ; panel GitHub Contents API kullanır (github.js).
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = "content/yazilar";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

let cache = { at: 0, posts: null };

function repo() {
  return process.env.GITHUB_REPO || "burhankaratas/bkaratas.dev";
}
function branch() {
  return process.env.GITHUB_BRANCH || "main";
}
function apiBase() {
  return process.env.GITHUB_API_BASE || "https://api.github.com";
}
function localDir() {
  return path.join(process.cwd(), POSTS_DIR);
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
    cover: asString(data.cover).trim(),
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
  if (post.cover) data.cover = post.cover;
  data.status = post.status;
  data.date = post.date;
  data.createdAt = post.createdAt;
  data.updatedAt = post.updatedAt;
  data.readingMinutes = post.readingMinutes;
  data.bodyFormat = "html";

  return matter.stringify(`\n${post.body || ""}\n`, data);
}

/* ---------------------------------- okuma --------------------------------- */

async function listLocalSlugs() {
  const entries = await readdir(localDir(), { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/, ""))
    .filter((s) => normalizeSlug(s));
}

async function listRemoteSlugs() {
  const url = `${apiBase()}/repos/${repo()}/contents/${POSTS_DIR}?ref=${branch()}`;
  const response = await fetch(url, { headers: githubReadHeaders() });
  if (!response.ok) throw new Error(`GitHub listeleme başarısız: ${response.status}`);
  const items = await response.json();
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i.type === "file" && typeof i.name === "string" && i.name.endsWith(".md"))
    .map((i) => i.name.replace(/\.md$/, ""))
    .filter((s) => normalizeSlug(s));
}

function githubReadHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bkaratas.dev",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function readLocalRaw(slug) {
  return readFile(path.join(localDir(), `${slug}.md`), "utf8");
}

async function readRemoteRaw(slug) {
  const url = `https://raw.githubusercontent.com/${repo()}/${branch()}/${POSTS_DIR}/${slug}.md`;
  const response = await fetch(url, { headers: { "User-Agent": "bkaratas.dev" } });
  if (!response.ok) return null;
  return response.text();
}

async function readRaw(slug) {
  try {
    return await readLocalRaw(slug);
  } catch {
    /* yerelde yok; aşağıda uzaktan denenecek */
  }
  try {
    return await readRemoteRaw(slug);
  } catch {
    return null;
  }
}

/** Tek bir yazıyı listeden bağımsız okur (yerel → uzak ham dosya). */
async function readSingle(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const raw = await readRaw(normalized);
  if (!raw) return null;
  return parsePost(raw, normalized);
}

async function listSlugs() {
  try {
    return await listLocalSlugs();
  } catch {
    /* yerel dizin yok; uzaktan liste */
  }
  try {
    return await listRemoteSlugs();
  } catch {
    return [];
  }
}

/** Tüm yazıları (taslak dahil) yükler; 24 saat bellek önbelleği kullanır. */
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
  // Az önce commit'lenmiş olabilir (henüz yerel listeye/deploy'a girmemiş).
  // Panel ve önizleme yolları bu yedeği kullanır; yol, dosyayı doğrudan okur.
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
    cover: p.cover,
  }));
}
