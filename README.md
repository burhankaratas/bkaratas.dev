# bkaratas.dev

Mahmut Burhan Karataş için tek sayfalık, çift dilli (TR/EN) kişisel portföy sitesi.
Vanilla HTML / CSS / JavaScript — statik site. Yönetim paneli ise Vercel Functions
(`/api`) üzerinde çalışır; build adımı gerekmez.

## Dosyalar

| Dosya         | Açıklama                                  |
| ------------- | ----------------------------------------- |
| `index.html`  | Sayfanın tüm içeriği (Hero → Hakkımda → Yetenekler → Projeler → İletişim) + SEO/Open Graph meta + JSON-LD |
| `styles.css`  | Koyu tema, responsive tasarım             |
| `script.js`   | TR/EN dil değiştirici, mobil menü, scroll animasyonları |
| `favicon.svg` | MBK monogram favicon                      |
| `assets/og.png` | Sosyal paylaşım kartı (1200×630, WhatsApp/Instagram/X) |
| `assets/apple-touch-icon.png` | iOS/masaüstü ikonu (180×180) |
| `assets/og-source.html` | OG görselinin kaynağı (yeniden üretmek için) |
| `robots.txt` / `sitemap.xml` | Arama motoru yönergeleri ve site haritası |
| `site.webmanifest` | PWA/uygulama meta verisi |
| `<indexnow-key>.txt` | IndexNow doğrulama anahtarı (Bing/Yandex) |
| `panel/` | Yönetim paneli: giriş sayfası (`/panel`) + göstermelik kontrol ekranı (`/panel/dashboard`) |
| `api/` | Vercel Functions: `auth/login`, `auth/logout`, `auth/session`, `auth/config` (ortak kod `api/_lib/`) |
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
- **`robots.txt` + `sitemap.xml`:** tarama ve site haritası.
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

1. **Giriş sayfası** `/panel` — parola alanı + Cloudflare Turnstile widget'ı.
2. **`POST /api/auth/login`** — önce Turnstile token'ı Cloudflare'e sunucu tarafında doğrulatılır,
   sonra parola kontrol edilir; başarılıysa imzalı (HMAC) bir `HttpOnly` çerez verilir.
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
| `PANEL_PASSWORD_HASH` | ✅* | `node scripts/hash-password.mjs "parolanız"` çıktısı |
| `PANEL_PASSWORD` | — | *Hash yerine basit düz parola (önerilmez).* |

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

- Veritabanı bağlantısı (içerik deposu)
- Blog yazısı oluşturma / düzenleme
- Site içeriklerini panelden yönetme
- Medya yükleme
