const fs = require('fs');
const file = 'src/lib/kuaishou-fetch.server.ts';
let content = fs.readFileSync(file, 'utf8');

const newFetchVideoInfo = `
export async function fetchVideoInfo(input: string): Promise<VideoInfo> {
  const url = extractKuaishouUrl(input);
  if (!url) throw new Error("No valid Kuaishou or Kwai link found");

  const list = candidates(url);
  const fallbacks: VideoInfo[] = [];
  let lastError = "Could not fetch video info";

  // Query every candidate in parallel and return the first one that has a video,
  // without waiting for the slower mirrors to finish. (High speed mode!)
  const all = list.map((c) => attempt(c));
  const first = await new Promise<VideoInfo | null>((resolve) => {
    let pending = all.length;
    for (const p of all) {
      p.then(
        (info) => {
          if (info.videoUrl) resolve(info);
          else fallbacks.push(info);
        },
        (e: unknown) => {
          if (e instanceof Error) lastError = e.message;
        },
      ).finally(() => {
        if (--pending === 0) resolve(null);
      });
    }
  });

  if (first) return first;
  if (fallbacks[0]) return fallbacks[0];
  throw new Error(lastError);
}
`;

content = content.replace(/export async function fetchVideoInfo[\s\S]+$/, newFetchVideoInfo.trim());
fs.writeFileSync(file, content);
