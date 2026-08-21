import { n as extractKuaishouUrl } from "./kuaishou-l8hMgP6u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kuaishou-fetch.server-BoLfgmo9.js
var UAS = [
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
	"Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
	"Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36"
];
var uaIndex = 0;
var nextUA = () => UAS[uaIndex++ % UAS.length];
var BLOCKED = /^(localhost|::1|metadata\.google\.internal)$|^\[?(fe80|fc00|fd00)|^10\.|^127\.|^0\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^2(2[4-9]|[3-5]\d)\./i;
/** Reject non-http(s) schemes and private / link-local / metadata hosts. */
function assertSafeUrl(raw) {
	const u = new URL(raw);
	if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Unsupported URL scheme");
	const host = u.hostname.replace(/^\[|\]$/g, "");
	if (BLOCKED.test(host)) throw new Error("Blocked host");
	return u;
}
async function safeFetch(url, init = {}, maxHops = 5, timeoutMs = 8e3) {
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
					...init.headers
				}
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
var decode = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\\//g, "/").replace(/&amp;/g, "&");
function firstMatch(html, patterns) {
	for (const re of patterns) {
		const m = html.match(re);
		if (m?.[1]) {
			const v = decode(m[1]).trim();
			if (v) return v;
		}
	}
	return null;
}
function extractVideoId(url) {
	return url.match(/(?:short-video|photo|video|fw\/photo)\/([A-Za-z0-9_-]{6,})/)?.[1] ?? null;
}
function candidates(url) {
	const list = [url];
	try {
		const u = new URL(url);
		const stripped = `${u.origin}${u.pathname}`;
		if (stripped !== url) list.push(stripped);
		if (/(^|\.)kuaishou\.com$/i.test(u.hostname) && !u.hostname.startsWith("m.")) list.push(`https://m.kuaishou.com${u.pathname}`);
	} catch {}
	const id = extractVideoId(url);
	if (id) {
		list.push(`https://v.m.chenzhongtech.com/fw/photo/${id}`);
		list.push(`https://v.kuaishou.com/fw/photo/${id}`);
	}
	return [...new Set(list)];
}
var AUDIO_ONLY = /ksAudio|audio_only|video_only|audioOnly|videoOnly|\/audio\/|mediaType=audio/i;
function pickVideoUrl(htmlRaw) {
	const html = htmlRaw.replace(/"adaptationSet"\s*:\s*\[[\s\S]*?\]\s*(,|})/g, "$1");
	for (const re of [
		/"contentUrl"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/,
		/"srcNoMark"\s*:\s*"([^"]+)"/,
		/"photoUrl"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/,
		/"mainMvUrls"\s*:\s*\[\s*{[^}]*"url"\s*:\s*"([^"]+)"/,
		/"playUrl"\s*:\s*"([^"]+)"/,
		/"videoUrl"\s*:\s*"([^"]+)"/,
		/"mp4Url"\s*:\s*"([^"]+)"/
	]) {
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
function parse(html) {
	const title = firstMatch(html, [
		/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
		/"caption"\s*:\s*"([^"]+)"/,
		/<title[^>]*>([^<]+)<\/title>/i,
		/"desc"\s*:\s*"([^"]+)"/
	]) ?? "";
	const author = firstMatch(html, [
		/"userName"\s*:\s*"([^"]+)"/,
		/"nickName"\s*:\s*"([^"]+)"/,
		/"author"\s*:\s*"([^"]+)"/
	]) ?? "";
	const thumbnail = firstMatch(html, [
		/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
		/"coverUrl"\s*:\s*"([^"]+)"/,
		/"poster"\s*:\s*"([^"]+)"/
	]) ?? "";
	const audioUrl = firstMatch(html, [
		/"audioUrl"\s*:\s*"([^"]+)"/,
		/"soundUrl"\s*:\s*"([^"]+)"/,
		/"musicUrl"\s*:\s*"([^"]+)"/,
		/"(https?:\\?\/\\?\/[^"]+\.(?:mp3|m4a|aac)[^"]*)"/
	]) ?? "";
	const photoUrl = thumbnail || firstMatch(html, [/"thumbnailUrl"\s*:\s*\[\s*"(https?:[^"]+)"/, /"(https?:\\?\/\\?\/[^"]*(?:kwaicdn|yximgs|kwai\.net|kuaishou)[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/]) || "";
	const videoUrl = pickVideoUrl(html);
	if (!videoUrl && !photoUrl) return null;
	return {
		title: title.replace(/\s*[-|]\s*快手.*$/, "").trim(),
		author,
		thumbnail,
		videoUrl: videoUrl ?? "",
		audioUrl,
		photoUrl,
		quality: /1080|2160|4k/i.test(videoUrl ?? "") ? "HD" : "SD"
	};
}
async function attempt(candidate) {
	const res = await safeFetch(candidate, {}, 5, 6e3);
	if (res.status === 403 || res.status === 429) throw new Error("Temporarily blocked, please try again");
	const html = await res.text();
	if (!html || html.length < 1500) throw new Error("Empty page");
	const info = parse(html);
	if (!info) throw new Error("Could not fetch video info");
	return info;
}
async function fetchVideoInfo(input) {
	const url = extractKuaishouUrl(input);
	if (!url) throw new Error("No valid Kuaishou or Kwai link found");
	const list = candidates(url);
	const fallbacks = [];
	let lastError = "Could not fetch video info";
	const all = list.map((c) => attempt(c));
	const first = await new Promise((resolve) => {
		let pending = all.length;
		for (const p of all) p.then((info) => {
			if (info.videoUrl) resolve(info);
			else fallbacks.push(info);
		}, (e) => {
			if (e instanceof Error) lastError = e.message;
		}).finally(() => {
			if (--pending === 0) resolve(null);
		});
	});
	if (first) return first;
	if (fallbacks[0]) return fallbacks[0];
	throw new Error(lastError);
}
//#endregion
export { fetchVideoInfo };
