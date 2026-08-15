import { supabase } from "@/integrations/supabase/client";
import { createReview, deleteReview, updateReview } from "./reviews.functions";

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type ReviewSummary = {
  average: number;
  count: number;
  recent: Review[];
};

export async function fetchReviewSummary(): Promise<ReviewSummary> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return { average: 0, count: 0, recent: [] };

  const rows = data.filter((r) => r.rating >= 1 && r.rating <= 5);
  const count = rows.length;
  const average = count ? rows.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const recent = rows.filter((r) => r.comment && r.comment.trim().length > 0).slice(0, 6);
  return { average: Math.round(average * 10) / 10, count, recent };
}

/* ---------------- my review (owned via local token) ---------------- */

export type MyReview = { id: string; token: string; rating: number; comment: string | null };

const MINE = "kvd:myReview";

export function getMyReview(): MyReview | null {
  try {
    const raw = localStorage.getItem(MINE);
    return raw ? (JSON.parse(raw) as MyReview) : null;
  } catch {
    return null;
  }
}

function setMyReview(value: MyReview | null) {
  try {
    if (value) localStorage.setItem(MINE, JSON.stringify(value));
    else localStorage.removeItem(MINE);
  } catch {
    /* ignore */
  }
}

/** Creates the review, or updates it when this browser already left one. */
export async function saveMyReview(rating: number, comment?: string | null): Promise<MyReview> {
  const clean = comment?.trim() ? comment.trim().slice(0, 300) : null;
  const mine = getMyReview();
  if (mine) {
    try {
      await updateReview({ data: { id: mine.id, token: mine.token, rating, comment: clean } });
      const next = { ...mine, rating, comment: clean };
      setMyReview(next);
      return next;
    } catch {
      setMyReview(null); // stale local record — fall through and create a new one
    }
  }
  const { id, token } = await createReview({ data: { rating, comment: clean } });
  const next: MyReview = { id, token, rating, comment: clean };
  setMyReview(next);
  return next;
}

export async function removeMyReview(): Promise<void> {
  const mine = getMyReview();
  if (!mine) return;
  try {
    await deleteReview({ data: { id: mine.id, token: mine.token } });
  } finally {
    setMyReview(null);
  }
}

/* ---------------- prompt tracking ---------------- */

export const hasReviewed = () => getMyReview() !== null;

const PROMPTED = "kvd:promptedVideos";

function promptedList(): string[] {
  try {
    const raw = localStorage.getItem(PROMPTED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function wasPrompted(key: string) {
  return promptedList().includes(key);
}

export function markPrompted(key: string) {
  try {
    const list = [key, ...promptedList().filter((k) => k !== key)].slice(0, 100);
    localStorage.setItem(PROMPTED, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
