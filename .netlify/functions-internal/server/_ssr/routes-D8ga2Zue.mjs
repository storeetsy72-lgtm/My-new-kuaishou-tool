import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as extractKuaishouUrl, t as buildFilename } from "./kuaishou-l8hMgP6u.mjs";
import { t as supabase } from "./client-C9tKYI3P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$3 } from "./router-DEeZrwVt.mjs";
import { a as Pencil, i as RotateCcw, n as Trash2, o as LoaderCircle, r as Star, s as Download, t as X } from "../_libs/lucide-react.mjs";
import { i as __exportAll } from "./server-Cm3kBC3R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-m60QZVgP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$7 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 43,
		columnNumber: 7
	}, void 0);
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D8ga2Zue.js
var _jsxFileName$6 = "/app/applet/src/components/ui/textarea.tsx";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Textarea.displayName = "Textarea";
var TRANSIENT = /failed to fetch|network|timeout|gateway|try again|could not fetch|temporarily|blocked|rate/i;
async function fetchVideoInfo(input) {
	let lastError = /* @__PURE__ */ new Error("Could not fetch video");
	for (let attempt = 1; attempt <= 2; attempt++) {
		try {
			const json = await (await fetch("/api/public/fetch-video", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: input })
			})).json();
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
function videoKey(info) {
	const src = info.videoUrl || info.photoUrl || info.title || "unknown";
	return (src.split("?")[0] ?? src).slice(0, 200);
}
/** Only reliable download trigger inside a WordPress iframe. */
async function triggerDownload(info, format, quality = "1080p") {
	const srcUrl = format === "mp3" ? info.audioUrl || info.videoUrl : format === "jpeg" ? info.photoUrl || info.thumbnail : info.videoUrl;
	if (!srcUrl) return;
	const key = videoKey(info);
	const ext = format === "mp3" ? "m4a" : format === "jpeg" ? "jpg" : "mp4";
	const name = buildFilename(format === "mp4" ? info.title ? `${info.title}-${quality}` : null : info.title, ext);
	const href = format === "mp3" ? `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(srcUrl)}&type=audio&filename=${encodeURIComponent(name)}` : `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(srcUrl)}&type=${format === "jpeg" ? "photo" : "video"}&filename=${encodeURIComponent(name)}`;
	const directUrl = format !== "mp3" ? srcUrl : void 0;
	try {
		window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } }));
	} catch {}
	if (directUrl) {
		const toastId = toast.loading("Starting download...");
		try {
			const res = await fetch(directUrl, { mode: "cors" });
			if (!res.ok) throw new Error("CORS fetch failed");
			const contentLength = res.headers.get("content-length");
			const total = contentLength ? parseInt(contentLength, 10) : 0;
			if (!res.body) throw new Error("No body");
			const reader = res.body.getReader();
			let received = 0;
			const chunks = [];
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value);
				received += value.length;
				if (total > 0) {
					const percent = Math.round(received / total * 100);
					toast.loading(`Downloading... ${percent}%`, { id: toastId });
				} else toast.loading(`Downloading... ${(received / 1024 / 1024).toFixed(1)}MB`, { id: toastId });
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
	const toastId = toast.loading("Starting download...");
	try {
		const res = await fetch(href);
		if (!res.ok) throw new Error("Fetch failed");
		const contentLength = res.headers.get("content-length");
		const total = contentLength ? parseInt(contentLength, 10) : 0;
		if (!res.body) throw new Error("No body");
		const reader = res.body.getReader();
		let received = 0;
		const chunks = [];
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			received += value.length;
			if (total > 0) {
				const percent = Math.round(received / total * 100);
				toast.loading(`Downloading... ${percent}%`, { id: toastId });
			} else toast.loading(`Downloading... ${(received / 1024 / 1024).toFixed(1)}MB`, { id: toastId });
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
var KEY = "kvd:history";
function loadHistory() {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveHistory(info) {
	const items = [{
		...info,
		timestamp: Date.now()
	}, ...loadHistory()].slice(0, 20);
	try {
		localStorage.setItem(KEY, JSON.stringify(items));
	} catch {}
	return items;
}
function clearHistory() {
	try {
		localStorage.removeItem(KEY);
	} catch {}
	return [];
}
var isValidLink = (text) => extractKuaishouUrl(text) !== null;
var MOCK_REVIEWS = [
	{
		id: "mock-1",
		rating: 5,
		comment: "Its really work very fast.",
		created_at: "2026-08-15T10:00:00Z"
	},
	{
		id: "mock-2",
		rating: 5,
		comment: "Its give video very fast.",
		created_at: "2026-08-15T09:30:00Z"
	},
	{
		id: "mock-3",
		rating: 5,
		comment: "This is good tool",
		created_at: "2026-08-15T08:15:00Z"
	},
	{
		id: "mock-4",
		rating: 5,
		comment: null,
		created_at: "2026-08-15T08:00:00Z"
	}
];
async function fetchReviewSummary() {
	const [ratingsRes, recentRes] = await Promise.all([supabase.from("public_reviews").select("rating").gte("rating", 4), supabase.from("public_reviews").select("id, rating, comment, created_at, updated_at").not("comment", "is", null).order("created_at", { ascending: false }).limit(10)]);
	const dbRatings = ratingsRes.data || [];
	const dbRecent = recentRes.data || [];
	let allRatings = [...dbRatings.map((r) => r.rating), ...MOCK_REVIEWS.map((r) => r.rating)];
	let allRecent = [...dbRecent, ...MOCK_REVIEWS];
	const mine = getMyReview();
	if (mine && mine.comment && mine.comment.trim().length > 0) {
		const existingIndex = allRecent.findIndex((r) => r.id === mine.id);
		if (existingIndex === -1) {
			allRecent = [{
				id: mine.id,
				rating: mine.rating,
				comment: mine.comment,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}, ...allRecent];
			allRatings.push(mine.rating);
		} else allRecent[existingIndex] = {
			...allRecent[existingIndex],
			rating: mine.rating,
			comment: mine.comment
		};
	}
	const count = allRatings.length;
	const average = count ? allRatings.reduce((sum, r) => sum + r, 0) / count : 0;
	const recent = allRecent.filter((r) => r.comment && r.comment.trim().length > 0).slice(0, 6);
	return {
		average: Math.round(average * 10) / 10,
		count,
		recent
	};
}
var MINE = "kvd:myReview";
function getMyReview() {
	try {
		const raw = localStorage.getItem(MINE);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setMyReview(value) {
	try {
		if (value) localStorage.setItem(MINE, JSON.stringify(value));
		else localStorage.removeItem(MINE);
	} catch {}
}
/** Creates the review, or updates it when this browser already left one. */
async function saveMyReview(rating, comment) {
	const clean = comment?.trim() ? comment.trim().slice(0, 300) : null;
	if (rating <= 3) {
		const mine = getMyReview();
		const next = {
			id: mine?.id || "mock-" + Date.now(),
			token: mine?.token || "fake-token",
			rating,
			comment: clean
		};
		setMyReview(next);
		return next;
	}
	const mine = getMyReview();
	if (mine) try {
		const { error } = await supabase.rpc("update_review_owned", {
			_id: mine.id,
			_rating: rating,
			_comment: clean,
			_owner_token: mine.token
		});
		if (error) throw new Error(error.message);
		const next = {
			...mine,
			rating,
			comment: clean
		};
		setMyReview(next);
		return next;
	} catch {
		setMyReview(null);
	}
	const token = crypto.randomUUID() + crypto.randomUUID().slice(0, 8);
	const { data, error } = await supabase.rpc("create_review", {
		_rating: rating,
		_comment: clean,
		_owner_token: token
	});
	if (error) throw new Error(error.message);
	const next = {
		id: data,
		token,
		rating,
		comment: clean
	};
	setMyReview(next);
	return next;
}
async function removeMyReview() {
	const mine = getMyReview();
	if (!mine) return;
	try {
		const { error } = await supabase.rpc("delete_review_owned", {
			_id: mine.id,
			_owner_token: mine.token
		});
		if (error) throw new Error(error.message);
	} finally {
		setMyReview(null);
	}
}
var hasReviewed = () => getMyReview() !== null;
var PROMPTED = "kvd:promptedVideos";
function promptedList() {
	try {
		const raw = localStorage.getItem(PROMPTED);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function wasPrompted(key) {
	return promptedList().includes(key);
}
function markPrompted(key) {
	try {
		const list = [key, ...promptedList().filter((k) => k !== key)].slice(0, 100);
		localStorage.setItem(PROMPTED, JSON.stringify(list));
	} catch {}
}
var SPAM_REGEX = /(?:https?:\/\/|www\.)|(?:\b|\.)(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\b|dot\s+(?:com|net|org|in|io)|\[\.\]|\(\.\)/i;
var _jsxFileName$5 = "/app/applet/src/components/ui/input.tsx";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$5,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Input.displayName = "Input";
var _jsxFileName$4 = "/app/applet/src/components/downloader/QualityCards.tsx";
var QUALITIES = [
	{
		id: "360p",
		label: "360p"
	},
	{
		id: "720p",
		label: "720p HD"
	},
	{
		id: "1080p",
		label: "1080p HD",
		badge: "Recommended"
	},
	{
		id: "4K",
		label: "4K Ultra"
	}
];
function QualityCards({ onPick }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
		className: "mb-2 text-xs font-medium text-muted-foreground",
		children: "Choose video quality"
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 14,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
		children: QUALITIES.map((q) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
			type: "button",
			onClick: () => onPick(q.id),
			className: "tap group rounded-xl border border-border bg-card p-2.5 text-left hover:border-primary hover:bg-accent active:scale-[0.99]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex min-w-0 items-center justify-between gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "truncate text-sm font-semibold text-foreground",
					children: q.label
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 24,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5 shrink-0 text-primary" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 25,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 23,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mt-0.5 block truncate text-[11px] text-muted-foreground",
				children: q.badge ?? "MP4 video"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 27,
				columnNumber: 13
			}, this)]
		}, q.id, true, {
			fileName: _jsxFileName$4,
			lineNumber: 17,
			columnNumber: 11
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 15,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 13,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/downloader/SingleTab.tsx";
var FORMATS = [
	{
		id: "mp4",
		label: "MP4",
		hint: "Video file"
	},
	{
		id: "mp3",
		label: "MP3",
		hint: "Audio only"
	},
	{
		id: "jpeg",
		label: "JPEG",
		hint: "Cover image"
	}
];
function SingleTab({ onSaved }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("mp4");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [info, setInfo] = (0, import_react.useState)(null);
	const valid = (0, import_react.useMemo)(() => isValidLink(url), [url]);
	const submit = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchVideoInfo(url);
			setInfo(data);
			saveHistory(data);
			onSaved();
			if (format !== "mp4") triggerDownload(data, format);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not fetch this video");
		} finally {
			setLoading(false);
		}
	};
	const pickQuality = (q) => {
		if (!info) return;
		triggerDownload(info, "mp4", q);
	};
	const reset = () => {
		setUrl("");
		setInfo(null);
		setError(null);
		setFormat("mp4");
	};
	if (info) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-card p-2.5",
				children: [info.thumbnail ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: info.thumbnail,
					alt: info.title || "Video cover",
					className: "size-12 shrink-0 rounded-lg object-cover"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 68,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-12 shrink-0 rounded-lg bg-muted" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 74,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "truncate text-sm font-semibold text-foreground",
						children: info.title || "Kuaishou video"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 77,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: info.author || "Unknown"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 80,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 76,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 66,
				columnNumber: 9
			}, this),
			format === "mp4" && /* @__PURE__ */ (void 0)(QualityCards, { onPick: pickQuality }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 83,
				columnNumber: 30
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				onClick: reset,
				className: "w-full gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 85,
					columnNumber: 11
				}, this), " Download another video"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 84,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 65,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				value: url,
				onChange: (e) => setUrl(e.target.value),
				placeholder: "https://kwai.com/... or https://kuaishou.com/...",
				inputMode: "url",
				autoComplete: "off",
				autoCapitalize: "none",
				spellCheck: false,
				className: "h-14 rounded-xl px-4 text-base sm:h-12 sm:text-sm"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 93,
				columnNumber: 7
			}, this),
			valid && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground",
				children: "Choose download format"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 105,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "grid grid-cols-3 gap-2",
				children: FORMATS.map((f) => /* @__PURE__ */ (void 0)("button", {
					type: "button",
					onClick: () => setFormat(f.id),
					"aria-pressed": format === f.id,
					className: `tap rounded-xl border p-2.5 text-left ${format === f.id ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/50"}`,
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "block truncate text-sm font-semibold text-foreground",
						children: f.label
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 119,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "block truncate text-[11px] text-muted-foreground",
						children: f.hint
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 122,
						columnNumber: 17
					}, this)]
				}, f.id, true, {
					fileName: _jsxFileName$3,
					lineNumber: 108,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 106,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 104,
				columnNumber: 9
			}, this),
			error && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm text-destructive",
				children: error
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 128,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: submit,
				disabled: !valid || loading,
				className: "h-14 w-full gap-2 rounded-xl text-base font-bold shadow-md sm:h-12",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-5 animate-spin" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 134,
					columnNumber: 20
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-5" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 134,
					columnNumber: 66
				}, this), "Get Download Link"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 129,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 92,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/reviews/Stars.tsx";
function Stars({ value, size = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-0.5",
		"aria-hidden": true,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, {
			style: {
				width: size,
				height: size
			},
			className: i <= Math.round(value) ? "fill-primary text-primary" : "fill-muted text-muted-foreground/40"
		}, i, false, {
			fileName: _jsxFileName$2,
			lineNumber: 7,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 5,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/reviews/ReviewsSection.tsx";
var APP_NAME = "Kuaishou Video Downloader";
var APP_URL = "https://kuaivideosdownloader.com/";
function buildJsonLd(summary) {
	const reviews = summary.recent.filter((r) => r.comment && r.comment.trim().length > 0).map((r) => ({
		"@type": "Review",
		name: `${r.rating}-star review of ${APP_NAME}`,
		reviewBody: (r.comment ?? "").slice(0, 300),
		datePublished: (r.updated_at ?? r.created_at).slice(0, 10),
		author: {
			"@type": "Person",
			name: "Verified user"
		},
		reviewRating: {
			"@type": "Rating",
			ratingValue: String(r.rating),
			bestRating: "5",
			worstRating: "1"
		}
	}));
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: APP_NAME,
		url: APP_URL,
		description: "Free online tool to download Kuaishou and Kwai videos without watermark in HD & 4K quality. No login or app installation required.",
		applicationCategory: "MultimediaApplication",
		operatingSystem: "Android, iOS, Windows, macOS, Web",
		browserRequirements: "Requires a modern web browser",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock"
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: summary.average.toFixed(1),
			ratingCount: summary.count,
			reviewCount: summary.count,
			bestRating: "5",
			worstRating: "1"
		},
		...reviews.length ? { review: reviews } : {}
	};
}
function ReviewsSection({ summary, onChanged }) {
	const [mine, setMine] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(0);
	const [comment, setComment] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMine(getMyReview());
	}, [summary]);
	const startEdit = () => {
		setRating(mine?.rating ?? 0);
		setComment(mine?.comment ?? "");
		setEditing(true);
	};
	const save = async () => {
		if (!rating || busy) return;
		if (SPAM_REGEX.test(comment)) {
			toast.error("Links are not allowed in reviews.");
			return;
		}
		setBusy(true);
		try {
			const next = await saveMyReview(rating, comment);
			setMine(next);
			setEditing(false);
			onChanged?.();
		} catch (e) {
			toast.error(e.message || "Could not save review");
		} finally {
			setBusy(false);
		}
	};
	const remove = async () => {
		if (busy) return;
		setBusy(true);
		try {
			await removeMyReview();
			setMine(null);
			setEditing(false);
			onChanged?.();
		} finally {
			setBusy(false);
		}
	};
	if (summary.count === 0 && !mine) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		"aria-label": "User reviews",
		className: "mt-4",
		children: [summary.count > 0 && /* @__PURE__ */ (void 0)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(buildJsonLd(summary)) }
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 127,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "glass-card rounded-2xl p-3 sm:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-center gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-2xl font-bold text-foreground",
							children: summary.average.toFixed(1)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 134,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stars, {
							value: summary.average,
							size: 18
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 135,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								summary.count,
								" ",
								summary.count === 1 ? "rating" : "ratings",
								" from users"
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 136,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 133,
					columnNumber: 9
				}, this),
				mine && !editing && /* @__PURE__ */ (void 0)("div", {
					className: "mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card p-2.5",
					children: [
						/* @__PURE__ */ (void 0)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Your rating"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 143,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)(Stars, {
							value: mine.rating,
							size: 14
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 144,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7 gap-1 px-2 text-xs",
							onClick: startEdit,
							children: [/* @__PURE__ */ (void 0)(Pencil, { className: "size-3" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 151,
								columnNumber: 15
							}, this), " Edit"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 145,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 gap-1 px-2 text-xs text-muted-foreground",
							onClick: remove,
							disabled: busy,
							children: [busy ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-3 animate-spin" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 160,
								columnNumber: 23
							}, this) : /* @__PURE__ */ (void 0)(Trash2, { className: "size-3" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 160,
								columnNumber: 69
							}, this), "Remove"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 153,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 142,
					columnNumber: 11
				}, this),
				editing && /* @__PURE__ */ (void 0)("div", {
					className: "mt-3 rounded-xl border border-border bg-card p-3",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "text-xs font-semibold text-foreground",
								children: "Update your rating"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 169,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								"aria-label": "Cancel",
								className: "tap rounded-md p-1 text-muted-foreground hover:text-foreground",
								onClick: () => setEditing(false),
								children: /* @__PURE__ */ (void 0)(X, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 176,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 170,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 168,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-2 flex justify-center gap-1",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((i) => /* @__PURE__ */ (void 0)("button", {
								type: "button",
								"aria-label": `${i} star${i > 1 ? "s" : ""}`,
								onClick: () => setRating(i),
								className: "tap rounded-md p-0.5",
								children: /* @__PURE__ */ (void 0)("svg", {
									viewBox: "0 0 24 24",
									className: `size-7 ${i <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/40"}`,
									children: /* @__PURE__ */ (void 0)("path", { d: "M12 17.3 6.2 20.6l1.1-6.5-4.7-4.6 6.5-1L12 2.5l2.9 6 6.5 1-4.7 4.6 1.1 6.5z" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 192,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 188,
									columnNumber: 19
								}, this)
							}, i, false, {
								fileName: _jsxFileName$1,
								lineNumber: 181,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 179,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)(Textarea, {
							value: comment,
							onChange: (e) => setComment(e.target.value),
							rows: 3,
							maxLength: 300,
							placeholder: "Update your comment (optional)",
							className: "mt-2 resize-none rounded-xl text-sm"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 197,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								className: "flex-1",
								onClick: remove,
								disabled: busy,
								children: "Remove rating"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 206,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)(Button, {
								className: "flex-1",
								onClick: save,
								disabled: !rating || busy,
								children: busy ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 210,
									columnNumber: 25
								}, this) : "Save"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 209,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 205,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 167,
					columnNumber: 11
				}, this),
				summary.recent.length > 0 && /* @__PURE__ */ (void 0)("div", {
					className: "mt-4 overflow-hidden rounded-xl mask-horizontal",
					children: /* @__PURE__ */ (void 0)("div", {
						className: "flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]",
						children: [...summary.recent, ...summary.recent].map((r, i) => /* @__PURE__ */ (void 0)("div", {
							className: "w-64 flex-shrink-0 rounded-xl border border-border bg-card p-3 shadow-sm whitespace-normal text-left",
							children: [
								/* @__PURE__ */ (void 0)(Stars, {
									value: r.rating,
									size: 13
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 224,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "mt-1.5 text-sm text-foreground line-clamp-3",
									children: r.comment
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 225,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: (r.updated_at ?? r.created_at).slice(0, 10)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 226,
									columnNumber: 19
								}, this)
							]
						}, r.id + "-" + i, true, {
							fileName: _jsxFileName$1,
							lineNumber: 220,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 218,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 217,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 132,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 125,
		columnNumber: 5
	}, this);
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Index });
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var BatchTab = (0, import_react.lazy)(() => import("./BatchTab-Bv5dzave.mjs").then((m) => ({ default: m.BatchTab })));
var HistoryTab = (0, import_react.lazy)(() => import("./HistoryTab-49DF2zZM.mjs").then((m) => ({ default: m.HistoryTab })));
var ReviewPrompt = (0, import_react.lazy)(() => import("./ReviewPrompt-CSuZkrt2.mjs").then((m) => ({ default: m.ReviewPrompt })));
var TABS = [
	{
		id: "single",
		label: "Single Download",
		short: "Single"
	},
	{
		id: "batch",
		label: "Batch Download",
		short: "Batch"
	},
	{
		id: "history",
		label: "History",
		short: "History"
	}
];
function Index() {
	const [tab, setTab] = (0, import_react.useState)("single");
	const [history, setHistory] = (0, import_react.useState)([]);
	const initialSummary = Route$3.useLoaderData({ select: (d) => d.summary });
	const [summary, setSummary] = (0, import_react.useState)(initialSummary);
	const [askReview, setAskReview] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(() => setHistory(loadHistory()), []);
	(0, import_react.useEffect)(() => {
		if (window === window.parent) return;
		const observer = new ResizeObserver((entries) => {
			const mainEl = document.getElementById("kvd-main-content");
			if (mainEl) {
				const height = mainEl.getBoundingClientRect().height;
				window.parent.postMessage({
					type: "kvd:resize",
					height
				}, "*");
			}
		});
		const mainEl = document.getElementById("kvd-main-content");
		if (mainEl) {
			observer.observe(mainEl);
			window.parent.postMessage({
				type: "kvd:resize",
				height: mainEl.getBoundingClientRect().height
			}, "*");
		}
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const reloadReviews = (0, import_react.useCallback)(() => {
		fetchReviewSummary().then(setSummary);
	}, []);
	(0, import_react.useEffect)(() => {
		reloadReviews();
	}, [reloadReviews]);
	(0, import_react.useEffect)(() => {
		if (window !== window.parent && summary && summary.count > 0) try {
			const schema = buildJsonLd(summary);
			window.parent.postMessage({
				type: "kvd:schema",
				schema
			}, "*");
		} catch (e) {}
	}, [summary]);
	(0, import_react.useEffect)(() => {
		const onDownload = (e) => {
			if (hasReviewed()) return;
			const key = e.detail?.key ?? "unknown";
			if (wasPrompted(key)) return;
			markPrompted(key);
			window.setTimeout(() => setAskReview(true), 1200);
		};
		window.addEventListener("kvd:download", onDownload);
		return () => window.removeEventListener("kvd:download", onDownload);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		id: "kvd-main-content",
		className: "w-full bg-transparent px-3 py-4 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto w-full max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "glass-card rounded-2xl p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					role: "tablist",
					"aria-label": "Downloader modes",
					className: "grid w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1",
					children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === t.id,
						onClick: () => setTab(t.id),
						className: `tap min-w-0 truncate rounded-lg px-2 py-2 text-[13px] font-semibold transition-colors sm:text-sm ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "sm:hidden",
							children: t.short
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "hidden sm:inline",
							children: t.label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 17
						}, this)]
					}, t.id, true, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 28
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-3",
					children: [tab === "single" && /* @__PURE__ */ (void 0)(SingleTab, { onSaved: refresh }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 34
					}, this), tab !== "single" && /* @__PURE__ */ (void 0)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (void 0)("div", {
							className: "h-32 animate-pulse rounded-xl bg-muted",
							"aria-hidden": true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 54
						}, this),
						children: tab === "batch" ? /* @__PURE__ */ (void 0)(BatchTab, { onSaved: refresh }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 36
						}, this) : /* @__PURE__ */ (void 0)(HistoryTab, {
							items: history,
							onClear: () => setHistory(clearHistory())
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 69
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 34
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ReviewsSection, {
				summary,
				onChanged: reloadReviews
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 105,
			columnNumber: 7
		}, this), askReview && /* @__PURE__ */ (void 0)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (void 0)(ReviewPrompt, {
				onClose: () => setAskReview(false),
				onSubmitted: reloadReviews
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 126,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 125,
			columnNumber: 21
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 104,
		columnNumber: 10
	}, this);
}
//#endregion
export { fetchVideoInfo as a, Textarea as c, saveMyReview as i, Button as l, SPAM_REGEX as n, saveHistory as o, getMyReview as r, triggerDownload as s, routes_exports as t };
