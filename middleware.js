// bkaratas.dev — Routing Middleware
// /panel/dashboard altındaki sayfaları yalnızca oturum açmış kullanıcıya açar.
// Yalnızca Node.js çalışma zamanında (node:crypto) çalışır.
import { next } from "@vercel/functions";
import { readSessionFromRequest } from "./api/_lib/session.js";

export const config = {
  runtime: "nodejs",
  matcher: ["/panel/dashboard", "/panel/dashboard/:path*"],
};

/**
 * Vercel Routing Middleware girişi.
 * - Oturum geçerliyse isteği olduğu gibi devam ettirir.
 * - Geçerli değilse /panel (giriş) sayfasına yönlendirir.
 * - Herhangi bir hata durumunda siteyi bozmamak için isteği geçirir;
 *   asıl koruma API katmanında ve panel sayfasındaki oturum kontrolündedir.
 */
export default function middleware(request) {
  try {
    const url = new URL(request.url);

    // Güvenlik ağı: yalnızca korunacak yolu ele al. (matcher zaten daraltır;
    // bu kontrol `/panel/dashboard.js` gibi varlıkları dışarıda bırakır.)
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const isProtected = path === "/panel/dashboard" || path.startsWith("/panel/dashboard/");
    if (!isProtected) {
      return next();
    }

    const session = readSessionFromRequest(request);
    if (session) {
      return next();
    }

    const target = `/panel?next=${encodeURIComponent(url.pathname)}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: target,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[panel.middleware]", error);
    return next();
  }
}
