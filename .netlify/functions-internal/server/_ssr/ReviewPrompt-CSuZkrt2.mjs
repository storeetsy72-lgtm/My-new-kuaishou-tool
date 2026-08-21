import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as LoaderCircle, r as Star, t as X } from "../_libs/lucide-react.mjs";
import { c as Textarea, i as saveMyReview, l as Button, n as SPAM_REGEX, r as getMyReview } from "./routes-D8ga2Zue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReviewPrompt-CSuZkrt2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/reviews/ReviewPrompt.tsx";
function ReviewPrompt({ onClose, onSubmitted }) {
	const existing = typeof window !== "undefined" ? getMyReview() : null;
	const [rating, setRating] = (0, import_react.useState)(existing?.rating ?? 0);
	const [hover, setHover] = (0, import_react.useState)(0);
	const [comment, setComment] = (0, import_react.useState)(existing?.comment ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const pick = async (value) => {
		setRating(value);
		if (saving || done) return;
		setSaving(true);
		try {
			await saveMyReview(value, comment);
			setDone(true);
			onSubmitted();
		} catch {} finally {
			setSaving(false);
		}
	};
	const sendComment = async () => {
		if (!comment.trim() || saving) return;
		if (SPAM_REGEX.test(comment)) {
			toast.error("Links are not allowed in reviews.");
			return;
		}
		setSaving(true);
		try {
			await saveMyReview(rating || 5, comment);
			onSubmitted();
			onClose();
		} catch (e) {
			toast.error(e.message || "Could not save review");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Rate this downloader",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "glass-card w-full max-w-sm rounded-2xl bg-card p-5 text-center",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close",
					className: "tap float-right -mr-1 -mt-1 rounded-lg p-1 text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-base font-bold text-foreground",
					children: done ? "Thanks for your rating!" : "How was your download?"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: done ? "Add a short comment (optional)" : "Tap a star to rate this tool"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-3 flex justify-center gap-1",
					children: [
						1,
						2,
						3,
						4,
						5
					].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						"aria-label": `${i} star${i > 1 ? "s" : ""}`,
						disabled: saving,
						onMouseEnter: () => setHover(i),
						onMouseLeave: () => setHover(0),
						onClick: () => pick(i),
						className: "tap rounded-md p-1 hover:scale-110",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { className: `size-8 ${i <= (hover || rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground/40"}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 15
						}, this)
					}, i, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 9
				}, this),
				saving && !done && /* @__PURE__ */ (void 0)("p", {
					className: "mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-3 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 13
					}, this), " Saving"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 113,
					columnNumber: 11
				}, this),
				done && /* @__PURE__ */ (void 0)("div", {
					className: "mt-3 space-y-2",
					children: [/* @__PURE__ */ (void 0)(Textarea, {
						value: comment,
						onChange: (e) => setComment(e.target.value),
						rows: 3,
						maxLength: 300,
						placeholder: "Tell others what you think (optional)",
						className: "resize-none rounded-xl text-sm"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 119,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: onClose,
							children: "No thanks"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Button, {
							className: "flex-1",
							disabled: !comment.trim() || saving,
							onClick: sendComment,
							children: "Send"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 127,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 72,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 65,
		columnNumber: 5
	}, this);
}
//#endregion
export { ReviewPrompt };
