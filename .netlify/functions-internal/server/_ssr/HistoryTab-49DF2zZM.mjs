import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Trash2, s as Download } from "../_libs/lucide-react.mjs";
import { l as Button, s as triggerDownload } from "./routes-D8ga2Zue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HistoryTab-49DF2zZM.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/downloader/HistoryTab.tsx";
function HistoryTab({ items, onClear }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
		className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
		children: "No downloads yet."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 8,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs font-medium text-muted-foreground",
				children: "Recent downloads"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 16,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onClear,
				className: "h-7 gap-1 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 18,
					columnNumber: 11
				}, this), " Clear all"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 17,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
			className: "max-h-64 space-y-2 overflow-y-auto pr-1",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
				className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-2",
				children: [
					item.thumbnail ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: item.thumbnail,
						alt: item.title || "Video cover",
						loading: "lazy",
						className: "size-10 shrink-0 rounded-lg object-cover"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 28,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-10 shrink-0 rounded-lg bg-muted" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-sm font-medium text-foreground",
							children: item.title || "Kuaishou video"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: item.author || "Unknown"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						className: "h-8 gap-1",
						onClick: () => {
							triggerDownload(item, "mp4", "1080p");
						},
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 13
					}, this)
				]
			}, item.timestamp, true, {
				fileName: _jsxFileName,
				lineNumber: 23,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
//#endregion
export { HistoryTab };
