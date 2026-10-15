// Slug üretimi — Türkçe karakterleri sadeleştirir.

const TR_MAP = {
  ç: "c", Ç: "c",
  ğ: "g", Ğ: "g",
  ı: "i", İ: "i",
  ö: "o", Ö: "o",
  ş: "s", Ş: "s",
  ü: "u", Ü: "u",
  â: "a", Â: "a",
  î: "i", Î: "i",
  û: "u", Û: "u",
};

export function slugify(input) {
  let text = String(input || "");
  text = text.replace(/[çÇğĞıİöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_MAP[ch] || ch);
  text = text.toLowerCase();
  text = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  text = text.replace(/-{2,}/g, "-");
  return text.slice(0, 80).replace(/-+$/g, "") || "yazi";
}

/** Verilen slug zaten varsa sonuna -2, -3 ... ekler. */
export function uniqueSlug(base, taken) {
  const set = new Set(taken);
  let slug = base;
  let i = 2;
  while (set.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}
