const HOSTS = ["kuaishou.com", "kwai.com", "kuaishou-cdn.com", "chenzhongtech.com"];

function hostAllowed(hostname: string) {
  const h = hostname.toLowerCase();
  return HOSTS.some((d) => h === d || h.endsWith("." + d));
}

/**
 * Scans arbitrary pasted text (share captions with Chinese characters, etc.)
 * and returns the first Kuaishou / Kwai URL found.
 */
export function extractKuaishouUrl(text: string): string | null {
  if (!text) return null;
  const matches = text.match(/https?:\/\/[^\s<>"'，。、）)】\]]+/gi);
  if (!matches) return null;
  for (const raw of matches) {
    const candidate = raw.replace(/[.,;:!?"'）)】\]}]+$/g, "");
    try {
      const u = new URL(candidate);
      if ((u.protocol === "http:" || u.protocol === "https:") && hostAllowed(u.hostname)) {
        return u.toString();
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

export const BRAND = "kuaivideosdownloader.com";

export function sanitizeTitle(title?: string | null): string {
  return (title ?? "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .trim()
    .replace(/\s/g, "-");
}

export function buildFilename(title: string | null | undefined, ext: "mp4" | "m4a" | "jpg") {
  const base = sanitizeTitle(title);
  if (!base) {
    const fallback =
      ext === "mp4" ? "kuaishou-video" : ext === "m4a" ? "kuaishou-audio" : "kuaishou-photo";
    return `${BRAND}-${fallback}.${ext}`;
  }
  return `${BRAND}-${base}.${ext}`;
}

/** RFC 5987 safe Content-Disposition value (raw CJK in headers throws ByteString errors). */
export function contentDisposition(filename: string, fallbackExt: string) {
  const ascii = `${BRAND}-download.${fallbackExt}`;
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export type VideoInfo = {
  title: string;
  author: string;
  thumbnail: string;
  videoUrl: string;
  audioUrl: string;
  photoUrl: string;
  quality: string;
};
