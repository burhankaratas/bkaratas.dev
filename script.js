/* bkaratas.dev — i18n (TR/EN), mobile nav, reveal on scroll */

const I18N = {
  tr: {
    "meta.title": "Mahmut Burhan Karataş — Yazılım Geliştirici",
    "meta.description":
      "Mahmut Burhan Karataş — temiz kod, otomasyon ve faydalı ürünler kuran yazılım geliştirici. Sehven Dergi ve Hesaplarız.org projeleri.",

    "a11y.skip": "İçeriğe geç",

    "nav.menu": "Menü",
    "nav.about": "Hakkımda",
    "nav.skills": "Yetenekler",
    "nav.projects": "Projeler",
    "nav.contact": "İletişim",

    "hero.role": "Yazılım Geliştirici",
    "hero.tagline":
      "Temiz kod, otomasyon ve gerçekten işe yarayan ürünler kuran bir geliştirici. Fikri alıp çalışan web sitelerine ve araçlara dönüştürüyorum.",
    "hero.ctaProjects": "Projeleri Gör",
    "hero.ctaContact": "İletişime Geç",

    "about.label": "Hakkımda",
    "about.title": "Kısaca ben",
    "about.p1":
      "Merhaba, ben Burhan. Backend tarafında Python ve Flask ile ölçeklenebilir sistemler kurmayı; arayüz tarafında ise sade, hızlı ve erişilebilir web deneyimleri geliştirmeyi seviyorum.",
    "about.p2":
      "Sehven Dergi ve Hesaplarız.org gibi projelerimi uçtan uca tasarlayıp hayata geçiriyorum: fikirden arayüze, veritabanından yayına kadar her aşamasında çalışıyorum.",
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
    "projects.intro": "Tasarlayıp yayına aldığım kendi projelerim.",
    "projects.visit": "Siteyi Aç",
    "projects.p1.desc":
      "Bağımsız bir dijital edebiyat ve felsefe dergisi. Yazılar, sayılar, yazar profilleri ve editör paneliyle uçtan uca çalışan, monokrom bir yayın estetiğine sahip yayın platformu.",
    "projects.p2.desc":
      "30'dan fazla aracı tek sitede toplayan ücretsiz hesaplama koleksiyonu: finans, sağlık, tarih, ölçü ve daha fazlası. Tüm hesaplamalar tamamen tarayıcıda, kayıt gerekmeden çalışır.",

    "contact.label": "İletişim",
    "contact.title": "Birlikte çalışalım",
    "contact.desc": "Proje fikriniz, iş birliği ya da sadece merhaba demek için — her zaman açığım.",

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
    "nav.contact": "Contact",

    "hero.role": "Software Developer",
    "hero.tagline":
      "A developer who builds clean code, automation and products that actually work. I take an idea and turn it into live websites and tools.",
    "hero.ctaProjects": "View Projects",
    "hero.ctaContact": "Get in Touch",

    "about.label": "About",
    "about.title": "A little about me",
    "about.p1":
      "Hi, I'm Burhan. I enjoy building scalable backend systems with Python and Flask, and crafting simple, fast and accessible experiences on the frontend.",
    "about.p2":
      "I design and ship my own projects end to end — from idea to interface, database to deployment — such as Sehven Magazine and Hesaplarız.org.",
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
    "projects.intro": "My own products, designed and shipped by me.",
    "projects.visit": "Visit Site",
    "projects.p1.desc":
      "An independent digital literature and philosophy magazine. An end-to-end publishing platform with articles, issues, author profiles and an editor panel, with a monochrome publication aesthetic.",
    "projects.p2.desc":
      "A free collection of 30+ calculators in one place: finance, health, dates, measurements and more. Every calculation runs entirely in your browser — no sign-up required.",

    "contact.label": "Contact",
    "contact.title": "Let's work together",
    "contact.desc": "Whether it's a project idea, a collaboration or just saying hello — I'm all ears.",

    "footer.note": "Built with vanilla HTML · CSS · JavaScript.",
  },
};

const HTML_META = {
  tr: {
    title: "Mahmut Burhan Karataş — Yazılım Geliştirici",
    description:
      "Mahmut Burhan Karataş — temiz kod, otomasyon ve faydalı ürünler kuran yazılım geliştirici. Sehven Dergi ve Hesaplarız.org projeleri.",
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
  document.title = meta.title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", meta.description);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", meta.ogLocale);

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initMobileNav();
  initReveal();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
