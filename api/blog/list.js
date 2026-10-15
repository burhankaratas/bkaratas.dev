// GET /blog — yayımlanmış yazıların liste sayfası (tam HTML).
import { listPublished } from "../_lib/content.js";
import { renderListPage, renderEmptyListPage } from "../_lib/blog-html.js";

const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "X-Robots-Tag": "index, follow",
};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET" } });
    }

    let posts = [];
    try {
      posts = await listPublished();
    } catch (error) {
      console.error("[blog.list]", error);
      return new Response("İçerik geçici olarak kullanılamıyor.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }

    const html = posts.length ? renderListPage(posts) : renderEmptyListPage();
    return new Response(html, { status: 200, headers: HTML_HEADERS });
  },
};
