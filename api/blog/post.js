// GET /blog/<slug> — tek yazı sayfası (tam HTML).
// `/blog/:slug` adresi buraya yönlendirilir (vercel.json rewrites).
//
// Yayımlanmış yazılar herkese açıktır. Yayımlanmamış (taslak) yazılar ise
// YALNIZCA geçerli panel oturumu olan isteklere, "önizleme" olarak gösterilir
// (noindex + no-store). Oturumsuz istekler taslak için 404 alır.
import { getPublished, getAny, listPublished } from "../_lib/content.js";
import { renderPostPage, renderNotFound } from "../_lib/blog-html.js";
import { readSessionFromRequest } from "../_lib/session.js";

const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

function hasSession(request) {
  try {
    return Boolean(readSessionFromRequest(request));
  } catch {
    return false;
  }
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET" } });
    }

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || "";

    let post = null;
    let preview = false;
    try {
      post = await getPublished(slug);
      if (!post && hasSession(request)) {
        // Taslak: yalnızca oturum sahibine önizleme.
        const draft = await getAny(slug);
        if (draft) {
          post = draft;
          preview = true;
        }
      }
    } catch (error) {
      console.error("[blog.post]", error);
      return new Response("İçerik geçici olarak kullanılamıyor.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }

    if (!post) {
      return new Response(renderNotFound(), {
        status: 404,
        headers: { ...HTML_HEADERS, "X-Robots-Tag": "noindex, follow" },
      });
    }

    if (preview) {
      // Oturuma bağlı yanıt: asla önbelleğe alınmamalı.
      return new Response(renderPostPage(post, [], { preview: true }), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          Vary: "Cookie",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    let allPosts = [];
    try {
      allPosts = await listPublished();
    } catch {
      /* ilgili yazılar opsiyonel */
    }

    return new Response(renderPostPage(post, allPosts), {
      status: 200,
      headers: { ...HTML_HEADERS, "X-Robots-Tag": "index, follow" },
    });
  },
};
