import { ensurePanelSession, wireLogout, panelFetch, showFlash } from "/panel/panel-common.js";

const DEFAULTS = {
  tr: {
    hero_tagline: "Temiz kod, otomasyon ve gerçekten işe yarayan ürünler kuran bir geliştirici. Fikri alıp çalışan web sitelerine ve araçlara dönüştürüyorum.",
    about_p1: "Merhaba, ben Burhan. Backend tarafında Python ve Flask ile ölçeklenebilir sistemler kurmayı; arayüz tarafında ise sade, hızlı ve erişilebilir web deneyimleri geliştirmeyi seviyorum.",
    about_p2: "Sehven Dergi ve Hesaplarız.org gibi projelerimi uçtan uca tasarlayıp hayata geçiriyorum: fikirden arayüze, veritabanından yayına kadar her aşamasında çalışıyorum.",
  },
  en: {
    hero_tagline: "A developer who builds clean code, automation and products that actually work. I take an idea and turn it into live websites and tools.",
    about_p1: "Hi, I'm Burhan. I enjoy building scalable backend systems with Python and Flask, and crafting simple, fast and accessible experiences on the frontend.",
    about_p2: "I design and ship my own projects end to end — from idea to interface, database to deployment — such as Sehven Magazine and Hesaplarız.org.",
  },
  skills: {
    web: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Node.js", "Electron", "Bootstrap"],
    backend: ["Python", "Flask", "REST API", "JWT", "Jinja2", "Flask-Mail", "python-dotenv", "Requests"],
    db: ["MySQL", "SQLite"],
    tools: ["Git / GitHub", "Vercel", "Cloudflare", "Figma", "Vite", "Linux"],
  },
  social: {
    email: "burhankaratas771@gmail.com",
    github: "https://github.com/burhankaratas",
    instagram: "https://www.instagram.com/burhannkaratas/",
    medium: "https://medium.com/@burhankaratas771",
    linkedin: "https://www.linkedin.com/in/karatasburhan/",
  },
};

function chipListToString(arr) {
  return Array.isArray(arr) ? arr.join(", ") : (arr || "");
}

function stringToChipList(str) {
  return String(str || "").split(",").map(s => s.trim()).filter(Boolean);
}

function populateForm(content) {
  const c = content || {};
  const tr = { ...DEFAULTS.tr, ...(c.tr || {}) };
  const en = { ...DEFAULTS.en, ...(c.en || {}) };
  const skills = { ...DEFAULTS.skills, ...(c.skills || {}) };
  const social = { ...DEFAULTS.social, ...(c.social || {}) };

  document.getElementById("tr-tagline").value = tr.hero_tagline || "";
  document.getElementById("tr-about-p1").value = tr.about_p1 || "";
  document.getElementById("tr-about-p2").value = tr.about_p2 || "";

  document.getElementById("en-tagline").value = en.hero_tagline || "";
  document.getElementById("en-about-p1").value = en.about_p1 || "";
  document.getElementById("en-about-p2").value = en.about_p2 || "";

  document.getElementById("skills-web").value = chipListToString(skills.web);
  document.getElementById("skills-backend").value = chipListToString(skills.backend);
  document.getElementById("skills-db").value = chipListToString(skills.db);
  document.getElementById("skills-tools").value = chipListToString(skills.tools);

  document.getElementById("social-email").value = social.email || "";
  document.getElementById("social-github").value = social.github || "";
  document.getElementById("social-instagram").value = social.instagram || "";
  document.getElementById("social-medium").value = social.medium || "";
  document.getElementById("social-linkedin").value = social.linkedin || "";
}

function collectForm() {
  return {
    tr: {
      hero_tagline: document.getElementById("tr-tagline").value.trim(),
      about_p1: document.getElementById("tr-about-p1").value.trim(),
      about_p2: document.getElementById("tr-about-p2").value.trim(),
    },
    en: {
      hero_tagline: document.getElementById("en-tagline").value.trim(),
      about_p1: document.getElementById("en-about-p1").value.trim(),
      about_p2: document.getElementById("en-about-p2").value.trim(),
    },
    skills: {
      web: stringToChipList(document.getElementById("skills-web").value),
      backend: stringToChipList(document.getElementById("skills-backend").value),
      db: stringToChipList(document.getElementById("skills-db").value),
      tools: stringToChipList(document.getElementById("skills-tools").value),
    },
    social: {
      email: document.getElementById("social-email").value.trim(),
      github: document.getElementById("social-github").value.trim(),
      instagram: document.getElementById("social-instagram").value.trim(),
      medium: document.getElementById("social-medium").value.trim(),
      linkedin: document.getElementById("social-linkedin").value.trim(),
    },
  };
}

async function init() {
  await ensurePanelSession();
  wireLogout();

  const flash = document.getElementById("flash");
  const saveBtn = document.getElementById("save-btn");

  try {
    const data = await panelFetch("/api/panel/site-content");
    populateForm(data.content);
  } catch (err) {
    populateForm(null);
    showFlash(flash, `İçerik yüklenemedi: ${err.message}. Varsayılan değerler gösteriliyor.`, "error");
  }

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Kaydediliyor…";
    try {
      await panelFetch("/api/panel/site-content", {
        method: "POST",
        body: JSON.stringify({ content: collectForm() }),
      });
      showFlash(flash, "İçerikler kaydedildi. Site ~1 dakika içinde güncellenir.", "ok");
    } catch (err) {
      showFlash(flash, `Kaydetme başarısız: ${err.message}`, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Kaydet";
    }
  });
}

init();
