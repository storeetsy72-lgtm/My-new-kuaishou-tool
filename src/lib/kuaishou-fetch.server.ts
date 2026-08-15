import { extractKuaishouUrl, type VideoInfo } from "./kuaishou";

const UAS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
];
let uaIndex = 0;
const nextUA = () => UAS[uaIndex++ % UAS.length]!;

const BLOCKED =
  /^(localhost|::1|metadata\.google\.internal)$|^\[?(fe80|fc00|fd00)|^10\.|^127\.|^0\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^2(2[4-9]|[3-5]\d)\./i;

/** Reject non-http(s) schemes and private / link-local / metadata hosts. */
export function assertSafeUrl(raw: string): URL {
  const u = new URL(raw);
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Unsupported URL scheme");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (BLOCKED.test(host)) throw new Error("Blocked host");
  return u;
}

export async function safeFetch(
  url: string,
  init: RequestInit = {},
  maxHops = 5,
  timeoutMs = 8000,
): Promise<Response> {
  let current = assertSafeUrl(url).toString();
  for (let hop = 0; hop <= maxHops; hop++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(current, {
        ...init,
        redirect: "manual",
        signal: ctrl.signal,
        headers: {
          "User-Agent": nextUA(),
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          ...(init.headers as Record<string, string> | undefined),
        },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return res;
        current = assertSafeUrl(new URL(loc, current).toString()).toString();
        continue;
      }
      return res;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("Too many redirects");
}

const decode = (s: string) =>
  s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");

function firstMatch(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const v = decode(m[1]).trim();
      if (v) return v;
    }
  }
  return null;
}

function extractVideoId(url: string): string | null {
  const m = url.match(/(?:short-video|photo|video|fw\/photo)\/([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? null;
}

function candidates(url: string): string[] {
  const list: string[] = [url];
  try {
    const u = new URL(url);
    const stripped = `${u.origin}${u.pathname}`;
    if (stripped !== url) list.push(stripped);
    if (/(^|\.)kuaishou\.com$/i.test(u.hostname) && !u.hostname.startsWith("m.")) {
      list.push(`https://m.kuaishou.com${u.pathname}`);
    }
  } catch {
    /* ignore */
  }
  const id = extractVideoId(url);
  if (id) {
    list.push(`https://v.m.chenzhongtech.com/fw/photo/${id}`);
    list.push(`https://v.kuaishou.com/fw/photo/${id}`);
  }
  return [...new Set(list)];
}

const AUDIO_ONLY = /ksAudio|audio_only|video_only|audioOnly|videoOnly|\/audio\/|mediaType=audio/i;

/** Kwai CDNs 403 a kuaishou.com referer and vice versa. */
export function refererFor(target: string): string {
  try {
    return /kwai/i.test(new URL(target).hostname)
      ? "https://www.kwai.com/"
      : "https://www.kuaishou.com/";
  } catch {
    return "https://www.kuaishou.com/";
  }
}

function pickVideoUrl(htmlRaw: string): string | null {
  // Adaptive manifests contain separate audio-only / video-only tracks -> silent files.
  const html = htmlRaw.replace(/"adaptationSet"\s*:\s*\[[\s\S]*?\]\s*(,|})/g, "$1");
  const ordered: RegExp[] = [
    /"contentUrl"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/,
    /"srcNoMark"\s*:\s*"([^"]+)"/,
    /"photoUrl"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/,
    /"mainMvUrls"\s*:\s*\[\s*{[^}]*"url"\s*:\s*"([^"]+)"/,
    /"playUrl"\s*:\s*"([^"]+)"/,
    /"videoUrl"\s*:\s*"([^"]+)"/,
    /"mp4Url"\s*:\s*"([^"]+)"/,
  ];
  for (const re of ordered) {
    const v = firstMatch(html, [re]);
    if (v && /^https?:/.test(v) && !AUDIO_ONLY.test(v)) return v;
  }
  const generic = html.match(/"(?:url|src)"\s*:\s*"(https?:\\?\/\\?\/[^"]+\.mp4[^"]*)"/g) ?? [];
  for (const g of generic) {
    const v = decode(g.replace(/^.*?:\s*"/, "").replace(/"$/, ""));
    if (!AUDIO_ONLY.test(v)) return v;
  }
  const hls = firstMatch(html, [/"(https?:\\?\/\\?\/[^"]+\.m3u8[^"]*)"/]);
  return hls && !AUDIO_ONLY.test(hls) ? hls : null;
}

function parse(html: string): VideoInfo | null {
  const title =
    firstMatch(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /"caption"\s*:\s*"([^"]+)"/,
      /<title[^>]*>([^<]+)<\/title>/i,
      /"desc"\s*:\s*"([^"]+)"/,
    ]) ?? "";
  const author =
    firstMatch(html, [
      /"userName"\s*:\s*"([^"]+)"/,
      /"nickName"\s*:\s*"([^"]+)"/,
      /"author"\s*:\s*"([^"]+)"/,
    ]) ?? "";
  const thumbnail =
    firstMatch(html, [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /"coverUrl"\s*:\s*"([^"]+)"/,
      /"poster"\s*:\s*"([^"]+)"/,
    ]) ?? "";
  const audioUrl =
    firstMatch(html, [
      /"audioUrl"\s*:\s*"([^"]+)"/,
      /"soundUrl"\s*:\s*"([^"]+)"/,
      /"musicUrl"\s*:\s*"([^"]+)"/,
      /"(https?:\\?\/\\?\/[^"]+\.(?:mp3|m4a|aac)[^"]*)"/,
    ]) ?? "";
  const photoUrl =
    thumbnail ||
    firstMatch(html, [
      /"thumbnailUrl"\s*:\s*\[\s*"(https?:[^"]+)"/,
      /"(https?:\\?\/\\?\/[^"]*(?:kwaicdn|yximgs|kwai\.net|kuaishou)[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/,
    ]) ||
    "";
  const videoUrl = pickVideoUrl(html);
  if (!videoUrl && !photoUrl) return null;
  return {
    title: title.replace(/\s*[-|]\s*快手.*$/, "").trim(),
    author,
    thumbnail,
    videoUrl: videoUrl ?? "",
    audioUrl,
    photoUrl,
    quality: /1080|2160|4k/i.test(videoUrl ?? "") ? "HD" : "SD",
  };
}

async function attempt(candidate: string): Promise<VideoInfo> {
  const res = await safeFetch(candidate, {}, 5, 6000);
  if (res.status === 403 || res.status === 429) throw new Error("Temporarily blocked, please try again");
  const html = await res.text();
  if (!html || html.length < 1500) throw new Error("Empty page");
  const info = parse(html);
  if (!info) throw new Error("Could not fetch video info");
  return info;
}

export async function fetchVideoInfo(input: string): Promise<VideoInfo> {
  const url = extractKuaishouUrl(input);
  if (!url) throw new Error("No valid Kuaishou or Kwai link found");
  const list = candidates(url);
  // Query every candidate in parallel and return the first one that has a video,
  // without waiting for the slower mirrors to finish.
  const fallbacks: VideoInfo[] = [];
  let lastError = "Could not fetch video info";
  const all = list.map((c) => attempt(c));
  const first = await new Promise<VideoInfo | null>((resolve) => {
    let pending = all.length;
    for (const p of all) {
      p.then(
        (info) => {
          if (info.videoUrl) resolve(info);
          else fallbacks.push(info);
        },
        (e: unknown) => {
          if (e instanceof Error) lastError = e.message;
        },
      ).finally(() => {
        if (--pending === 0) resolve(null);
      });
    }
  });
  if (first) return first;
  if (fallbacks[0]) return fallbacks[0];
  throw new Error(lastError);
}
