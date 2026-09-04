const fs = require('fs');
const file = 'src/routes/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const ReviewPrompt = lazy(() =>',
  'const GraphicDesignPromo = lazy(() => import("@/components/promos/GraphicDesignPromo").then((m) => ({ default: m.GraphicDesignPromo })));\nconst ReviewPrompt = lazy(() =>'
);

content = content.replace(
  'const [askReview, setAskReview] = useState(false);',
  'const [askReview, setAskReview] = useState(false);\n  const [askPromo, setAskPromo] = useState(false);'
);

content = content.replace(
  'window.setTimeout(() => setAskReview(true), 1200);',
  'window.setTimeout(() => setAskPromo(true), 1200);'
);

content = content.replace(
  '{askReview && (',
  '{askPromo && <Suspense fallback={null}><GraphicDesignPromo onClose={() => { setAskPromo(false); setTimeout(() => setAskReview(true), 300); }} /></Suspense>}\n      {askReview && !askPromo && ('
);

fs.writeFileSync(file, content);
