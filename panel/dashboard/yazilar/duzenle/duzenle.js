/* bkaratas.dev — panel: yazı editörü (Quill tabanlı zengin metin) */
import {
  ensurePanelSession,
  wireLogout,
  panelFetch,
  escapeHtml,
  formatDateTR,
  showFlash,
} from "/panel/panel-common.js";

const params = new URLSearchParams(location.search);
let currentSlug = (params.get("slug") || "").trim();
let coverValue = "";
let dirty = false;

const els = {
  title: document.getElementById("title"),
  editorTitle: document.getElementById("editor-title"),
  viewLink: document.getElementById("view-link"),
  deleteBtn: document.getElementById("delete-btn"),
  saveBtn: document.getElementById("save-btn"),
  flash: document.getElementById("flash"),
  status: document.getElementById("status"),
  category: document.getElementById("category"),
  tags: document.getElementById("tags"),
  excerpt: document.getElementById("excerpt"),
  slugHint: document.getElementById("slug-hint"),
  timeHint: document.getElementById("time-hint"),
  coverBox: document.getElementById("cover-box"),
  coverPick: document.getElementById("cover-pick"),
  coverInput: document.getElementById("cover-input"),
  imageInput: document.getElementById("image-input"),
};

/* ------------------------------- Quill ---------------------------------- */
const quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Yazmaya başla…",
  modules: {
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => els.imageInput.click(),
      },
    },
  },
});

/* --------------------------- görsel yükleme ----------------------------- */
async function uploadDataUrl(dataUrl, filename = "gorsel.png") {
  return panelFetch("/api/panel/uploads", {
    method: "POST",
    body: JSON.stringify({ filename, dataUrl }),
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });
}

// Araç çubuğundaki görsel düğmesi → dosya seç → yükle → editöre ekle
els.imageInput.addEventListener("change", async () => {
  const file = els.imageInput.files && els.imageInput.files[0];
  if (!file) return;
  const range = quill.getSelection(true) || { index: quill.getLength() };
  try {
    const dataUrl = await fileToDataUrl(file);
    const result = await uploadDataUrl(dataUrl, file.name);
    quill.insertEmbed(range.index, "image", result.previewUrl, "user");
    quill.setSelection(range.index + 1, 0);
    markDirty();
    showFlash(els.flash, "Görsel yüklendi. Yayına alındıktan sonra kalıcı adrese bağlanır.", "ok");
  } catch (error) {
    showFlash(els.flash, `Görsel yüklenemedi: ${error.message}`, "error");
  } finally {
    els.imageInput.value = "";
  }
});

// Yapıştırılan/sürüklenen data:image görsellerini otomatik yükle
let processingImages = false;
async function processInlineImages() {
  if (processingImages) return;
  const images = [...quill.root.querySelectorAll('img[src^="data:"]')];
  if (!images.length) return;
  processingImages = true;
  try {
    for (const img of images) {
      try {
        const result = await uploadDataUrl(img.getAttribute("src"), "yapistirilan-gorsel.png");
        img.setAttribute("src", result.previewUrl);
      } catch (error) {
        showFlash(els.flash, `Yapıştırılan görsel yüklenemedi: ${error.message}`, "error");
      }
    }
    markDirty();
  } finally {
    processingImages = false;
  }
}
quill.on("text-change", () => {
  markDirty();
  setTimeout(processInlineImages, 250);
});

/* ------------------------------ kapak ----------------------------------- */
function renderCover() {
  if (coverValue) {
    els.coverBox.innerHTML =
      `<img src="${escapeHtml(coverValue)}" alt="Kapak önizleme">` +
      '<button class="cover-clear" id="cover-clear" type="button">kaldır</button>';
  } else {
    els.coverBox.innerHTML = '<span class="cover-empty">Görsel seçilmedi</span>';
  }
}

els.coverPick.addEventListener("click", () => els.coverInput.click());

els.coverInput.addEventListener("change", async () => {
  const file = els.coverInput.files && els.coverInput.files[0];
  if (!file) return;
  els.coverPick.disabled = true;
  els.coverPick.textContent = "Yükleniyor…";
  try {
    const dataUrl = await fileToDataUrl(file);
    const result = await uploadDataUrl(dataUrl, file.name);
    coverValue = result.previewUrl;
    renderCover();
    markDirty();
    showFlash(els.flash, "Kapak yüklendi.", "ok");
  } catch (error) {
    showFlash(els.flash, `Kapak yüklenemedi: ${error.message}`, "error");
  } finally {
    els.coverPick.disabled = false;
    els.coverPick.textContent = "Görsel Seç";
    els.coverInput.value = "";
  }
});

els.coverBox.addEventListener("click", (event) => {
  if (event.target && event.target.id === "cover-clear") {
    coverValue = "";
    renderCover();
    markDirty();
  }
});

/* ------------------------------ durum ----------------------------------- */
function markDirty() {
  dirty = true;
}

function setEditorTitle() {
  els.editorTitle.textContent = currentSlug ? `düzenle: /${currentSlug}` : "yeni yazı";
}

function updateActions(post) {
  if (!currentSlug) {
    els.viewLink.hidden = true;
    els.deleteBtn.hidden = true;
    return;
  }
  els.deleteBtn.hidden = false;
  if (!post) {
    els.viewLink.hidden = true;
    return;
  }
  els.viewLink.hidden = false;
  if (post.status === "published") {
    els.viewLink.textContent = "Görüntüle";
    els.viewLink.href = `/blog/${encodeURIComponent(currentSlug)}`;
  } else {
    // Taslak: oturum açıkken görünen önizleme.
    els.viewLink.textContent = "Önizle";
    els.viewLink.href = `/blog/${encodeURIComponent(currentSlug)}`;
  }
}

/* ------------------------------ yükleme --------------------------------- */
async function loadPost() {
  try {
    const data = await panelFetch(`/api/panel/posts?slug=${encodeURIComponent(currentSlug)}`);
    const post = data.post;
    els.title.value = post.title || "";
    els.status.value = post.status === "published" ? "published" : "draft";
    els.category.value = post.category || "";
    els.tags.value = (post.tags || []).join(", ");
    els.excerpt.value = post.excerpt || "";
    coverValue = post.cover || "";
    renderCover();
    quill.clipboard.dangerouslyPasteHTML(post.body || "");
    els.slugHint.textContent = `Slug: /${post.slug}`;
    els.timeHint.textContent =
      `Oluşturuldu: ${formatDateTR(post.createdAt)} · Güncellendi: ${formatDateTR(post.updatedAt)}`;
    updateActions(post);
    dirty = false;
  } catch (error) {
    showFlash(els.flash, `Yazı yüklenemedi: ${error.message}`, "error");
  }
}

/* ------------------------------- kaydet --------------------------------- */
async function save() {
  const title = els.title.value.trim();
  if (!title) {
    showFlash(els.flash, "Başlık gerekli.", "error");
    els.title.focus();
    return;
  }
  els.saveBtn.disabled = true;
  els.saveBtn.textContent = "Kaydediliyor…";
  try {
    const payload = {
      slug: currentSlug,
      title,
      category: els.category.value.trim(),
      tags: els.tags.value,
      excerpt: els.excerpt.value.trim(),
      cover: coverValue,
      status: els.status.value === "published" ? "published" : "draft",
      body: quill.root.innerHTML,
    };
    const data = await panelFetch("/api/panel/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    currentSlug = data.slug;
    dirty = false;
    history.replaceState(null, "", `/panel/dashboard/yazilar/duzenle/?slug=${encodeURIComponent(currentSlug)}`);
    els.slugHint.textContent = `Slug: /${currentSlug}`;
    setEditorTitle();
    updateActions({ status: data.status });
    showFlash(
      els.flash,
      data.status === "published"
        ? "Yayınlandı. Site ~1 dakika içinde güncellenecek."
        : "Taslak kaydedildi. Yayına almak için durumu “Yayında” yapıp kaydet.",
      "ok"
    );
  } catch (error) {
    showFlash(els.flash, `Kaydedilemedi: ${error.message}`, "error");
  } finally {
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = "Kaydet";
  }
}

async function removePost() {
  if (!currentSlug) return;
  const title = els.title.value.trim() || currentSlug;
  if (!confirm(`“${title}” silinsin mi?\n\nBu işlem GitHub deposundan da siler ve geri alınamaz.`)) return;
  els.deleteBtn.disabled = true;
  try {
    await panelFetch(`/api/panel/posts?slug=${encodeURIComponent(currentSlug)}`, { method: "DELETE" });
    dirty = false;
    location.href = "/panel/dashboard/yazilar/";
  } catch (error) {
    showFlash(els.flash, `Silinemedi: ${error.message}`, "error");
    els.deleteBtn.disabled = false;
  }
}

/* ------------------------------ olaylar --------------------------------- */
els.saveBtn.addEventListener("click", save);
els.deleteBtn.addEventListener("click", removePost);

els.title.addEventListener("input", () => {
  markDirty();
  els.title.value = els.title.value; // no-op; başlık değişince slug sabit kalır
});

// Ctrl/Cmd + S ile kaydet
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    save();
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

/* -------------------------------- init ---------------------------------- */
async function init() {
  const user = await ensurePanelSession();
  if (!user) return;
  wireLogout();
  setEditorTitle();
  renderCover();
  updateActions(null);

  if (currentSlug) {
    await loadPost();
  } else {
    els.status.value = "draft";
    els.slugHint.textContent = "Slug: yeni kayıtta başlıktan üretilir.";
  }
}

init();
