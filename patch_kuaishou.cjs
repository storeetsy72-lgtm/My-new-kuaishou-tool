const fs = require("fs");

let code = fs.readFileSync("src/lib/kuaishou.ts", "utf8");

const target = `export function contentDisposition(filename: string, fallbackExt: string) {
  const ascii = \`\${BRAND}-download.\${fallbackExt}\`;
  return \`attachment; filename="\${ascii}"; filename*=UTF-8''\${encodeURIComponent(filename)}\`;
}`;

const replacement = `export function contentDisposition(filename: string, fallbackExt: string) {
  const ascii = \`\${BRAND}-download.\${fallbackExt}\`;
  // Strict RFC 5987 encoding for tricky characters like parentheses and apostrophes
  const encoded = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\\*/g, '%2A');
  return \`attachment; filename="\${ascii}"; filename*=UTF-8''\${encoded}\`;
}`;

code = code.replace(target, replacement);
fs.writeFileSync("src/lib/kuaishou.ts", code);
