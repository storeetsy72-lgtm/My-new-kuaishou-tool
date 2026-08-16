const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');

// Ensure html, body don't artificially scroll if embedded
if (!code.includes('html, body {')) {
  code += `\nhtml, body { margin: 0; padding: 0; background: transparent !important; }\n`;
}

fs.writeFileSync('src/styles.css', code);
