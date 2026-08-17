import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/extract-audio")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const target = params.get("url");
        const filename = params.get("filename") ?? "kuaivideosdownloader.com-kuaishou-audio.m4a";
        
        if (!target) return new Response("Missing url", { status: 400 });
        
        const cfUrl = `https://empty-river-2eb7.storeetsy72.workers.dev/?url=${encodeURIComponent(target)}&type=audio&filename=${encodeURIComponent(filename)}`;
        
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
