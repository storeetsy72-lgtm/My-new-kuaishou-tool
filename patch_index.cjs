const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Reduce SSR block timeout from 800ms to 200ms
code = code.replace(
  'setTimeout(() => resolve({ average: 0, count: 0, recent: [] }), 800)',
  'setTimeout(() => resolve({ average: 0, count: 0, recent: [] }), 200)'
);

// Add iframe resizer effect
const resizerEffect = `
  useEffect(() => {
    if (window === window.parent) return;
    
    const sendHeight = () => {
      // Adding a small padding just to be safe
      const height = document.documentElement.scrollHeight + 20;
      window.parent.postMessage({ type: "kvd:resize", height }, "*");
    };

    const observer = new ResizeObserver(() => sendHeight());
    observer.observe(document.body);
    sendHeight();

    return () => observer.disconnect();
  }, []);
`;

code = code.replace(
  '  useEffect(() => {',
  resizerEffect + '\n  useEffect(() => {'
);

fs.writeFileSync('src/routes/index.tsx', code);
