const fs = require("fs");
const file = "src/lib/reviews.functions.ts";
let code = fs.readFileSync(file, "utf8");

const target1 = `        comment: data.comment?.trim() ? data.comment.trim().slice(0, 300) : null,`;
const replacement1 = `        comment: data.comment?.trim() ? data.comment.trim().slice(0, 300) : null,`;

if (!code.includes("import { SPAM_REGEX }")) {
  code = `import { SPAM_REGEX } from "./reviews";\n` + code;
}

code = code.replace(
  /const clean = data\.comment\?\.trim\(\) \? data\.comment\.trim\(\)\.slice\(0, 300\) : null;/g,
  `const clean = data.comment?.trim() ? data.comment.trim().slice(0, 300) : null;
    if (clean && SPAM_REGEX.test(clean)) throw new Error("Links are not allowed in reviews.");`,
);

// Since we use the raw line inside insert and update:
code = code.replace(
  /comment: data\.comment\?\.trim\(\) \? data\.comment\.trim\(\)\.slice\(0, 300\) : null,/g,
  `comment: (() => {
          const c = data.comment?.trim() ? data.comment.trim().slice(0, 300) : null;
          if (c && SPAM_REGEX.test(c)) throw new Error("Links are not allowed in reviews.");
          return c;
        })(),`,
);

fs.writeFileSync(file, code);
