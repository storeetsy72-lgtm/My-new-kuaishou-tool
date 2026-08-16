const fs = require("fs");
const file = "src/lib/reviews.ts";
let code = fs.readFileSync(file, "utf8");

const target = `export const SPAM_REGEX = /(?:https?:\\/\\/|www\\.)|\\b[a-zA-Z0-9-]+\\.(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\\b|dot\\s+(?:com|net|org|in|io)|\\[\\.\\]|\\(\\.\\)/i;`;
const replacement = `export const SPAM_REGEX = /(?:https?:\\/\\/|www\\.)|(?:\\b|\\.)(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\\b|dot\\s+(?:com|net|org|in|io)|\\[\\.\\]|\\(\\.\\)/i;`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
