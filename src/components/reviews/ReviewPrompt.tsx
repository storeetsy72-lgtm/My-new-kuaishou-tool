import { useEffect, useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMyReview, saveMyReview, SPAM_REGEX } from "@/lib/reviews";
import { toast } from "sonner";

export function ReviewPrompt({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const existing = typeof window !== "undefined" ? getMyReview() : null;
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Clicking a star submits the rating immediately.
  const pick = async (value: number) => {
    setRating(value);
    if (saving || done) return;
    setSaving(true);
    try {
      await saveMyReview(value, comment);
      setDone(true);
      onSubmitted();
    } catch {
      /* keep the dialog open, rating stays selected */
    } finally {
      setSaving(false);
    }
  };

  const sendComment = async () => {
    if (!comment.trim() || saving) return;

    if (SPAM_REGEX.test(comment)) {
      toast.error("Links are not allowed in reviews.");
      return;
    }

    setSaving(true);
    try {
      await saveMyReview(rating || 5, comment);
      onSubmitted();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not save review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[320px] animate-in slide-in-from-bottom-5 fade-in duration-300"
      role="dialog"
      aria-label="Rate this downloader"
    >
      <div
        className="glass-card rounded-2xl bg-card p-5 text-center shadow-2xl border border-border"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="tap float-right -mr-1 -mt-1 rounded-lg p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <h2 className="text-base font-bold text-foreground">
          {done ? "Thanks for your rating!" : "How was your download?"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {done ? "Add a short comment (optional)" : "Tap a star to rate this tool"}
        </p>
        <div className="mt-3 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              disabled={saving}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => pick(i)}
              className="tap rounded-md p-1 hover:scale-110"
            >
              <Star
                className={`size-8 ${
                  i <= (hover || rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
        {saving && !done && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Saving
          </p>
        )}
        {done && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Tell others what you think (optional)"
              className="resize-none rounded-xl text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                No thanks
              </Button>
              <Button className="flex-1" disabled={!comment.trim() || saving} onClick={sendComment}>
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
