import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as extractKuaishouUrl } from "./kuaishou-l8hMgP6u.mjs";
import { o as LoaderCircle, s as Download } from "../_libs/lucide-react.mjs";
import { a as fetchVideoInfo, c as Textarea, l as Button, o as saveHistory, s as triggerDownload } from "./routes-D8ga2Zue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BatchTab-Bv5dzave.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/downloader/BatchTab.tsx";
function BatchTab({ onSaved }) {
	const [text, setText] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const start = async () => {
		const urls = text.split(/\r?\n/).map((line) => extractKuaishouUrl(line)).filter((u) => Boolean(u)).slice(0, 10);
		if (urls.length === 0) return;
		const initial = urls.map((url) => ({
			url,
			status: "pending"
		}));
		setRows(initial);
		setRunning(true);
		for (let i = 0; i < urls.length; i++) {
			setRows((prev) => prev.map((r, idx) => idx === i ? {
				...r,
				status: "fetching"
			} : r));
			try {
				const info = await fetchVideoInfo(urls[i]);
				saveHistory(info);
				onSaved();
				setRows((prev) => prev.map((r, idx) => idx === i ? {
					...r,
					status: "ready",
					info
				} : r));
			} catch (e) {
				setRows((prev) => prev.map((r, idx) => idx === i ? {
					...r,
					status: "failed",
					error: e instanceof Error ? e.message : "Failed"
				} : r));
			}
		}
		setRunning(false);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
				value: text,
				onChange: (e) => setText(e.target.value),
				placeholder: "Paste up to 10 Kuaishou or Kwai links, one per line",
				rows: 4,
				className: "resize-none rounded-xl text-sm"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 54,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: start,
				disabled: running || text.trim().length === 0,
				className: "w-full gap-2",
				children: [running ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 20
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 66
				}, this), running ? "Processing" : "Process links"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			rows.length > 0 && /* @__PURE__ */ (void 0)("ul", {
				className: "max-h-56 space-y-2 overflow-y-auto pr-1",
				children: rows.map((row, i) => /* @__PURE__ */ (void 0)("li", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-2",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (void 0)("p", {
							className: "truncate text-sm text-foreground",
							children: row.info?.title || row.url
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "truncate text-[11px] text-muted-foreground capitalize",
							children: row.error ?? row.status
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Button, {
						size: "sm",
						className: "h-8 gap-1",
						disabled: row.status !== "ready",
						onClick: () => {
							if (row.info) triggerDownload(row.info, "mp4", "1080p");
						},
						children: row.status === "fetching" ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-3.5 animate-spin" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 19
						}, this) : /* @__PURE__ */ (void 0)(Download, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 15
					}, this)]
				}, `${row.url}-${i}`, true, {
					fileName: _jsxFileName,
					lineNumber: 72,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 70,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 53,
		columnNumber: 5
	}, this);
}
//#endregion
export { BatchTab };
