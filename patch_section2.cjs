const fs = require("fs");
const file = "src/components/reviews/ReviewsSection.tsx";
let code = fs.readFileSync(file, "utf8");

const target = `    // Spam prevention: Block URLs
    const urlPattern = /(https?:\\/\\/|www\\.|[a-zA-Z0-9-]+\\.[a-z]{2,}(\\/|\\s|$))/i;
    if (urlPattern.test(comment)) {`;
const replacement = `    // Spam prevention: Block URLs
    if (SPAM_REGEX.test(comment)) {`;
code = code.replace(target, replacement);

fs.writeFileSync(file, code);
