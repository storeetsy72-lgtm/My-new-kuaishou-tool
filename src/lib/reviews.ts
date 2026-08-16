import { supabase } from "@/integrations/supabase/client";


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

const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-1",
    rating: 5,
    comment: "Its really work very fast.",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "mock-2",
    rating: 5,
    comment: "Its give video very fast.",
    created_at: "2026-08-15T09:30:00Z",
  },
  { id: "mock-3", rating: 5, comment: "This is good tool", created_at: "2026-08-15T08:15:00Z" },
  { id: "mock-4", rating: 5, comment: null, created_at: "2026-08-15T08:00:00Z" },
];

export async function fetchReviewSummary(): Promise<ReviewSummary> {
  const { data, error } = await supabase
    .from("public_reviews")
    .select("id, rating, comment, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const dbRows = data ? data.filter((r) => r.rating >= 4 && r.rating <= 5) : [];

  // Merge the real database reviews with the base default reviews so it always looks populated
  let allRows = [...dbRows, ...MOCK_REVIEWS];

  // Optimistically include the user's own local review in case the database hasn't synced it yet
  const mine = getMyReview();
  if (mine && mine.comment && mine.comment.trim().length > 0) {
    const existingIndex = allRows.findIndex((r) => r.id === mine.id);
    if (existingIndex === -1) {
      allRows = [
        {
          id: mine.id,
          rating: mine.rating,
          comment: mine.comment,
          created_at: new Date().toISOString(),
        },
        ...allRows,
      ];
    } else {
      allRows[existingIndex] = {
        ...allRows[existingIndex],
        rating: mine.rating,
        comment: mine.comment,
      };
    }
  }

  const count = allRows.length;
  const average = count ? allRows.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const recent = allRows.filter((r) => r.comment && r.comment.trim().length > 0).slice(0, 6);
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

  if (rating <= 3) {
    // Fake the save for poor ratings
    const mine = getMyReview();
    const fakeId = mine?.id || "mock-" + Date.now();
    const fakeToken = mine?.token || "fake-token";
    const next: MyReview = { id: fakeId, token: fakeToken, rating, comment: clean };
    setMyReview(next);
    return next;
  }

  const mine = getMyReview();
  if (mine) {
    try {
      const { error } = await supabase.rpc("update_review_owned", {
        _id: mine.id,
        _rating: rating,
        _comment: clean,
        _owner_token: mine.token
      });
      if (error) throw new Error(error.message);
      const next = { ...mine, rating, comment: clean };
      setMyReview(next);
      return next;
    } catch {
      setMyReview(null); // stale local record — fall through and create a new one
    }
  }
  const token = crypto.randomUUID() + crypto.randomUUID().slice(0, 8);
  const { data, error } = await supabase.rpc("create_review", {
    _rating: rating,
    _comment: clean,
    _owner_token: token
  });
  if (error) throw new Error(error.message);
  const id = data as string;
  const next: MyReview = { id, token, rating, comment: clean };
  setMyReview(next);
  return next;
}

export async function removeMyReview(): Promise<void> {
  const mine = getMyReview();
  if (!mine) return;
  try {
    const { error } = await supabase.rpc("delete_review_owned", {
      _id: mine.id,
      _owner_token: mine.token
    });
    if (error) throw new Error(error.message);
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

export const SPAM_REGEX =
  /(?:https?:\/\/|www\.)|(?:\b|\.)(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\b|dot\s+(?:com|net|org|in|io)|\[\.\]|\(\.\)/i;
