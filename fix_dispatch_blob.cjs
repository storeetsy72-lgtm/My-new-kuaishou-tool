const fs = require('fs');
const file = 'src/lib/downloader-client.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  // If we have a directUrl, try fetching it as a blob with progress.\n  if (directUrl) {\n    const toastId = toast.loading("Starting download...");\n    try {\n      const res = await fetch(directUrl, { mode: "cors" });',
  '  // If we have a directUrl, try fetching it as a blob with progress.\n  if (directUrl) {\n    const toastId = toast.loading("Starting download...");\n    // Fire the event right before the direct blob fetch freezes the UI\n    setTimeout(() => { try { window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key } })); } catch {} }, 10);\n    try {\n      const res = await fetch(directUrl, { mode: "cors" });'
);

fs.writeFileSync(file, content);
