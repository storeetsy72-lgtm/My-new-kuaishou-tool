const fs = require('fs');
const file = 'vite.config.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'process.env.CF_PAGES ? { preset: "cloudflare-pages" }',
  'process.env.CF_PAGES ? { preset: "cloudflare-pages", cloudflare: { pages: { routes: { exclude: ["/assets/*", "/favicon.ico"] } } } }'
);

fs.writeFileSync(file, content);
