import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as createRootRouteWithContext, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as __exportAll } from "./server-Cm3kBC3R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DEeZrwVt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-B_bnapA4.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 26,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 55,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 47,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 46,
		columnNumber: 5
	}, this);
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [{ charSet: "utf-8" }, {
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		}],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 100,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", { dangerouslySetInnerHTML: { __html: `(function(){
  if (window.parent === window) return;
  document.documentElement.classList.add('is-embedded');
  
  var last = 0;
  function send(){
    var root = document.getElementById('root') || document.body;
    var h = Math.ceil(root.getBoundingClientRect().height);
    if (!h || Math.abs(h - last) < 2) return;
    last = h;
    window.parent.postMessage({ type: 'lovable:resize', height: h }, '*');
  }
  function init(){
    var root = document.getElementById('root') || document.body;
    if (window.ResizeObserver) new ResizeObserver(send).observe(root);
    new MutationObserver(send).observe(root, { childList: true, subtree: true, attributes: true });
    setInterval(send, 800);
    send();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();` } }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 130,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 102,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 98,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 142,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, { position: "top-center" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 143,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 140,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter = () => import("./routes-D8ga2Zue.mjs").then((n) => n.t);
var Route$3 = createFileRoute("/")({
	loader: () => {
		return { summary: {
			average: 0,
			count: 0,
			recent: []
		} };
	},
	head: () => ({ meta: [
		{ title: "Kuaishou & Kwai Video Downloader - Fast HD, MP3 & Photo Saver" },
		{
			name: "description",
			content: "Download Kuaishou and Kwai videos without watermark in HD, extract MP3 audio or save cover photos. Paste a link and download instantly."
		},
		{
			property: "og:title",
			content: "Kuaishou & Kwai Video Downloader"
		},
		{
			property: "og:description",
			content: "Save Kuaishou and Kwai videos in HD, MP3 audio or JPEG covers in seconds."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$2 = createFileRoute("/api/public/download-proxy")({ server: { handlers: { GET: async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const target = params.get("url");
	const type = params.get("type") ?? "video";
	const filename = params.get("filename") ?? "kuaivideosdownloader.com-kuaishou-video.mp4";
	if (!target) return new Response("Missing url", { status: 400 });
	const cfUrl = `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(target)}&type=${type}&filename=${encodeURIComponent(filename)}`;
	return new Response(null, {
		status: 302,
		headers: {
			"Location": cfUrl,
			"Access-Control-Allow-Origin": "*"
		}
	});
} } } });
var Route$1 = createFileRoute("/api/public/extract-audio")({ server: { handlers: { GET: async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const target = params.get("url");
	const filename = params.get("filename") ?? "kuaivideosdownloader.com-kuaishou-audio.m4a";
	if (!target) return new Response("Missing url", { status: 400 });
	const cfUrl = `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(target)}&type=audio&filename=${encodeURIComponent(filename)}`;
	return new Response(null, {
		status: 302,
		headers: {
			"Location": cfUrl,
			"Access-Control-Allow-Origin": "*"
		}
	});
} } } });
var cors = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS"
};
var Route = createFileRoute("/api/public/fetch-video")({ server: { handlers: {
	OPTIONS: async () => new Response(null, {
		status: 204,
		headers: cors
	}),
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			if (!body?.url || typeof body.url !== "string" || body.url.length > 4e3) return Response.json({
				success: false,
				error: "Invalid url"
			}, {
				status: 400,
				headers: cors
			});
			const { fetchVideoInfo } = await import("./kuaishou-fetch.server-BoLfgmo9.mjs");
			const data = await fetchVideoInfo(body.url);
			return Response.json({
				success: true,
				data
			}, { headers: cors });
		} catch (e) {
			return Response.json({
				success: false,
				error: e instanceof Error ? e.message : "Could not fetch video"
			}, {
				status: 200,
				headers: cors
			});
		}
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	ApiPublicDownloadProxyRoute: Route$2.update({
		id: "/api/public/download-proxy",
		path: "/api/public/download-proxy",
		getParentRoute: () => Route$4
	}),
	ApiPublicExtractAudioRoute: Route$1.update({
		id: "/api/public/extract-audio",
		path: "/api/public/extract-audio",
		getParentRoute: () => Route$4
	}),
	ApiPublicFetchVideoRoute: Route.update({
		id: "/api/public/fetch-video",
		path: "/api/public/fetch-video",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$3 as n, router_exports as t };
