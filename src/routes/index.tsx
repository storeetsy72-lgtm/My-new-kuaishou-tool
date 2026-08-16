import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SingleTab } from "@/components/downloader/SingleTab";
import { clearHistory, loadHistory, type HistoryItem } from "@/lib/downloader-client";
import {
  fetchReviewSummary,
  hasReviewed,
  markPrompted,
  wasPrompted,
  type ReviewSummary,
} from "@/lib/reviews";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";

// Only the Single tab ships in the first chunk; the rest loads on demand.
const BatchTab = lazy(() =>
  import("@/components/downloader/BatchTab").then((m) => ({ default: m.BatchTab })),
);
const HistoryTab = lazy(() =>
  import("@/components/downloader/HistoryTab").then((m) => ({ default: m.HistoryTab })),
);
const ReviewPrompt = lazy(() =>
  import("@/components/reviews/ReviewPrompt").then((m) => ({ default: m.ReviewPrompt })),
);

const loadReviewsWithTimeout = async (): Promise<ReviewSummary> => {
  try {
    return await Promise.race([
      fetchReviewSummary(),
      new Promise<ReviewSummary>((resolve) =>
        setTimeout(() => resolve({ average: 0, count: 0, recent: [] }), 800),
      ),
    ]);
  } catch {
    return { average: 0, count: 0, recent: [] };
  }
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const summary = await loadReviewsWithTimeout();
    return { summary };
  },
  head: () => ({
    meta: [
      { title: "Kuaishou & Kwai Video Downloader - Fast HD, MP3 & Photo Saver" },
      {
        name: "description",
        content:
          "Download Kuaishou and Kwai videos without watermark in HD, extract MP3 audio or save cover photos. Paste a link and download instantly.",
      },
      { property: "og:title", content: "Kuaishou & Kwai Video Downloader" },
      {
        property: "og:description",
        content: "Save Kuaishou and Kwai videos in HD, MP3 audio or JPEG covers in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type TabId = "single" | "batch" | "history";
const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "single", label: "Single Download", short: "Single" },
  { id: "batch", label: "Batch Download", short: "Batch" },
  { id: "history", label: "History", short: "History" },
];

function Index() {
  const [tab, setTab] = useState<TabId>("single");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const initialSummary = Route.useLoaderData({ select: (d) => d.summary });
  const [summary, setSummary] = useState<ReviewSummary>(initialSummary);
  const [askReview, setAskReview] = useState(false);

  const refresh = useCallback(() => setHistory(loadHistory()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const reloadReviews = useCallback(() => {
    void fetchReviewSummary().then(setSummary);
  }, []);

  useEffect(() => {
    reloadReviews();
  }, [reloadReviews]);

  useEffect(() => {
    const onDownload = (e: Event) => {
      // Never ask again once this browser has rated, and only once per video.
      if (hasReviewed()) return;
      const key = (e as CustomEvent<{ key?: string }>).detail?.key ?? "unknown";
      if (wasPrompted(key)) return;
      markPrompted(key);
      window.setTimeout(() => setAskReview(true), 1200);
    };
    window.addEventListener("kvd:download", onDownload);
    return () => window.removeEventListener("kvd:download", onDownload);
  }, []);

  return (
    <main className="w-full bg-background px-3 py-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-card rounded-2xl p-3 sm:p-4">
          <div
            role="tablist"
            aria-label="Downloader modes"
            className="grid w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`tap min-w-0 truncate rounded-lg px-2 py-2 text-[13px] font-semibold transition-colors sm:text-sm ${
                  tab === t.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3">
            {tab === "single" && <SingleTab onSaved={refresh} />}
            {tab !== "single" && (
              <Suspense
                fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" aria-hidden />}
              >
                {tab === "batch" ? (
                  <BatchTab onSaved={refresh} />
                ) : (
                  <HistoryTab items={history} onClear={() => setHistory(clearHistory())} />
                )}
              </Suspense>
            )}
          </div>
        </div>

        <ReviewsSection summary={summary} onChanged={reloadReviews} />
      </div>

      {askReview && (
        <Suspense fallback={null}>
          <ReviewPrompt onClose={() => setAskReview(false)} onSubmitted={reloadReviews} />
        </Suspense>
      )}
    </main>
  );
}
