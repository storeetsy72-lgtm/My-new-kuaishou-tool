import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractKuaishouUrl, type VideoInfo } from "@/lib/kuaishou";
import {
  downloadHref,
  fetchVideoInfo,
  saveHistory,
  triggerDownload,
  videoKey,
} from "@/lib/downloader-client";

type Status = "pending" | "fetching" | "ready" | "failed";
type Row = { url: string; status: Status; info?: VideoInfo; error?: string };

export function BatchTab({ onSaved }: { onSaved: () => void }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  const start = async () => {
    const urls = text
      .split(/\r?\n/)
      .map((line) => extractKuaishouUrl(line))
      .filter((u): u is string => Boolean(u))
      .slice(0, 10);
    if (urls.length === 0) return;
    const initial: Row[] = urls.map((url) => ({ url, status: "pending" }));
    setRows(initial);
    setRunning(true);
    for (let i = 0; i < urls.length; i++) {
      setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "fetching" } : r)));
      try {
        const info = await fetchVideoInfo(urls[i]!);
        saveHistory(info);
        onSaved();
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "ready", info } : r)));
      } catch (e) {
        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? { ...r, status: "failed", error: e instanceof Error ? e.message : "Failed" }
              : r,
          ),
        );
      }
    }
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste up to 10 Kuaishou or Kwai links, one per line"
        rows={4}
        className="resize-none rounded-xl text-sm"
      />
      <Button
        onClick={start}
        disabled={running || text.trim().length === 0}
        className="w-full gap-2"
      >
        {running ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {running ? "Processing" : "Process links"}
      </Button>
      {rows.length > 0 && (
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {rows.map((row, i) => (
            <li
              key={`${row.url}-${i}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{row.info?.title || row.url}</p>
                <p className="truncate text-[11px] text-muted-foreground capitalize">
                  {row.error ?? row.status}
                </p>
              </div>
              <Button
                size="sm"
                className="h-8 gap-1"
                disabled={row.status !== "ready"}
                onClick={() => {
                  if (row.info) triggerDownload(row.info, "mp4", "1080p");
                }}
              >
                {row.status === "fetching" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
