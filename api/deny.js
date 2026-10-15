// Yardımcı uç — bazı yolları (ör. /content/*.md) 404'e yönlendirmek için.
export default {
  fetch() {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  },
};
