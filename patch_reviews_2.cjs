const fs = require("fs");
const file = "src/lib/reviews.ts";
let code = fs.readFileSync(file, "utf8");

const target = `  if (rating <= 3) {
    // Fake the save for poor ratings
    const fakeId = "mock-" + Date.now();
    const next: MyReview = { id: fakeId, token: "fake-token", rating, comment: clean };
    return next;
  }`;

const replacement = `  if (rating <= 3) {
    // Fake the save for poor ratings
    const mine = getMyReview();
    const fakeId = mine?.id || ("mock-" + Date.now());
    const fakeToken = mine?.token || "fake-token";
    const next: MyReview = { id: fakeId, token: fakeToken, rating, comment: clean };
    setMyReview(next);
    return next;
  }`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
