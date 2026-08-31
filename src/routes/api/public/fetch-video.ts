import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fetch-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Very basic protection: require a custom header or block typical bot UAs if we want,
          // but just removing CORS wildcard will stop a lot of automated browser scraping.
          if (request.headers.get("x-kvd-client") !== "v1") {
    return Response.json({ success: false, error: "Unauthorized endpoint usage" }, { status: 401 });
  }
          
          const body = (await request.json()) as { url?: string };
          if (!body?.url || typeof body.url !== "string" || body.url.length > 4000) {
            return Response.json(
              { success: false, error: "Invalid url" },
              { status: 400 },
            );
          }

          const { fetchVideoInfo } = await import("@/lib/kuaishou-fetch.server");
          const data = await fetchVideoInfo(body.url);

          return Response.json({ success: true, data });
        } catch (e) {
          return Response.json(
            { success: false, error: e instanceof Error ? e.message : "Could not fetch video" },
            { status: 200 },
          );
        }
      },
    },
  },
});
