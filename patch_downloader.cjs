const fs = require("fs");

let code = fs.readFileSync("src/lib/downloader-client.ts", "utf8");

// We will inject a new triggerDownload implementation.
// We also need toast from sonner.

code = "import { toast } from 'sonner';\n" + code;

const newTriggerDownload = `export async function triggerDownload(href: string, filename: string, key?: string, directUrl?: string) {
  try {
    window.dispatchEvent(new CustomEvent("kvd:download", { detail: { key: key ?? href } }));
  } catch {
    /* ignore */
  }

  // If we have a directUrl, try fetching it as a blob with progress.
  if (directUrl) {
    const toastId = toast.loading("Starting download...");
    try {
      const res = await fetch(directUrl, { mode: 'cors' });
      if (!res.ok) throw new Error("CORS fetch failed");
      
      const contentLength = res.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!res.body) throw new Error("No body");
      
      const reader = res.body.getReader();
      let received = 0;
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          const percent = Math.round((received / total) * 100);
          toast.loading(\`Downloading... \${percent}%\`, { id: toastId });
        } else {
          toast.loading(\`Downloading... \${(received / 1024 / 1024).toFixed(1)}MB\`, { id: toastId });
        }
      }
      
      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      
      toast.success("Download complete!", { id: toastId });
      return;
    } catch (e) {
      console.warn("Direct blob download failed, falling back to proxy", e);
      toast.dismiss(toastId);
    }
  }

  // Fallback / Proxy behavior (including audio)
  // For audio, href is the proxy URL.
  // We can fetch it with progress too because the proxy returns a readable stream!
  const toastId = toast.loading("Starting download...");
  try {
      const res = await fetch(href);
      if (!res.ok) throw new Error("Fetch failed");
      
      const contentLength = res.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!res.body) throw new Error("No body");
      
      const reader = res.body.getReader();
      let received = 0;
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          const percent = Math.round((received / total) * 100);
          toast.loading(\`Downloading... \${percent}%\`, { id: toastId });
        } else {
          toast.loading(\`Downloading... \${(received / 1024 / 1024).toFixed(1)}MB\`, { id: toastId });
        }
      }
      
      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename; // proxy sets its own content disposition but for Blob we need download attr
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      
      toast.success("Download complete!", { id: toastId });
      return;
  } catch (e) {
     console.warn("Proxy blob download failed, falling back to navigation", e);
     toast.dismiss(toastId);
     const a = document.createElement("a");
     a.href = href;
     a.target = "_blank";
     a.rel = "noopener noreferrer";
     a.download = filename;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
  }
}`;

code = code.replace(/export function triggerDownload[\s\S]*?\}\n\}/, newTriggerDownload);
fs.writeFileSync("src/lib/downloader-client.ts", code);
