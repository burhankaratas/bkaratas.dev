// GitHub Contents API yardımcıları — panel içeriği ÖZEL içerik deposuna bu katmanla işler.
//
// Gerekli ortam değişkeni:
//   GITHUB_TOKEN  → içerik deposuna yazma yetkili (fine-grained) kişisel erişim token'ı
// Opsiyonel:
//   GITHUB_CONTENT_REPO    (varsayılan: burhankaratas/bkaratas-content)
//   GITHUB_CONTENT_BRANCH  (varsayılan: main)
//   GITHUB_API_BASE        (test için; varsayılan: https://api.github.com)
import { contentRepo, contentBranch } from "./content.js";

export function githubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function repoSlug() {
  return contentRepo();
}

export function repoBranch() {
  return contentBranch();
}

function apiBase() {
  return process.env.GITHUB_API_BASE || "https://api.github.com";
}

function headers(extra = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN tanımlı değil. Panelden içerik kaydetmek için Vercel ortam değişkenlerine ekleyin."
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "bkaratas.dev-panel",
    ...extra,
  };
}

function contentsUrl(filePath) {
  return `${apiBase()}/repos/${repoSlug()}/contents/${filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/** Dosyayı okur; yoksa null döndürür. { sha, content } */
export async function getFile(filePath) {
  const response = await fetch(`${contentsUrl(filePath)}?ref=${repoBranch()}`, {
    headers: headers(),
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub okuma hatası (${response.status})`);
  }
  const data = await response.json();
  const content = Buffer.from(data.content || "", "base64").toString("utf8");
  return { sha: data.sha, content };
}

/** Metin dosyası yazar/günceller. */
export async function putTextFile(filePath, content, message) {
  const body = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: repoBranch(),
  };
  const existing = await getFile(filePath);
  if (existing) body.sha = existing.sha;

  const response = await fetch(contentsUrl(filePath), {
    method: "PUT",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub yazma hatası (${response.status}): ${detail.slice(0, 200)}`);
  }
  return response.json();
}

/** İkili (binary) dosya yazar/günceller. contentBase64 zaten base64 olmalı. */
export async function putBinaryFile(filePath, contentBase64, message) {
  const body = {
    message,
    content: contentBase64,
    branch: repoBranch(),
  };
  const existing = await getFile(filePath);
  if (existing) body.sha = existing.sha;

  const response = await fetch(contentsUrl(filePath), {
    method: "PUT",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub görsel yazma hatası (${response.status}): ${detail.slice(0, 200)}`);
  }
  return response.json();
}

/** Dosyayı siler. Yoksa false döndürür. */
export async function deleteFile(filePath, message) {
  const existing = await getFile(filePath);
  if (!existing) return false;

  const response = await fetch(contentsUrl(filePath), {
    method: "DELETE",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      message,
      sha: existing.sha,
      branch: repoBranch(),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub silme hatası (${response.status}): ${detail.slice(0, 200)}`);
  }
  return true;
}
