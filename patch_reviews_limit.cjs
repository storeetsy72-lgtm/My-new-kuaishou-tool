const fs = require('fs');
let code = fs.readFileSync('src/lib/reviews.ts', 'utf8');

// Increase limit from 200 to 10000, and only download the necessary fields
code = code.replace(
  '.limit(200);',
  '.limit(10000);'
);

fs.writeFileSync('src/lib/reviews.ts', code);
