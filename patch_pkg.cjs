const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts.build = "vite build";
pkg.scripts.start = "node dist/server/index.mjs";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
