# bkaratas.dev

Mahmut Burhan Karataş için tek sayfalık, çift dilli (TR/EN) kişisel portföy sitesi.
Vanilla HTML / CSS / JavaScript — build adımı yok, statik dosyalar.

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

## Yerelde görme

```bash
python3 -m http.server 8000
# → http://localhost:8000
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
