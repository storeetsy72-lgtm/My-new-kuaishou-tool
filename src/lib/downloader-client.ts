import { buildFilename, extractKuaishouUrl, type VideoInfo } from "./kuaishou";

export type Quality = "360p" | "720p" | "1080p" | "4K";
export type Format = "mp4" | "mp3" | "jpeg";

const TRANSIENT =
  /failed to fetch|network|timeout|gateway|try again|could not fetch|temporarily|blocked|rate/i;

export async function fetchVideoInfo(input: string): Promise<VideoInfo> {
  let lastError = new Error("Could not fetch video");
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch("/api/public/fetch-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });
      const json = (await res.json()) as { success: boolean; data?: VideoInfo; error?: string };
      if (json.success && json.data) return json.data;
      lastError = new Error(json.error ?? "Could not fetch video");
      if (!TRANSIENT.test(lastError.message)) throw lastError;
    } catch (e) {
      lastError = e instanceof Error ? e : lastError;
      if (!TRANSIENT.test(lastError.message)) throw lastError;
    }
    await new Promise((r) => setTimeout(r, 250 * attempt));
  }
  throw lastError;
}

/** Stable per-video key used to avoid re-asking for a review on the same video. */
export function videoKey(info: Pick<VideoInfo, "videoUrl" | "photoUrl" | "title">): string {
  const src = info.videoUrl || info.photoUrl || info.title || "unknown";
  return (src.split("?")[0] ?? src).slice(0, 200);
}

/** Only reliable download trigger inside a WordPress iframe. */
export function triggerDownload(href: string, key?: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  try {
    window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key: key ?? href } }));
  } catch {
    /* ignore */
  }
}

export function downloadHref(
  info: VideoInfo,
  format: Format,
  quality: Quality = "1080p",
): string | null {
  if (format === "mp3") {
    const src = info.audioUrl || info.videoUrl;
    if (!src) return null;
    return `/api/public/extract-audio?url=${encodeURIComponent(src)}&filename=${encodeURIComponent(buildFilename(info.title, "m4a"))}`;
  }
  if (format === "jpeg") {
    const src = info.photoUrl || info.thumbnail;
    if (!src) return null;
    return `/api/public/download-proxy?url=${encodeURIComponent(src)}&type=photo&filename=${encodeURIComponent(buildFilename(info.title, "jpg"))}`;
  }
  if (!info.videoUrl) return null;
  const name = buildFilename(info.title ? `${info.title}-${quality}` : null, "mp4");
  return `/api/public/download-proxy?url=${encodeURIComponent(info.videoUrl)}&type=video&filename=${encodeURIComponent(name)}`;
}

export type HistoryItem = VideoInfo & { timestamp: number };
const KEY = "kvd:history";

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(info: VideoInfo): HistoryItem[] {
  const items = [{ ...info, timestamp: Date.now() }, ...loadHistory()].slice(0, 20);
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  return items;
}

export function clearHistory(): HistoryItem[] {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return [];
}

export const isValidLink = (text: string) => extractKuaishouUrl(text) !== null;
