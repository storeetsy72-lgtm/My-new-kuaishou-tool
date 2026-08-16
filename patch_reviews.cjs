const fs = require('fs');
let code = fs.readFileSync('src/lib/reviews.ts', 'utf8');

code = code.replace(
  'import { createReview, deleteReview, updateReview } from "./reviews.functions";',
  ''
);

code = code.replace(
  '.from("reviews")',
  '.from("public_reviews")'
);

code = code.replace(
  /const { id, token } = await createReview.*?token, rating, comment: clean };/s,
  `const token = crypto.randomUUID() + crypto.randomUUID().slice(0, 8);
  const { data, error } = await supabase.rpc("create_review", {
    _rating: rating,
    _comment: clean,
    _owner_token: token
  });
  if (error) throw new Error(error.message);
  const id = data as string;
  const next: MyReview = { id, token, rating, comment: clean };`
);

code = code.replace(
  /await updateReview\({ data: { id: mine\.id, token: mine\.token, rating, comment: clean } }\);/s,
  `const { error } = await supabase.rpc("update_review_owned", {
        _id: mine.id,
        _rating: rating,
        _comment: clean,
        _owner_token: mine.token
      });
      if (error) throw new Error(error.message);`
);

code = code.replace(
  /await deleteReview\({ data: { id: mine\.id, token: mine\.token } }\);/s,
  `const { error } = await supabase.rpc("delete_review_owned", {
      _id: mine.id,
      _owner_token: mine.token
    });
    if (error) throw new Error(error.message);`
);

fs.writeFileSync('src/lib/reviews.ts', code);
