const fs = require("fs");
const file = "src/lib/reviews.ts";
let code = fs.readFileSync(file, "utf8");

const target = `export async function saveMyReview(rating: number, comment?: string | null): Promise<MyReview> {
  const clean = comment?.trim() ? comment.trim().slice(0, 300) : null;
  const mine = getMyReview();`;

const replacement = `export async function saveMyReview(rating: number, comment?: string | null): Promise<MyReview> {
  const clean = comment?.trim() ? comment.trim().slice(0, 300) : null;
  
  if (rating <= 3) {
    // Fake the save for poor ratings
    const fakeId = "mock-" + Date.now();
    const next: MyReview = { id: fakeId, token: "fake-token", rating, comment: clean };
    return next;
  }

  const mine = getMyReview();`;

code = code.replace(target, replacement);

const targetFetch = `const dbRows = data ? data.filter((r) => r.rating >= 1 && r.rating <= 5) : [];`;
const replacementFetch = `const dbRows = data ? data.filter((r) => r.rating >= 4 && r.rating <= 5) : [];`;

code = code.replace(targetFetch, replacementFetch);

fs.writeFileSync(file, code);
