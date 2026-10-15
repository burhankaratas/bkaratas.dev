// Yazı HTML'ini güvenli hâle getirir (XSS koruması).
// Yalnızca yazı gövdelerini izin verilen etiket/özniteliklerle sınırlar.
import sanitizeHtml from "sanitize-html";

const QUILL_CLASSES = [
  "ql-align-center",
  "ql-align-right",
  "ql-align-justify",
  "ql-indent-1", "ql-indent-2", "ql-indent-3", "ql-indent-4",
  "ql-indent-5", "ql-indent-6", "ql-indent-7", "ql-indent-8",
  "ql-size-small", "ql-size-large", "ql-size-huge",
  "ql-syntax",
];

export function sanitizePostHtml(html) {
  return sanitizeHtml(String(html || ""), {
    allowedTags: [
      "p", "br", "hr", "span", "div",
      "h1", "h2", "h3", "h4",
      "strong", "b", "em", "i", "u", "s", "del", "mark", "sub", "sup",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      span: ["class"],
      p: ["class"],
      div: ["class"],
      li: ["class"],
      h1: ["class"], h2: ["class"], h3: ["class"], h4: ["class"],
      blockquote: ["class"],
      pre: ["class"],
      code: ["class"],
      th: ["align", "colspan", "rowspan"],
      td: ["align", "colspan", "rowspan"],
    },
    allowedClasses: {
      "*": QUILL_CLASSES,
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener" }),
    },
    disallowedTagsMode: "discard",
  });
}

/** Frontmatter/kısa metin alanlarından HTML kaçışı. */
export function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
