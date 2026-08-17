import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/download-proxy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
