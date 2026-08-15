import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getMyReview,
  removeMyReview,
  saveMyReview,
  type MyReview,
  type ReviewSummary,
} from "@/lib/reviews";
import { Stars } from "./Stars";

const APP_NAME = "Kuaishou & Kwai Video Downloader";
const APP_URL = "https://kwaivideosaver.lovable.app/";

function buildJsonLd(summary: ReviewSummary) {
  const reviews = summary.recent
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .map((r) => ({
      "@type": "Review",
      name: `${r.rating}-star review of ${APP_NAME}`,
      reviewBody: (r.comment ?? "").slice(0, 300),
      datePublished: (r.updated_at ?? r.created_at).slice(0, 10),
      author: { "@type": "Person", name: "Verified user" },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    url: APP_URL,
    description:
      "Free online tool to download Kuaishou and Kwai videos in HD, extract MP3 audio or save cover photos.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: summary.average.toFixed(1),
      ratingCount: summary.count,
      reviewCount: summary.count,
      bestRating: "5",
      worstRating: "1",
    },
    ...(reviews.length ? { review: reviews } : {}),
  };
}

export function ReviewsSection({
  summary,
  onChanged,
}: {
  summary: ReviewSummary;
  onChanged?: () => void;
}) {
  const [mine, setMine] = useState<MyReview | null>(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMine(getMyReview());
  }, [summary]);

  const startEdit = () => {
    setRating(mine?.rating ?? 0);
    setComment(mine?.comment ?? "");
    setEditing(true);
  };

  const save = async () => {
    if (!rating || busy) return;
    
    // Spam prevention: Block URLs
    const urlPattern = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-z]{2,}(\/|\s|$))/i;
    if (urlPattern.test(comment)) {
      toast.error("Links are not allowed in reviews.");
      return;
    }

    setBusy(true);
    try {
      const next = await saveMyReview(rating, comment);
      setMine(next);
      setEditing(false);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await removeMyReview();
      setMine(null);
      setEditing(false);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  if (summary.count === 0 && !mine) return null;

  return (
    <section aria-label="User reviews" className="mt-4">
      {summary.count > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(summary)) }}
        />
      )}
      <div className="glass-card rounded-2xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="text-2xl font-bold text-foreground">{summary.average.toFixed(1)}</span>
          <Stars value={summary.average} size={18} />
          <span className="text-xs text-muted-foreground">
            {summary.count} {summary.count === 1 ? "rating" : "ratings"} from users
          </span>
        </div>

        {mine && !editing && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card p-2.5">
            <span className="text-xs font-semibold text-foreground">Your rating</span>
            <Stars value={mine.rating} size={14} />
            <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={startEdit}>
              <Pencil className="size-3" /> Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={remove}
              disabled={busy}
            >
              {busy ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
              Remove
            </Button>
          </div>
        )}

        {editing && (
          <div className="mt-3 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Update your rating</span>
              <button
                type="button"
                aria-label="Cancel"
                className="tap rounded-md p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setEditing(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  onClick={() => setRating(i)}
                  className="tap rounded-md p-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`size-7 ${i <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/40"}`}
                  >
                    <path d="M12 17.3 6.2 20.6l1.1-6.5-4.7-4.6 6.5-1L12 2.5l2.9 6 6.5 1-4.7 4.6 1.1 6.5z" />
                  </svg>
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Update your comment (optional)"
              className="mt-2 resize-none rounded-xl text-sm"
            />
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={remove} disabled={busy}>
                Remove rating
              </Button>
              <Button className="flex-1" onClick={save} disabled={!rating || busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        )}

        {summary.recent.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl mask-horizontal">
            <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
              {[...summary.recent, ...summary.recent].map((r, i) => (
                <div key={r.id + "-" + i} className="w-64 flex-shrink-0 rounded-xl border border-border bg-card p-3 shadow-sm whitespace-normal text-left">
                  <Stars value={r.rating} size={13} />
                  <p className="mt-1.5 text-sm text-foreground line-clamp-3">{r.comment}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {(r.updated_at ?? r.created_at).slice(0, 10)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
