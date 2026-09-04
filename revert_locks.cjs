const fs = require('fs');
const file = 'src/routes/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '      // if (hasReviewed()) return;\n      // const key = (e as CustomEvent<{ key?: string }>).detail?.key ?? "unknown";\n      // if (wasPrompted(key)) return;\n      // markPrompted(key);',
  '      if (hasReviewed()) return;\n      const key = (e as CustomEvent<{ key?: string }>).detail?.key ?? "unknown";\n      if (wasPrompted(key)) return;\n      markPrompted(key);'
);

fs.writeFileSync(file, content);
