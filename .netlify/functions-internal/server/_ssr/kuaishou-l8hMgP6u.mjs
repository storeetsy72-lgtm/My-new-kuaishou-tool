//#region node_modules/.nitro/vite/services/ssr/assets/kuaishou-l8hMgP6u.js
var HOSTS = [
	"kuaishou.com",
	"kwai.com",
	"kuaishou-cdn.com",
	"chenzhongtech.com"
];
function hostAllowed(hostname) {
	const h = hostname.toLowerCase();
	return HOSTS.some((d) => h === d || h.endsWith("." + d));
}
/**
* Scans arbitrary pasted text (share captions with Chinese characters, etc.)
* and returns the first Kuaishou / Kwai URL found.
*/
function extractKuaishouUrl(text) {
	if (!text) return null;
	const matches = text.match(/https?:\/\/[^\s<>"'，。、）)】\]]+/gi);
	if (!matches) return null;
	for (const raw of matches) {
		const candidate = raw.replace(/[.,;:!?"'）)】\]}]+$/g, "");
		try {
			const u = new URL(candidate);
			if ((u.protocol === "http:" || u.protocol === "https:") && hostAllowed(u.hostname)) return u.toString();
		} catch {}
	}
	return null;
}
var BRAND = "kuaivideosdownloader.com";
function sanitizeTitle(title) {
	return (title ?? "").replace(/[\\/:*?"<>|]/g, "").replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80).trim().replace(/\s/g, "-");
}
function buildFilename(title, ext) {
	const base = sanitizeTitle(title);
	if (!base) return `${BRAND}-${ext === "mp4" ? "kuaishou-video" : ext === "m4a" ? "kuaishou-audio" : "kuaishou-photo"}.${ext}`;
	return `${BRAND}-${base}.${ext}`;
}
//#endregion
export { extractKuaishouUrl as n, buildFilename as t };
