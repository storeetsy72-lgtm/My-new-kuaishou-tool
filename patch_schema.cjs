const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

if (!code.includes('import { ReviewsSection, buildJsonLd }')) {
  code = code.replace(
    'import { ReviewsSection } from "@/components/reviews/ReviewsSection";',
    'import { ReviewsSection, buildJsonLd } from "@/components/reviews/ReviewsSection";'
  );
}

const syncSchemaEffect = `
  useEffect(() => {
    if (window !== window.parent && summary && summary.count > 0) {
      try {
        const schema = buildJsonLd(summary);
        window.parent.postMessage({ type: "kvd:schema", schema }, "*");
      } catch (e) {
        // ignore
      }
    }
  }, [summary]);
`;

if (!code.includes('kvd:schema')) {
  code = code.replace(
    '  useEffect(() => {\n    reloadReviews();\n  }, [reloadReviews]);',
    '  useEffect(() => {\n    reloadReviews();\n  }, [reloadReviews]);\n' + syncSchemaEffect
  );
}

fs.writeFileSync('src/routes/index.tsx', code);
