const fs = require('fs');
const file = 'src/lib/downloader-client.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /"Content-Type": "application\/json"/,
  '"Content-Type": "application/json", "x-kvd-client": "v1"'
);

fs.writeFileSync(file, content);
