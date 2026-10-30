/* bkaratas.dev — i18n (TR/EN), mobile nav, reveal, scroll progress */

const I18N = {
  tr: {
    "meta.title": "Mahmut Burhan Karataş — Yazılım Geliştirici",
    "meta.description":
      "Mahmut Burhan Karataş (Burhan Karataş) — Python, Flask ve Next.js ile ürün geliştiren yazılım geliştirici. Sehven, Hesaplarız.org ve açık kaynak projeler.",

    "a11y.skip": "İçeriğe geç",

    "nav.menu": "Menü",
    "nav.about": "Hakkımda",
    "nav.skills": "Yetenekler",
    "nav.projects": "Projeler",
    "nav.blog": "Blog",
    "nav.contact": "İletişim",

    "hero.role": "Yazılım Geliştirici",
    "hero.tagline":
      "Temiz kod, otomasyon ve gerçekten işe yarayan ürünler kuran bir geliştirici. Fikri alıp çalışan web sitelerine ve araçlara dönüştürüyorum.",
    "hero.available": "Yeni fırsatlara açık",
    "hero.ctaProjects": "Projeleri Gör",
    "hero.ctaContact": "İletişime Geç",

    "about.label": "Hakkımda",
    "about.title": "Kısaca ben",
    "about.p1":
      "Merhaba, ben Burhan. Backend tarafında Python ve Flask ile ölçeklenebilir sistemler kurmayı; arayüz tarafında ise sade, hızlı ve erişilebilir web deneyimleri geliştirmeyi seviyorum.",
    "about.p2":
      "Sehven Dergi ve Hesaplarız.org gibi projelerimi uçtan uca tasarlayıp hayata geçiriyorum: fikirden arayüze, veritabanından yayına kadar her aşamasında çalışıyorum.",
    "about.p3":
      "Ürün geliştirirken önce problemi, kullanıcıyı ve başarı kriterini netleştiriyorum. Ardından çalışan en küçük sürümü yayına alıp geri bildirimle ilerliyorum. Kodun okunabilir, test edilebilir ve bakımı kolay olması benim için teslim tarihi kadar önemli. Birlikte çalışırken iletişimi açık tutar, belirsizlikleri erken konuşur ve teslim tarihlerini gerçekçi planlarım.",
    "about.p4":
      "Backend tarafında Python ve Flask ile API'ler, veritabanı modelleri ve kimlik doğrulama akışları kuruyorum; frontend tarafında Next.js, React ve vanilla JavaScript ile hızlı ve erişilebilir arayüzler geliştiriyorum. Otomasyon ve geliştirici deneyimi de işimin parçası: tekrarlayan görevleri scriptlere devretmek, deploy süreçlerini sadeleştirmek ve günlük iş akışını hızlandıran küçük araçlar üretmek. Dağıtım sonrası izleme ve bakım da sürecin doğal bir parçası.",
    "about.p5":
      "Şu anda kendi ürünlerimi geliştiriyor, açık kaynak projelere katkı sağlıyor ve yeni iş birliklerine açık kalıyorum. Yeni bir fikri sıfırdan tasarlamak, geliştirmek ve yayına almak için uygun ekiplerle tanışmayı seviyorum.",
    "about.p6":
      "Birlikte çalışacağımız projede kapsamı netleştirir, ilerlemeyi düzenli olarak paylaşır ve yayın sonrası destek için sürdürülebilir bir plan bırakırım. Amacım yalnızca çalışan bir ürün teslim etmek değil; onu rahatça kullanabileceğiniz ve gerektiğinde geliştirebileceğiniz bir temel bırakmak.",
    "about.approachTitle": "Nasıl çalışırım",
    "about.approachIntro": "Fikirden yayına giden süreçte izlediğim dört adım:",
    "about.a1Title": "Problemi netleştir",
    "about.a1":
      "Kimin için, hangi sorunu ve hangi başarı kriterini çözdüğümüzü konuşarak tanımlarım.",
    "about.a2Title": "Sade mimari kur",
    "about.a2":
      "Gereksiz bağımlılıklardan kaçınır, okunabilir ve bakımı kolay bir yapı kurarım.",
    "about.a3Title": "Çalışan sürümü erken yayınla",
    "about.a3":
      "Küçük ama gerçek bir sürümü kullanıma açar, geri bildirimle sonraki adımlara yön veririm.",
    "about.a4Title": "Yayın sonrası iyileştir",
    "about.a4": "Ölçüm, hata takibi ve küçük iterasyonlarla ürünü olgunlaştırırım.",
    "about.approachNote": "Her adımda şeffaf iletişim ve ölçülebilir çıktı hedeflerim.",
    "about.factLocation": "Konum",
    "about.factFocus": "Odak",
    "about.factFocusValue": "Backend & ürün geliştirme",
    "about.factStatus": "Durum",
    "about.factStatusValue": "Yeni fırsatlara açık",

    "skills.label": "Yetenekler",
    "skills.title": "Kullandığım teknolojiler",
    "skills.intro": "Projelerimde düzenli olarak kullandığım diller, kütüphaneler ve araçlar.",
    "skills.g1": "Diller & Web",
    "skills.g2": "Arka Uç",
    "skills.g3": "Veritabanı",
    "skills.g4": "Araçlar & Platform",

    "projects.label": "Projeler",
    "projects.title": "Yaptığım işler",
    "projects.intro": "Tasarlayıp geliştirdiğim projeler — bir kısmı canlı, bir kısmı açık kaynak.",
    "projects.live": "Canlı",
    "projects.visit": "Siteyi Aç",
    "projects.opensource": "Açık Kaynak",
    "projects.github": "Kodu Gör",
    "projects.private": "Özel",
    "projects.details": "Ayrıntılar",
    "projects.p7.desc":
      "Kişiye özel geliştirdiğim bir okuma notu ve alıntı arşivi. Kitap ve dergilerden alınan notlar kategorilere ve kaynaklarına bağlanıyor; Türkçe karakter duyarlı anlık arama, zengin metin editörü ve Word'e dışa aktarma içeriyor. Yalnızca onaylı cihazlardan erişilebilen, mobilde uygulama gibi çalışan bir PWA.",
    "detail.back": "← Projeler",
    "projects.p1.desc":
      "Bağımsız bir dijital edebiyat ve felsefe dergisi. Yazılar, sayılar, yazar profilleri ve editör paneliyle uçtan uca çalışan, monokrom bir yayın estetiğine sahip yayın platformu.",
    "projects.p2.desc":
      "30'dan fazla aracı tek sitede toplayan ücretsiz hesaplama koleksiyonu: finans, sağlık, tarih, ölçü ve daha fazlası. Tüm hesaplamalar tamamen tarayıcıda, kayıt gerekmeden çalışır.",
    "projects.p3.desc":
      "Flask tabanlı web uygulamasını Electron ile masaüstüne taşıyan modüler bir hızlı okuma programı. Takistoskop, anlam ve dikkat refleksi, dikkat analizi ve matematik modülleri içeriyor; yeni bir egzersiz eklemek için tek bir HTML dosyası yeterli.",
    "projects.p4.desc":
      "Çok yazarlı bir dijital yayın platformu. Yazarlar taslak yazıp yayına gönderiyor, editör onaylıyor; yazar profilleri, mesajlaşma ve hesap ayarlarıyla uçtan uca bir içerik üretim akışı sunuyor.",
    "projects.p5.desc":
      "Ovasan Mühendislik için geliştirdiğim kurumsal web sitesi ve içerik yönetim paneli. Flask Blueprint mimarisi, MySQL veritabanı, iletişim formu, SMTP ile e-posta gönderimi ve reCAPTCHA doğrulaması içeriyor.",
    "projects.p6.desc":
      "Python ile yazdığım çok amaçlı siber güvenlik aracı. TCP port taraması, URL'den IP çözümleme ve sözlük tabanlı brute force modülleriyle temel ağ güvenliği testleri için konsol arayüzü.",

    "blog.label": "Blog",
    "blog.title": "Yazdıklarım",
    "blog.intro": "Yazılım, ürün geliştirme ve öğrendiklerim üzerine notlar.",
    "blog.all": "tüm yazılar →",
    "blog.readMore": "devamını oku →",
    "blog.minRead": "dk okuma",

    "contact.label": "İletişim",
    "contact.title": "Birlikte çalışalım",
    "contact.desc": "Proje fikriniz, iş birliği ya da sadece merhaba demek için — her zaman açığım.",
    "contact.elsewhere": "Diğer profiller",

    "footer.note": "Vanilla HTML · CSS · JavaScript ile yapıldı.",
  },

  en: {
    "meta.title": "Mahmut Burhan Karataş — Software Developer",
    "meta.description":
      "Mahmut Burhan Karataş — a software developer building clean code, automation and products that matter. Projects: Sehven Magazine and Hesaplarız.org.",

    "a11y.skip": "Skip to content",

    "nav.menu": "Menu",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.blog": "Blog",
    "nav.contact": "Contact",

    "hero.role": "Software Developer",
    "hero.tagline":
      "A developer who builds clean code, automation and products that actually work. I take an idea and turn it into live websites and tools.",
    "hero.available": "Open to opportunities",
    "hero.ctaProjects": "View Projects",
    "hero.ctaContact": "Get in Touch",

    "about.label": "About",
    "about.title": "A little about me",
    "about.p1":
      "Hi, I'm Burhan. I enjoy building scalable backend systems with Python and Flask, and crafting simple, fast and accessible experiences on the frontend.",
    "about.p2":
      "I design and ship my own projects end to end — from idea to interface, database to deployment — such as Sehven Magazine and Hesaplarız.org.",
    "about.p3":
      "When building a product, I start by clarifying the problem, the user and the success criteria. Then I ship the smallest working version and iterate with feedback. Readable, testable and maintainable code matters to me as much as the delivery date. I keep communication open, raise uncertainties early and plan timelines realistically.",
    "about.p4":
      "On the backend I build APIs, database models and authentication flows with Python and Flask; on the frontend I craft fast, accessible interfaces with Next.js, React and vanilla JavaScript. Automation and developer experience are part of the work too: moving repetitive tasks into scripts, simplifying deployments and building small tools that speed up everyday workflows. Monitoring and maintenance after launch are a natural part of the process.",
    "about.p5":
      "Right now I'm building my own products, contributing to open-source projects and staying open to new collaborations. I enjoy meeting the right teams to design, build and launch a new idea from scratch.",
    "about.p6":
      "In every project I clarify the scope, share progress regularly and leave a sustainable plan for post-launch support. My goal isn't just to deliver something that works; it's to leave a foundation you can use comfortably and extend when needed.",
    "about.approachTitle": "How I work",
    "about.approachIntro": "The four steps I follow from idea to launch:",
    "about.a1Title": "Clarify the problem",
    "about.a1":
      "I define who it is for, which problem it solves and what success looks like — by talking it through.",
    "about.a2Title": "Keep the architecture simple",
    "about.a2":
      "I avoid unnecessary dependencies and build a structure that is readable and easy to maintain.",
    "about.a3Title": "Ship a working version early",
    "about.a3":
      "I put a small but real version into use and let feedback shape the next steps.",
    "about.a4Title": "Improve after launch",
    "about.a4": "I mature the product through measurement, error tracking and small iterations.",
    "about.approachNote": "My goal at every step is transparent communication and measurable output.",
    "about.factLocation": "Location",
    "about.factFocus": "Focus",
    "about.factFocusValue": "Backend & product development",
    "about.factStatus": "Status",
    "about.factStatusValue": "Open to opportunities",

    "skills.label": "Skills",
    "skills.title": "Technologies I work with",
    "skills.intro": "Languages, libraries and tools I use regularly across my projects.",
    "skills.g1": "Languages & Web",
    "skills.g2": "Backend",
    "skills.g3": "Databases",
    "skills.g4": "Tools & Platforms",

    "projects.label": "Projects",
    "projects.title": "Selected work",
    "projects.intro": "Projects I designed and built — some live, some open source.",
    "projects.live": "Live",
    "projects.visit": "Visit Site",
    "projects.opensource": "Open Source",
    "projects.github": "View Code",
    "projects.private": "Private",
    "projects.details": "Details",
    "projects.p7.desc":
      "A private reading-notes and quote archive I built for one person. Notes from books and magazines are linked to categories and sources, with Turkish-aware instant search, a rich-text editor and Word export. Accessible only from approved devices, and installable as an app on mobile (PWA).",
    "detail.back": "← Projects",
    "projects.p1.desc":
      "An independent digital literature and philosophy magazine. An end-to-end publishing platform with articles, issues, author profiles and an editor panel, with a monochrome publication aesthetic.",
    "projects.p2.desc":
      "A free collection of 30+ calculators in one place: finance, health, dates, measurements and more. Every calculation runs entirely in your browser — no sign-up required.",
    "projects.p3.desc":
      "A modular speed-reading app that wraps a Flask web server in an Electron desktop shell. Includes tachistoscope, comprehension and attention reflex, attention analysis and math modules — adding a new exercise takes a single HTML file.",
    "projects.p4.desc":
      "A multi-author digital publishing platform. Writers draft and submit posts for editorial approval, with author profiles, messaging and account settings — an end-to-end content workflow.",
    "projects.p5.desc":
      "A corporate website and content management panel I built for Ovasan Engineering. Flask Blueprint architecture with MySQL, a contact form, SMTP email delivery and reCAPTCHA validation.",
    "projects.p6.desc":
      "A multi-purpose cybersecurity tool written in Python. TCP port scanning, URL-to-IP resolution and wordlist-based brute force — a console interface for basic network security testing.",

    "blog.label": "Blog",
    "blog.title": "Writing",
    "blog.intro": "Notes on software, product development and what I learn along the way.",
    "blog.all": "all posts →",
    "blog.readMore": "read more →",
    "blog.minRead": "min read",

    "contact.label": "Contact",
    "contact.title": "Let's work together",
    "contact.desc": "Whether it's a project idea, a collaboration or just saying hello — I'm all ears.",
    "contact.elsewhere": "Other profiles",

    "footer.note": "Built with vanilla HTML · CSS · JavaScript.",
  },
};

const HTML_META = {
  tr: {
    title: "Mahmut Burhan Karataş — Yazılım Geliştirici",
    description:
      "Mahmut Burhan Karataş (Burhan Karataş) — Python, Flask ve Next.js ile ürün geliştiren yazılım geliştirici. Sehven, Hesaplarız.org ve açık kaynak projeler.",
    ogLocale: "tr_TR",
  },
  en: {
    title: "Mahmut Burhan Karataş — Software Developer",
    description:
      "Mahmut Burhan Karataş — a software developer building clean code, automation and products that matter. Projects: Sehven Magazine and Hesaplarız.org.",
    ogLocale: "en_US",
  },
};

const STORE_KEY = "bkaratas.lang";

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.tr;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });

  const meta = HTML_META[lang] || HTML_META.tr;

  if (window.location.pathname === "/" || window.location.pathname === "") {
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.description);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", meta.ogLocale);
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  if (typeof renderBlogCards === "function") renderBlogCards();

  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch (_) {
    /* storage may be unavailable */
  }
}

function initLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORE_KEY);
  } catch (_) {
    /* ignore */
  }

  const initial =
    saved || (navigator.language && navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en");

  applyLanguage(initial);

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", update, { passive: true });
  update();
}

/* ---------- Blog (ana sayfa bölümü) ---------- */

const BLOG_AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

let blogPosts = [];

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBlogDate(iso) {
  const time = Date.parse(iso || "");
  if (!time) return "";
  const d = new Date(time);
  return `${d.getDate()} ${BLOG_AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}

function renderBlogCards() {
  const list = document.getElementById("home-blog-list");
  if (!list || !blogPosts.length) return;
  const dict = I18N[document.documentElement.lang] || I18N.tr;

  list.innerHTML = blogPosts
    .map((post) => {
      const url = post.url || `/blog/${encodeURIComponent(post.slug)}`;
      const date = formatBlogDate(post.date);
      const category = post.category
        ? `<span class="sep">·</span><span class="blog-card-cat">${escapeHtml(post.category)}</span>`
        : "";
      return `
        <article class="blog-card">
          <div class="blog-card-body">
            <p class="blog-card-meta">
              <span>${escapeHtml(date)}</span>
              <span class="sep">·</span><span>${post.readingMinutes} ${escapeHtml(dict["blog.minRead"] || "dk okuma")}</span>
              ${category}
            </p>
            <h3><a href="${escapeHtml(url)}">${escapeHtml(post.title)}</a></h3>
            ${post.excerpt ? `<p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
            <a class="blog-card-more" href="${escapeHtml(url)}">${escapeHtml(dict["blog.readMore"] || "devamını oku →")}</a>
          </div>
        </article>`;
    })
    .join("");
}

async function initBlog() {
  const section = document.getElementById("blog");
  const list = document.getElementById("home-blog-list");
  const navBlog = document.getElementById("nav-blog");
  const skillsNum = document.getElementById("skills-sec-num");
  const navSkillsNum = document.getElementById("nav-skills-num");
  const contactNum = document.getElementById("contact-sec-num");
  const navContactNum = document.getElementById("nav-contact-num");
  if (!section || !list) return;

  try {
    const response = await fetch("/api/blog/posts?limit=3", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    if (data && data.ok && Array.isArray(data.posts)) blogPosts = data.posts;
  } catch (_) {
    blogPosts = [];
  }

  if (!blogPosts.length) {
    // Yayımlanmış yazı yok → bölüm ve menü bağlantısı gizli kalır.
    section.hidden = true;
    if (navBlog) navBlog.hidden = true;
    if (skillsNum) skillsNum.textContent = "03";
    if (navSkillsNum) navSkillsNum.textContent = "03";
    if (contactNum) contactNum.textContent = "04";
    if (navContactNum) navContactNum.textContent = "04";
    return;
  }

  renderBlogCards();
  section.hidden = false;
  if (navBlog) navBlog.hidden = false;
  if (skillsNum) skillsNum.textContent = "04";
  if (navSkillsNum) navSkillsNum.textContent = "04";
  if (contactNum) contactNum.textContent = "05";
  if (navContactNum) navContactNum.textContent = "05";
}

async function loadSiteContent() {
  try {
    const res = await fetch("/api/panel/site-content", { headers: { Accept: "application/json" } });
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.ok || !data.content) return;
    const { tr, en, skills, social } = data.content;

    if (tr) {
      if (tr.hero_tagline) I18N.tr["hero.tagline"] = tr.hero_tagline;
      if (tr.about_p1) I18N.tr["about.p1"] = tr.about_p1;
      if (tr.about_p2) I18N.tr["about.p2"] = tr.about_p2;
    }
    if (en) {
      if (en.hero_tagline) I18N.en["hero.tagline"] = en.hero_tagline;
      if (en.about_p1) I18N.en["about.p1"] = en.about_p1;
      if (en.about_p2) I18N.en["about.p2"] = en.about_p2;
    }

    applyLanguage(document.documentElement.lang || "tr");

    if (skills) {
      const groups = { web: skills.web, backend: skills.backend, db: skills.db, tools: skills.tools };
      for (const [key, items] of Object.entries(groups)) {
        if (!Array.isArray(items) || !items.length) continue;
        const ul = document.getElementById("skills-" + key);
        if (!ul) continue;
        ul.innerHTML = "";
        items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
      }
    }

    if (social) {
      const map = {
        "social-email":     { href: social.email ? `mailto:${social.email}` : null, text: social.email },
        "social-github":    { href: social.github,    text: social.github?.replace("https://", "") },
        "social-instagram": { href: social.instagram, text: social.instagram?.replace("https://www.", "").replace("https://", "") },
        "social-medium":    { href: social.medium,    text: social.medium?.replace("https://", "") },
        "social-linkedin":  { href: social.linkedin,  text: social.linkedin?.replace("https://www.linkedin.com/in/", "in/").replace("https://", "") },
      };
      for (const [id, { href, text }] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (href) el.href = href;
        const valEl = el.querySelector(".env-val");
        if (valEl && text) valEl.textContent = text;
      }
    }
  } catch (_) {
    /* sessizce başarısız ol — HTML'deki varsayılanlar gösterilir */
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initMobileNav();
  initReveal();
  initScrollProgress();
  initBlog();
  loadSiteContent();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
