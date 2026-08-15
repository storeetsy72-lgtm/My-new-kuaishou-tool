import { useMemo, useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VideoInfo } from "@/lib/kuaishou";
import {
  downloadHref,
  fetchVideoInfo,
  isValidLink,
  saveHistory,
  triggerDownload,
  videoKey,
  type Format,
  type Quality,
} from "@/lib/downloader-client";
import { QualityCards } from "./QualityCards";

const FORMATS: { id: Format; label: string; hint: string }[] = [
  { id: "mp4", label: "MP4", hint: "Video file" },
  { id: "mp3", label: "MP3", hint: "Audio only" },
  { id: "jpeg", label: "JPEG", hint: "Cover image" },
];

export function SingleTab({ onSaved }: { onSaved: () => void }) {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<Format>("mp4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<VideoInfo | null>(null);

  const valid = useMemo(() => isValidLink(url), [url]);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideoInfo(url);
      setInfo(data);
      saveHistory(data);
      onSaved();
      if (format !== "mp4") {
        const href = downloadHref(data, format);
        if (href) triggerDownload(href, videoKey(data));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch this video");
    } finally {
      setLoading(false);
    }
  };

  const pickQuality = (q: Quality) => {
    if (!info) return;
    const href = downloadHref(info, "mp4", q);
    if (href) triggerDownload(href, videoKey(info));
  };

  const reset = () => {
    setUrl("");
    setInfo(null);
    setError(null);
    setFormat("mp4");
  };

  if (info) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-card p-2.5">
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={info.title || "Video cover"}
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="size-12 shrink-0 rounded-lg bg-muted" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {info.title || "Kuaishou video"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{info.author || "Unknown"}</p>
          </div>
        </div>
        {format === "mp4" && <QualityCards onPick={pickQuality} />}
        <Button variant="outline" onClick={reset} className="w-full gap-2">
          <RotateCcw className="size-4" /> Download another video
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://kwai.com/... or https://kuaishou.com/..."
        inputMode="url"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        className="h-14 rounded-xl px-4 text-base sm:h-12 sm:text-sm"
      />
      {valid && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Choose download format</p>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={format === f.id}
                className={`tap rounded-xl border p-2.5 text-left ${
                  format === f.id
                    ? "border-primary bg-accent"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className="block truncate text-sm font-semibold text-foreground">
                  {f.label}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">{f.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        onClick={submit}
        disabled={!valid || loading}
        className="h-14 w-full gap-2 rounded-xl text-base font-bold shadow-md sm:h-12"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
        Get Download Link
      </Button>
    </div>
  );
}
