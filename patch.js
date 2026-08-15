const fs = require('fs');
const file = 'src/lib/reviews.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `  // Merge the real database reviews with the base default reviews so it always looks populated
  const allRows = [...dbRows, ...MOCK_REVIEWS];`;

const replacement = `  // Merge the real database reviews with the base default reviews so it always looks populated
  let allRows = [...dbRows, ...MOCK_REVIEWS];

  // Optimistically include the user's own local review in case the database hasn't synced it yet
  const mine = getMyReview();
  if (mine && mine.comment && mine.comment.trim().length > 0) {
    const existingIndex = allRows.findIndex(r => r.id === mine.id);
    if (existingIndex === -1) {
      allRows = [{
        id: mine.id,
        rating: mine.rating,
        comment: mine.comment,
        created_at: new Date().toISOString()
      }, ...allRows];
    } else {
      allRows[existingIndex] = {
        ...allRows[existingIndex],
        rating: mine.rating,
        comment: mine.comment
      };
    }
  }`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
