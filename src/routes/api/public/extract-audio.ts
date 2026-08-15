import { createFileRoute } from "@tanstack/react-router";
import { contentDisposition } from "@/lib/kuaishou";

export const Route = createFileRoute("/api/public/extract-audio")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const target = params.get("url");
        const filename = params.get("filename") ?? "kuaivideosdownloader.com-kuaishou-audio.m4a";
        if (!target) return new Response("Missing url", { status: 400 });
        try {
          const { safeFetch, refererFor } = await import("@/lib/kuaishou-fetch.server");
          const upstream = await safeFetch(target, { headers: { Referer: refererFor(target) } }, 5, 20000);
          if (!upstream.ok || !upstream.body) return new Response("Upstream error", { status: 502 });
          return new Response(upstream.body, {
            status: 200,
            headers: {
              // .m4a is an MP4 audio container: audio/mpeg breaks browser playback.
              "Content-Type": "audio/mp4",
              "Content-Disposition": contentDisposition(filename, "m4a"),
              "Cache-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (e) {
          return new Response(e instanceof Error ? e.message : "Download failed", { status: 400 });
        }
      },
    },
  },
});
