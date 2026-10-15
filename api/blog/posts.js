// GET /api/blog/posts — yayımlanmış yazıların özet listesi (JSON).
// Ana sayfadaki blog bölümü bu ucu kullanır. 24 saat CDN önbelleği.
import { listPublished, deriveExcerpt } from "../_lib/content.js";
import { json } from "../_lib/http.js";

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "GET" });
    }

    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 0;

    let posts = [];
    try {
      posts = await listPublished();
    } catch (error) {
      console.error("[blog.posts]", error);
      return json({ ok: false, error: "content_unavailable" }, 503);
    }

    let result = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || deriveExcerpt(p.body),
      category: p.category,
      tags: p.tags,
      date: p.date || p.createdAt,
      readingMinutes: p.readingMinutes,
      cover: p.cover || "",
      url: `/blog/${p.slug}`,
    }));
    if (limit) result = result.slice(0, limit);

    return json({ ok: true, count: result.length, posts: result }, 200, {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    });
  },
};
