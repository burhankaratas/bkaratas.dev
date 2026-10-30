# bkaratas.dev

Mahmut Burhan Karataş için tek sayfalık, çift dilli (TR/EN) kişisel portföy sitesi.
Vanilla HTML / CSS / JavaScript — statik site. Yönetim paneli ise Vercel Functions
(`/api`) üzerinde çalışır; build adımı gerekmez.

## Dosyalar

| Dosya         | Açıklama                                  |
| ------------- | ----------------------------------------- |
| `index.html`  | Sayfanın tüm içeriği (Hero → Projeler → Hakkımda → Blog → Yetenekler → İletişim) + SEO/Open Graph meta + JSON-LD |
| `styles.css`  | Koyu tema, responsive tasarım             |
| `script.js`   | TR/EN dil değiştirici, mobil menü, scroll animasyonları |
| `favicon.svg` | MBK monogram favicon                      |
| `assets/og.png` | Sosyal paylaşım kartı (1200×630, WhatsApp/Instagram/X) |
| `assets/apple-touch-icon.png` | iOS/masaüstü ikonu (180×180) |
| `assets/og-source.html` | OG görselinin kaynağı (yeniden üretmek için) |
| `robots.txt` | Arama motoru yönergeleri (site haritası `/sitemap.xml` dinamik üretilir) |
| `site.webmanifest` | PWA/uygulama meta verisi |
| `<indexnow-key>.txt` | IndexNow doğrulama anahtarı (Bing/Yandex) |
| `panel/` | Yönetim paneli: giriş (`/panel`) + kontrol ekranı (`/panel/dashboard`) + yazı yönetimi (`/panel/dashboard/yazilar`) |
| `api/` | Vercel Functions: `auth/*`, `blog/*` (list · post · posts), `panel/*` (posts), `sitemap` (ortak kod `api/_lib/`) |
| `burhankaratas/bkaratas-content` | Blog içeriğinin **özel** deposu (ayrı repo): `yazilar/*.md` (frontmatter + HTML gövde). Depo = veritabanı; panel buraya commit'ler |
| `middleware.js` | `/panel/dashboard` için sunucu tarafı oturum kapısı |
| `scripts/hash-password.mjs` | Panel parolası için `PANEL_PASSWORD_HASH` üretici |
| `vercel.json` | Panel/API yanıtlarına `noindex` başlıkları |
| `.env.example` | Gerekli ortam değişkenlerinin örneği |

## Yerelde görme

Yalnızca ana siteyi (statik) görmek için:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Paneli ve API'yi (Turnstile girişi, oturum) görmek için Vercel geliştirme ortamı gerekir:

```bash
npm install
npx vercel dev
# → http://localhost:3000/panel
```

## Vercel'e deploy

1. Bu klasörü bir GitHub deposuna itin (`bkaratas.dev` adında repo önerilir).
2. [vercel.com](https://vercel.com) → **Add New → Project** → depoyu import edin.
3. Framework preset: **Other** (build komutu gerekmez), output directory: `/` (boş bırakılabilir).
4. Deploy edin.

### Alternatif: CLI ile

```bash
npm i -g vercel
vercel --prod
```

### Özel alan adı (bkaratas.dev)

Alan adı **name.com** üzerinden alındı ve Vercel'in nameserver'larına yönlendirildi:

- **Nameserver:** `ns1.vercel-dns.com` / `ns2.vercel-dns.com`
- Vercel → **Settings → Domains** altında `bkaratas.dev` ve `www.bkaratas.dev` bağlıdır.
- HTTPS otomatik sağlanır.

## SEO ve sosyal paylaşım

- **Open Graph / Twitter meta:** `index.html` `<head>` — WhatsApp, Instagram, Facebook, X, Telegram, Slack önizlemeleri için.
- **JSON-LD (`@graph`):** `Person`, `WebSite`, `ProfilePage` ve projeler (`ItemList`) — arama motorlarına "kim" olduğunu ve projelerle ilişkisini bildirir.
- **`robots.txt` + `/sitemap.xml`:** tarama ve site haritası. Site haritası dinamik üretilir (`api/sitemap.js`) ve ana sayfa, `/blog` ile tüm yayımlanmış yazıları listeler.
- **OG görselini yenileme** (tasarımı değiştirdiyseniz):

  ```bash
  cd /tmp/opencode/pw && node gen-og.js
  # kaynak: assets/og-source.html → çıktı: assets/og.png + assets/apple-touch-icon.png
  ```

### Arama motorlarına kaydolma (bir kez yapılır, hesap gerekir)

1. **Google Search Console** → <https://search.google.com/search-console> → URL öneki `https://bkaratas.dev/` → doğrulama için `<meta name="google-site-verification" ...>` etiketini `<head>` içine ekleyin → `sitemap.xml` gönderin.
2. **Bing Webmaster Tools** → <https://www.bing.com/webmasters> → siteyi ekleyip `sitemap.xml` gönderin. IndexNow sayesinde yeni içerik anında bildirilir.
2. **IndexNow ping** (deploy sonrası yeni URL bildirimi):

   ```bash
   KEY=$(cat <indexnow-key>.txt)
   curl "https://api.indexnow.org/indexnow?url=https://bkaratas.dev/&key=$KEY"
   ```

> Not: "Mahmut Burhan Karataş" aramasında üst sıralar için zaman, düzenli içerik ve diğer profillerden (GitHub, LinkedIn, Medium, Instagram) siteye bağlantı (backlink) gerekir. `sameAs` alanları bu kimlikleri birbirine bağlar.

## Blog

Blog, veritabanı olmadan çalışır: **içerik deposu = veritabanı**. Yazılar siteden bağımsız,
**özel** bir GitHub deposunda tutulur; site reposu (bu depo) **public** kalır ve içerik barındırmaz.

- **İçerik deposu:** `burhankaratas/bkaratas-content` (private) → `yazilar/<slug>.md`
  — frontmatter (başlık, slug, kategori, etiketler, özet, `status: published|draft`, tarihler,
  okuma süresi) + HTML gövde.
- **Okuma (`api/_lib/content.js`):** GitHub Contents API (token ile) → 60 sn bellek-içi önbellek.
  Depo private olduğu için `GITHUB_TOKEN` zorunludur; `raw.githubusercontent` kullanılmaz.
- **Yayımlama (panel):** yazı, GitHub Contents API ile içerik deposuna commit'lenir; ilgili
  örnek önbelleği anında temizler. **Deploy gerekmez**; içerik en fazla ~1 dakikada görünür.
- **Sayfalar:** `/blog` (liste) ve `/blog/<slug>` (yazı) sunucu tarafında üretilen HTML'dir
  (`api/_lib/blog-html.js`) — SEO/Open Graph/JSON-LD içerir.
- **Ana sayfa bölümü:** `#blog` bölümü `/api/blog/posts?limit=3` ile beslenir; yayımlanmış
  yazı yoksa bölüm ve menü bağlantısı gizli kalır.
- **Taslak önizleme:** `status: draft` yazılar dışarıya 404 döner; **panel oturumu açıkken**
  `/blog/<slug>` adresinde "önizleme" rozetiyle gösterilir (`noindex`, `no-store`).
- **Görseller:** Ayrı yükleme sistemi yoktur; editörde araç çubuğundan görsel **URL'si** eklenir
  (satır içi `<img>`). Gömülü `data:` görseller kabul edilmez.
- **Site haritası:** `/sitemap.xml` dinamiktir ve yayımlanmış yazıları içerir. Kök dizinde
  statik `sitemap.xml` **bulunmamalıdır**; aksi hâlde statik dosya rewrite'ı gölgeler.
- **Gizlilik:** Taslaklar yalnızca private içerik deposunda durur; public site reposunda
  içerik bulunmadığından taslaklar dışarıya sızmaz.

## İçerik güncelleme

- **Metinler / çeviriler:** `script.js` içindeki `I18N` nesnesi (üstte `tr` ve `en`).
- **Bağlantılar (e-posta, GitHub, LinkedIn):** `index.html` → `#iletisim` bölümü.
- **Yeni proje eklemek:** `index.html` → `#projeler` içindeki `.project-card` bloğunu kopyalayın,
  çeviriler için `script.js` → `projects.p3.desc` gibi yeni bir key ekleyin.
- **Renk / vurgu:** `styles.css` → `:root` değişkenleri (`--accent` vurgu rengidir).

## Yönetim paneli

Panel temeli Vercel Functions üzerinde çalışır. Site statik kalmaya devam eder;
yalnızca `/panel` ve `/api` yolları dinamiktir.

### Nasıl çalışır?

1. **Giriş sayfası** `/panel` — kullanıcı adı + parola alanları + Cloudflare Turnstile widget'ı.
2. **`POST /api/auth/login`** — önce Turnstile token'ı Cloudflare'e sunucu tarafında doğrulatılır,
   sonra kullanıcı adı ve parola kontrol edilir; başarılıysa imzalı (HMAC) bir `HttpOnly` çerez verilir.
3. **`middleware.js`** — `/panel/dashboard` isteklerini çerez geçerli değilse `/panel`'e yönlendirir.
4. **`POST /api/auth/logout`** — çerezi siler. **`GET /api/auth/session`** — oturum durumu.

Güvenlik: oturum çerezi `HttpOnly` + `Secure` + `SameSite=Lax`, 12 saat geçerlidir ve
sunucu tarafında durum tutulmaz (stateless). Parola `scrypt` ile özetlenir. Giriş denemeleri
IP başına sınırlandırılır (bellek-içi, best-effort). Panel ve API, `robots.txt` + `X-Robots-Tag`
+ `<meta name="robots">` ile botlara/arama motorlarına kapalıdır (ayrıca `sitemap.xml`'e eklenmez).

### 1. Ortam değişkenleri

Yerelde `.env.example` dosyasını `.env.local` olarak kopyalayın; Vercel'de
**Project → Settings → Environment Variables** altına ekleyin:

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `PANEL_SESSION_SECRET` | ✅ | Oturum imzalama anahtarı. `openssl rand -hex 32` |
| `TURNSTILE_SITE_KEY` | ✅ | Cloudflare Turnstile site key (herkese açık) |
| `TURNSTILE_SECRET_KEY` | ✅ | Cloudflare Turnstile secret key (gizli) |
| `PANEL_USERNAME` | — | Panel kullanıcı adı. Tanımlanmazsa `mbkaratas` kullanılır. |
| `PANEL_PASSWORD_HASH` | ✅* | `node scripts/hash-password.mjs "parolanız"` çıktısı |
| `PANEL_PASSWORD` | — | *Hash yerine basit düz parola (önerilmez).* |
| `GITHUB_TOKEN` | ✅ | Fine-grained PAT, yalnızca `burhankaratas/bkaratas-content` (Contents: **Read and write**). Site içeriği bu token ile okur/yazar. |
| `GITHUB_CONTENT_REPO` | — | İçerik deposu. Varsayılan: `burhankaratas/bkaratas-content` |
| `GITHUB_CONTENT_BRANCH` | — | İçerik deposu dalı. Varsayılan: `main` |

Fine-grained token: GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens** →
Repository access: yalnızca `burhankaratas/bkaratas-content` · Permissions: **Contents → Read and write**.

### 2. Cloudflare Turnstile

[dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** → **Add site**.
Widget modu: **Managed**. Aldığınız **Site Key** ve **Secret Key**'i ortam değişkenlerine ekleyin.

### 3. Yerelde çalıştırma

```bash
npm install
npx vercel dev        # http://localhost:3000/panel
```

> Turnstile anahtarları tanımlı değilse, **geliştirme** ortamında bot doğrulaması atlanır
> (başlıyor olsun diye). Üretimde (`VERCEL_ENV=production`) anahtar zorunludur.

### Sıradaki adımlar

- Site içeriklerini (metin/çeviri) panelden yönetme
- Medya yönetimi (içerik deposundaki görselleri listeleme)
- Mesajlar (iletişim formu)
- Ayarlar

> Blog tarafı tamamlandı. Ayrı bir veritabanı yoktur; içerik, özel
> `burhankaratas/bkaratas-content` deposundaki `yazilar/*.md` dosyalarında tutulur.
