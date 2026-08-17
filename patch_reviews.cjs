const fs = require('fs');
let code = fs.readFileSync('src/lib/reviews.ts', 'utf8');

const startIndex = code.indexOf('export async function fetchReviewSummary');
const endIndex = code.indexOf('/* ---------------- my review');

if (startIndex !== -1 && endIndex !== -1) {
   const newFunc = `export async function fetchReviewSummary(): Promise<ReviewSummary> {
  const [ratingsRes, recentRes] = await Promise.all([
    supabase.from("public_reviews").select("rating").gte("rating", 4),
    supabase.from("public_reviews").select("id, rating, comment, created_at, updated_at").not("comment", "is", null).order("created_at", { ascending: false }).limit(10)
  ]);

  const dbRatings = ratingsRes.data || [];
  const dbRecent = recentRes.data || [];

  let allRatings = [...dbRatings.map(r => r.rating), ...MOCK_REVIEWS.map(r => r.rating)];
  let allRecent = [...dbRecent, ...MOCK_REVIEWS];

  const mine = getMyReview();
  if (mine && mine.comment && mine.comment.trim().length > 0) {
    const existingIndex = allRecent.findIndex((r) => r.id === mine.id);
    if (existingIndex === -1) {
      allRecent = [
        { id: mine.id, rating: mine.rating, comment: mine.comment, created_at: new Date().toISOString() },
        ...allRecent,
      ];
      allRatings.push(mine.rating);
    } else {
      allRecent[existingIndex] = { ...allRecent[existingIndex], rating: mine.rating, comment: mine.comment };
    }
  }

  const count = allRatings.length;
  const average = count ? allRatings.reduce((sum, r) => sum + r, 0) / count : 0;
  const recent = allRecent.filter((r) => r.comment && r.comment.trim().length > 0).slice(0, 6);

  return { average: Math.round(average * 10) / 10, count, recent };
}

`;
   code = code.substring(0, startIndex) + newFunc + code.substring(endIndex);
   fs.writeFileSync('src/lib/reviews.ts', code);
}
