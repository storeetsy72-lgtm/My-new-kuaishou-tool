import { toast } from "sonner";
import { buildFilename, extractKuaishouUrl, type VideoInfo } from "./kuaishou";

export type Quality = "360p" | "720p" | "1080p" | "4K";
export type Format = "mp4" | "mp3" | "jpeg";

const TRANSIENT =
  /failed to fetch|network|timeout|gateway|try again|could not fetch|temporarily|blocked|rate/i;

export async function fetchVideoInfo(input: string): Promise<VideoInfo> {
  let lastError = new Error("Could not fetch video");
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch("/api/public/v2-fetch-video", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-kvd-client": "v1" },
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
export async function triggerDownload(info: VideoInfo, format: Format, quality: Quality = "1080p") {
  const srcUrl =
    format === "mp3"
      ? info.audioUrl || info.videoUrl
      : format === "jpeg"
        ? info.photoUrl || info.thumbnail
        : info.videoUrl;
  if (!srcUrl) return;

  const key = videoKey(info);
  const ext = format === "mp3" ? "m4a" : format === "jpeg" ? "jpg" : "mp4";
  const name = buildFilename(
    format === "mp4" ? (info.title ? `${info.title}-${quality}` : null) : info.title,
    ext,
  );

  const href =
    format === "mp3"
      ? `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(srcUrl)}&type=audio&filename=${encodeURIComponent(name)}`
      : `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(srcUrl)}&type=${format === "jpeg" ? "photo" : "video"}&filename=${encodeURIComponent(name)}`;

  const directUrl = format !== "mp3" ? srcUrl : undefined;

  try {
    setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } }));
      } catch { /* ignore */ }
    }, 100);
  } catch {
    /* ignore */
  }

  // If we have a directUrl, try fetching it as a blob with progress.
  if (directUrl) {
    const toastId = toast.loading("Starting download...");
    // Fire the event right before the direct blob fetch freezes the UI
    setTimeout(() => { try { window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } })); } catch {} }, 10);
    try {
      const res = await fetch(directUrl, { mode: "cors" });
      if (!res.ok) throw new Error("CORS fetch failed");

      const contentLength = res.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!res.body) throw new Error("No body");

      const reader = res.body.getReader();
      let received = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          const percent = Math.round((received / total) * 100);
          toast.loading(`Downloading... ${percent}%`, { id: toastId });
        } else {
          toast.loading(`Downloading... ${(received / 1024 / 1024).toFixed(1)}MB`, { id: toastId });
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      toast.success("Download complete!", { id: toastId });
      return;
    } catch (e) {
      console.warn("Direct blob download failed, falling back to proxy", e);
      toast.dismiss(toastId);
    }
  }

  // Fallback / Proxy behavior (including audio)
  const toastId = toast.loading("Starting download...");
  try {
    // Ensure the event fires immediately before the proxy download hangs the thread
    setTimeout(() => { try { window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } })); } catch {} }, 10);
    
    const res = await fetch(href);
    if (!res.ok) throw new Error("Fetch failed");

    const contentLength = res.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!res.body) throw new Error("No body");

    const reader = res.body.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total > 0) {
        const percent = Math.round((received / total) * 100);
        toast.loading(`Downloading... ${percent}%`, { id: toastId });
      } else {
        toast.loading(`Downloading... ${(received / 1024 / 1024).toFixed(1)}MB`, { id: toastId });
      }
    }

    const blob = new Blob(chunks);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name; // proxy sets its own content disposition but for Blob we need download attr
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    toast.success("Download complete!", { id: toastId });
    return;
  } catch (e) {
    console.warn("Proxy blob download failed, falling back to navigation", e);
    toast.dismiss(toastId);
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    return `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(src)}&type=audio&filename=${encodeURIComponent(buildFilename(info.title, "m4a"))}`;
  }
  if (format === "jpeg") {
    const src = info.photoUrl || info.thumbnail;
    if (!src) return null;
    return `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(src)}&type=photo&filename=${encodeURIComponent(buildFilename(info.title, "jpg"))}`;
  }
  if (!info.videoUrl) return null;
  const name = buildFilename(info.title ? `${info.title}-${quality}` : null, "mp4");
  return `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(info.videoUrl)}&type=video&filename=${encodeURIComponent(name)}`;
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
