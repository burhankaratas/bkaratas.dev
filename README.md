# bkaratas.dev

Mahmut Burhan Karataş için tek sayfalık, çift dilli (TR/EN) kişisel portföy sitesi.
Vanilla HTML / CSS / JavaScript — build adımı yok, statik dosyalar.

## Dosyalar

| Dosya         | Açıklama                                  |
| ------------- | ----------------------------------------- |
| `index.html`  | Sayfanın tüm içeriği (Hero → Hakkımda → Yetenekler → Projeler → İletişim) |
| `styles.css`  | Koyu tema, responsive tasarım             |
| `script.js`   | TR/EN dil değiştirici, mobil menü, scroll animasyonları |
| `favicon.svg` | MBK monogram favicon                      |

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

1. Vercel → projeniz → **Settings → Domains → Add** → `bkaratas.dev`
2. Vercel'in verdiği DNS kayıtlarını alan adı sağlayıcınızda ayarlayın:
   - **A record:** `76.76.21.21` → `bkaratas.dev`
   - **CNAME:** `cname.vercel-dns.com` → `www.bkaratas.dev`
3. Yayına alındığında HTTPS otomatik sağlanır.

## İçerik güncelleme

- **Metinler / çeviriler:** `script.js` içindeki `I18N` nesnesi (üstte `tr` ve `en`).
- **Bağlantılar (e-posta, GitHub, LinkedIn):** `index.html` → `#iletisim` bölümü.
- **Yeni proje eklemek:** `index.html` → `#projeler` içindeki `.project-card` bloğunu kopyalayın,
  çeviriler için `script.js` → `projects.p3.desc` gibi yeni bir key ekleyin.
- **Renk / vurgu:** `styles.css` → `:root` değişkenleri (`--accent` vurgu rengidir).
