const fs = require('fs');
const file = 'src/lib/downloader-client.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  // Fallback / Proxy behavior (including audio)\n  const toastId = toast.loading("Starting download...");\n  try {\n    const res = await fetch(href);',
  '  // Fallback / Proxy behavior (including audio)\n  const toastId = toast.loading("Starting download...");\n  try {\n    // Ensure the event fires immediately before the proxy download hangs the thread\n    setTimeout(() => { try { window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } })); } catch {} }, 10);\n    \n    const res = await fetch(href);'
);

fs.writeFileSync(file, content);
