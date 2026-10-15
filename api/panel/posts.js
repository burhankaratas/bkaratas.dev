// /api/panel/posts — panel yazı yönetimi (oturum korumalı).
// ÖZEL içerik deposuna yazar (depo = veritabanı).
//   GET    ?slug=...  → tek yazı (taslak dahil) ; slug yoksa özet liste
//   POST              → yazı oluştur/güncelle (GitHub'a commit)
//   DELETE ?slug=...  → yazı sil (GitHub'dan)
import { json } from "../_lib/http.js";
import { requireSession } from "../_lib/guard.js";
import {
  getAny,
  listAllSummaries,
  loadPosts,
  normalizeSlug,
  serializePost,
  invalidateContentCache,
  readingMinutesFromHtml,
  deriveExcerpt,
} from "../_lib/content.js";
import { slugify, uniqueSlug } from "../_lib/slug.js";
import { sanitizePostHtml } from "../_lib/sanitize.js";
import { githubConfigured, putTextFile, deleteFile } from "../_lib/github.js";

const POSTS_DIR = "yazilar";

function asTags(value) {
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean).slice(0, 24);
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 24);
  }
  return [];
}

function methodNotAllowed(allow) {
  return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: allow });
}

export default {
  async fetch(request) {
    const { response } = requireSession(request);
    if (response) return response;

    const url = new URL(request.url);
    const slugParam = normalizeSlug(url.searchParams.get("slug"));

    if (request.method === "GET") {
      try {
        if (slugParam) {
          const post = await getAny(slugParam);
          if (!post) return json({ ok: false, error: "not_found" }, 404);
          return json({ ok: true, post });
        }
        const posts = await listAllSummaries();
        return json({ ok: true, count: posts.length, posts });
      } catch (error) {
        console.error("[panel.posts.get]", error);
        return json({ ok: false, error: "content_error", message: String(error.message || "") }, 502);
      }
    }

    if (request.method === "DELETE") {
      if (!slugParam) return json({ ok: false, error: "slug_required" }, 400);
      if (!githubConfigured()) {
        return json({ ok: false, error: "github_not_configured" }, 500);
      }
      try {
        const post = await getAny(slugParam);
        const deleted = await deleteFile(
          `${POSTS_DIR}/${slugParam}.md`,
          `Panel: yazı silindi — ${post ? post.title : slugParam}`
        );
        invalidateContentCache();
        if (!deleted) return json({ ok: false, error: "not_found" }, 404);
        return json({ ok: true, slug: slugParam });
      } catch (error) {
        console.error("[panel.posts.delete]", error);
        return json({ ok: false, error: "github_error", message: String(error.message || "") }, 502);
      }
    }

    if (request.method === "POST") {
      if (!githubConfigured()) {
        return json(
          {
            ok: false,
            error: "github_not_configured",
            message: "GITHUB_TOKEN tanımlı değil. Vercel ortam değişkenlerine ekleyin.",
          },
          500
        );
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid_body" }, 400);
      }

      const title = String(body?.title || "").trim() || "Başlıksız";
      const status = body?.status === "published" ? "published" : "draft";
      const category = String(body?.category || "").trim().slice(0, 60);
      const tags = asTags(body?.tags);
      const safeBody = sanitizePostHtml(String(body?.body || ""));
      const excerpt = String(body?.excerpt || "").trim().slice(0, 320) || deriveExcerpt(safeBody);

      // Hedef slug: düzenlemede sabit kalır; yenide başlıktan üretilir.
      const requested = normalizeSlug(body?.slug);
      let slug;
      let existing = null;
      try {
        if (requested) {
          slug = requested;
        } else {
          const all = await loadPosts();
          slug = uniqueSlug(slugify(title), all.map((p) => p.slug));
        }
        existing = await getAny(slug);
      } catch (error) {
        console.error("[panel.posts.lookup]", error);
        return json({ ok: false, error: "content_error", message: String(error.message || "") }, 502);
      }

      const now = new Date().toISOString();
      const post = {
        slug,
        title,
        category,
        tags,
        excerpt,
        status,
        body: safeBody,
        createdAt: existing?.createdAt || now,
        date: existing?.date || existing?.createdAt || now,
        updatedAt: now,
        readingMinutes: readingMinutesFromHtml(safeBody),
      };

      try {
        const content = serializePost(post);
        const action = existing ? "güncellendi" : "yeni yazı";
        await putTextFile(`${POSTS_DIR}/${slug}.md`, content, `Panel: ${action} — ${title}`);
        invalidateContentCache();
        return json({ ok: true, slug, status });
      } catch (error) {
        console.error("[panel.posts.save]", error);
        return json({ ok: false, error: "github_error", message: String(error.message || "") }, 502);
      }
    }

    return methodNotAllowed("GET, POST, DELETE");
  },
};
