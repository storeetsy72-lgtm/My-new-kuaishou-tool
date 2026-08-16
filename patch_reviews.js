const fs = require("fs");
const file = "src/lib/reviews.ts";
let code = fs.readFileSync(file, "utf8");

if (!code.includes("export const SPAM_REGEX")) {
  code += `\n\nexport const SPAM_REGEX = /(?:https?:\\/\\/|www\\.)|\\b[a-zA-Z0-9-]+\\.(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\\b|dot\\s+(?:com|net|org|in|io)|\\[\\.\\]|\\(\\.\\)/i;\n`;
}

fs.writeFileSync(file, code);
