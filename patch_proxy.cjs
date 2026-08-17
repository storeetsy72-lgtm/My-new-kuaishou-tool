const fs = require('fs');
let code = fs.readFileSync('src/lib/downloader-client.ts', 'utf8');

code = code.replace(
  /\/api\/public\/download-proxy/g,
  'https://empty-river-2eb7.storeetsy72.workers.dev/'
);

fs.writeFileSync('src/lib/downloader-client.ts', code);
