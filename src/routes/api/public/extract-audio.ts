import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/extract-audio")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const target = url.searchParams.get("url");
        const filename = url.searchParams.get("filename") || "audio.m4a";

        if (!target) return new Response("Missing url", { status: 400 });

        try {
          const response = await fetch(target, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              Referer: target.includes("kwai") ? "https://www.kwai.com/" : "https://www.kuaishou.com/",
            },
          });

          if (!response.ok) {
            return new Response("Failed to fetch media", { status: response.status });
          }

          const headers = new Headers(response.headers);
          headers.set("Access-Control-Allow-Origin", "*");
          
          const encodedFilename = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, "%2A");
          headers.set(
            "Content-Disposition",
            `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`
          );

          return new Response(response.body, {
            status: response.status,
            headers,
          });
        } catch (e: any) {
          return new Response("Error: " + e.message, { status: 500 });
        }
      },
    },
  },
});
