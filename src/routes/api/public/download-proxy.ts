import { createFileRoute } from "@tanstack/react-router";
import { contentDisposition } from "@/lib/kuaishou";

const TYPES: Record<string, string> = {
  video: "video/mp4",
  audio: "audio/mp4",
  photo: "image/jpeg",
};

export const Route = createFileRoute("/api/public/download-proxy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const target = params.get("url");
        const type = params.get("type") ?? "video";
        const filename = params.get("filename") ?? "kuaivideosdownloader.com-kuaishou-video.mp4";
        if (!target) return new Response("Missing url", { status: 400 });
        try {
          const { safeFetch, refererFor } = await import("@/lib/kuaishou-fetch.server");
          const range = request.headers.get("range");
          const upstream = await safeFetch(
            target,
            {
              headers: {
                Referer: refererFor(target),
                ...(range ? { Range: range } : {}),
              },
            },
            5,
            20000,
          );
          if (!upstream.ok || !upstream.body) {
            return new Response("Upstream error", { status: 502 });
          }
          const ext = type === "audio" ? "m4a" : type === "photo" ? "jpg" : "mp4";
          const headers = new Headers({
            "Content-Type": TYPES[type] ?? "application/octet-stream",
            "Content-Disposition": contentDisposition(filename, ext),
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
          });
          const len = upstream.headers.get("content-length");
          if (len) headers.set("Content-Length", len);
          const cr = upstream.headers.get("content-range");
          if (cr) headers.set("Content-Range", cr);
          headers.set("Accept-Ranges", "bytes");
          return new Response(upstream.body, {
            status: upstream.status === 206 ? 206 : 200,
            headers,
          });
        } catch (e) {
          return new Response(e instanceof Error ? e.message : "Download failed", { status: 400 });
        }
      },
    },
  },
});
