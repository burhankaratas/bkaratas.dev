// GET /sitemap.xml — ana sayfa, blog listesi ve yayımlanmış yazıları içerir.
// `/sitemap.xml` buraya yönlendirilir (vercel.json rewrites).
import { listPublished } from "./_lib/content.js";

const SITE = "https://bkaratas.dev";

function xmlEscape(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET" } });
    }

    let posts = [];
    try {
      posts = await listPublished();
    } catch (error) {
      console.error("[sitemap]", error);
    }

    const entries = [
      urlEntry(`${SITE}/`, null, "monthly", "1.0"),
      urlEntry(`${SITE}/blog`, null, "weekly", "0.7"),
      ...posts.map((p) =>
        urlEntry(`${SITE}/blog/${p.slug}`, (p.updatedAt || p.date || "").slice(0, 10), "monthly", "0.6")
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  },
};
