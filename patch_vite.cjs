const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(
  'nitro: {',
  `nitro: process.env.VERCEL ? {} : {
    preset: "node-server",`
);

fs.writeFileSync('vite.config.ts', code);
