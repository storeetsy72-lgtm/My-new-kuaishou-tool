const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

code = code.replace(/const loadReviewsWithTimeout = async \(\): Promise<ReviewSummary> => \{[\s\S]*?catch \{\n    return \{ average: 0, count: 0, recent: \[\] \};\n  \}\n\};\n\n/, '');

code = code.replace(
  /loader: async \(\) => \{\n    const summary = await loadReviewsWithTimeout\(\);\n    return \{ summary \};\n  \},/,
  'loader: () => {\n    return { summary: { average: 0, count: 0, recent: [] } };\n  },'
);

fs.writeFileSync('src/routes/index.tsx', code);
