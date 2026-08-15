import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const Route = createFileRoute("/api/public/fetch-video")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { url?: string };
          if (!body?.url || typeof body.url !== "string" || body.url.length > 4000) {
            return Response.json({ success: false, error: "Invalid url" }, { status: 400, headers: cors });
          }
          const { fetchVideoInfo } = await import("@/lib/kuaishou-fetch.server");
          const data = await fetchVideoInfo(body.url);
          return Response.json({ success: true, data }, { headers: cors });
        } catch (e) {
          return Response.json(
            { success: false, error: e instanceof Error ? e.message : "Could not fetch video" },
            { status: 200, headers: cors },
          );
        }
      },
    },
  },
});
