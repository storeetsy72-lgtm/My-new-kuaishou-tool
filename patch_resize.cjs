const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Replace the observer target and height calculation
code = code.replace(
  'const observer = new ResizeObserver(() => sendHeight());',
  `const observer = new ResizeObserver((entries) => {
      // Use the actual content height, not the document scroll height to prevent infinite loops
      const mainEl = document.getElementById("kvd-main-content");
      if (mainEl) {
        const height = mainEl.getBoundingClientRect().height;
        window.parent.postMessage({ type: "kvd:resize", height }, "*");
      }
    });`
);

// We need to also replace the initial sendHeight logic inside the effect
code = code.replace(
  /const sendHeight = \(\) => {[\s\S]*?};/m,
  ''
);

code = code.replace(
  'observer.observe(document.body);',
  `const mainEl = document.getElementById("kvd-main-content");
    if (mainEl) {
      observer.observe(mainEl);
      window.parent.postMessage({ type: "kvd:resize", height: mainEl.getBoundingClientRect().height }, "*");
    }`
);

code = code.replace(
  'sendHeight();',
  ''
);

code = code.replace(
  '<main className="w-full bg-background px-3 py-4">',
  '<main id="kvd-main-content" className="w-full bg-background px-3 py-4 overflow-hidden">'
);

fs.writeFileSync('src/routes/index.tsx', code);
