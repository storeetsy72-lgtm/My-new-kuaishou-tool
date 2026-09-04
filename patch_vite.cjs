const fs = require('fs');
const file = 'vite.config.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'process.env.NETLIFY ? { preset: "netlify" } : {',
  'process.env.NETLIFY ? { preset: "netlify" } : process.env.CF_PAGES ? { preset: "cloudflare-pages" } : {'
);

fs.writeFileSync(file, content);
