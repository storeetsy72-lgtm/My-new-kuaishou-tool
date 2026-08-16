# Kwai Downloader Pro

Build a Kuaishou & Kwai Video Downloader Tool

Build a production-ready, watermark-free Kuaishou / Kwai video downloader web app. Use React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui, with Lovable Cloud (backend + edge functions). Follow every detail below exactly.

1. Design System

Primary brand color: orange #FF6B1A. Define it as HSL semantic tokens in index.css and map through tailwind.config.ts. Never hardcode colors in components.

Minimal, clean, glassmorphism cards (soft blur, subtle border, gentle shadow).

Fully fluid responsive layout — NO fixed heights or widths anywhere. It must work perfectly inside a WordPress iframe at any width.

No secondary header subtitle text. Keep the UI text short and confident.

Light theme default, rounded-xl cards, smooth 150–200ms transitions on hover/active states.

2. Page Structure (single page, route /)

Compact header with tool name only.

Tabs: Single Download and Batch Download.

Below tabs: a small footer line (tiny text, muted).

Entire tool must fit without vertical scrolling in both the empty state and the result state.

3. Single Download flow (exact 3 steps)

Step 1 — Empty state: One URL input with paste placeholder and a disabled "Get Download Link" button.

Step 2 — After the user pastes/types a valid Kuaishou or Kwai URL: reveal a "Choose download format" section with 3 selectable cards:

MP4 — "Video file"

MP3 — "Audio only"

JPEG — "Cover image"

Then the "Get Download Link" button becomes enabled.

Step 3 — After clicking "Get Download Link": fetch metadata, then show a compact result card containing a small thumbnail, video title and author, followed by "Choose video quality" cards (only when MP4 is selected):

360p — MP4 video

720p HD — MP4 video

1080p HD — MP4 video — badge "Recommended"

4K Ultra — MP4 video

Clicking a quality immediately starts the download. Below that, a "Download another video" button that fully resets state.

4. Batch Download tab Textarea accepting multiple URLs (one per line), max 10 at a time. Process sequentially with per-item status (pending / fetching / ready / failed) and a download button per row.

5. URL support (critical) The tool must accept and correctly resolve ALL of these, including when pasted inside a long share caption with Chinese text around the link:

App links: https://v.kuaishou.com/KvSbXmcp

International: https://www.kwai.com/...

Share links: https://www.kuaishou.com/f/...

Direct video: https://www.kuaishou.com/short-video/3x5645upptz4jyu

Photo posts: https://www.kuaishou.com/photo/...

Implement an extractKuaishouUrl(text) helper (used on BOTH client and edge function) that regex-scans arbitrary pasted text, strips trailing punctuation, parses each candidate with new URL(), and returns the first one whose hostname matches kuaishou.com, kwai.com, or kuaishou-cdn.com.

6. Edge functions (3 total, all verify_jwt = false)

fetch-video — POST { url }, returns { success, data: { title, author, thumbnail, videoUrl, audioUrl, photoUrl, quality } }.

Rotate among 3 realistic desktop/mobile User-Agent strings.

Manual redirect following, max 5 hops, 8 second AbortController timeout per request (prevents 150s IDLE_TIMEOUT 504s).

Build candidate URL list: original, query-stripped, m.kuaishou.com variant, plus https://v.m.chenzhongtech.com/fw/photo/{id} and https://v.kuaishou.com/fw/photo/{id} when a video ID can be extracted (short-video / photo / video / fw patterns). Direct desktop fetches often return a generic homepage — the mobile share endpoint is what actually returns metadata.

Max 2 attempts per candidate with small backoff. Treat empty HTML, <1500 chars, 403, or 429 as blocked and retry.

Extract metadata with layered regex fallbacks for title (og:title, caption, title, desc), author (userName, nickName, author), thumbnail (og:image, coverUrl, poster), audio (audioUrl, soundUrl, musicUrl, .mp3/.m4a/.aac), and photo (.jpg/.jpeg/.png/.webp).

CRITICAL for video URL: strip out the "adaptationSet":[...] block BEFORE matching generic "url" patterns, and skip any URL matching ksAudio|audio_only|video_only|audioOnly|videoOnly|/audio/|mediaType=audio. Kuaishou's adaptive manifest contains separate audio-only and video-only tracks — picking a video-only track produces a silent download. Prefer canonical muxed fields in this order: srcNoMark, photoUrl, mainMvUrls[].url, playUrl, videoUrl, mp4Url. Fall back to HLS .m3u8 only if no MP4 exists.

Decode \uXXXX unicode escapes in every extracted URL.

SSRF guard: reject non-http(s) schemes and block localhost, ::1, fe80:/fc00:/fd00:, metadata.google.internal, 10.x, 127.x, 0.x, 169.254.x, 172.16–31.x, 192.168.x, and 224.x+. Apply the guard on every redirect hop too.

download-proxy — GET ?url=&type=&filename=. Transparently streams the upstream response body to the client (never buffer the whole file into memory). Sets Content-Type per media type and forces download via Content-Disposition: attachment.

extract-audio — GET ?url=&filename=. Produces an audio-only M4A. Must serve Content-Type: audio/mp4 — NOT audio/mpeg. .m4a is an MP4 audio container, and audio/mpeg causes silent playback failure in browsers.

Both download functions must set Content-Disposition using RFC 5987 encoding:

attachment; filename="fallback.mp4"; filename*=UTF-8''<encodeURIComponent(name)>

Raw Chinese characters in a header throw a ByteString error and return a 500.

7. Filenames (branding) Every downloaded file must be named kuaivideosdownloader.com-<sanitized-title>.<ext>. Sanitizer: remove \ / : * ? " < > | and newlines/tabs, collapse whitespace, trim to 80 chars, replace spaces with dashes. If there's no title, fall back to kuaivideosdownloader.com-kuaishou-video.mp4 (or -kuaishou-audio.m4a / -kuaishou-photo.jpg). Keep the original video description — just prefix the brand.

8. Download trigger (iframe-critical) Never use window.location.href. Always create a temporary <a> element with target="_blank" and rel="noopener noreferrer", append to body, .click(), then remove. This is the only method that reliably works inside a WordPress iframe.

9. Reliability Client-side fetchVideoInfo retries up to 3 times with 350ms × attempt backoff on any transient failure (failed to fetch, network, timeout, gateway) or backend messages matching try again|could not fetch|temporarily|blocked|rate.

10. Iframe auto-resize (must be exact) In index.html, add a script that measures #root's getBoundingClientRect().height (NOT document.scrollHeight, which never shrinks) and posts { type: 'lovable:resize', height } to window.parent. Wire up a ResizeObserver on #root, a MutationObserver on the subtree, and a periodic resend interval. Add CSS that neutralizes min-h-screen when embedded. The iframe must both grow AND shrink so there is never empty space at the bottom or cut-off content.

11. Local download history Persist recent downloads in localStorage (title, author, thumbnail, urls, timestamp). Show them in a compact list with re-download buttons and a clear-all action.

12. Do NOT include

No <title> or <meta name="description"> or any Open Graph title/description tags in index.html.

No embed codes, no integration instructions, no developer-facing text anywhere in the UI. The WordPress integration must be completely invisible to end users.

No login, no signup, no database tables — this is a fully anonymous, stateless tool.

13. Performance Split vendor chunks (react, supabase, radix) via manualChunks in vite.config.ts. Lazy-load the Toaster during idle. Make zero API/auth calls on startup. Optimize for LCP, INP, and CLS.

Mian tool related thing which must on the Tool
Tool design don't show any uper side or lower side text or logo. and the tool backround white. second add the history tab on the top row where show "single download" & "Batch Download" third and history where show recent download videos. make sure its fetch kuaishou and kwai video is seconds and them most important user instant in second download videos in their local storage in any quality"360p — MP4 video

720p HD — MP4 video

1080p HD — MP4 video — badge "Recommended"

4K Ultra — MP4 video"
without any problem.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kwaivideosaver.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b6c6bcd-5465-4449-b73d-74bd39d28cda).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
