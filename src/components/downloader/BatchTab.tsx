import { useState } from "react";
import { Download, Loader2, ChevronUp } from "lucide-react";
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
import { QualityCards } from "./QualityCards";

type Status = "pending" | "fetching" | "ready" | "failed";
type Row = { url: string; status: Status; info?: VideoInfo; error?: string };

export function BatchTab({ onSaved }: { onSaved: () => void }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const start = async () => {
    setExpandedRow(null);
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
        <ul className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
          {rows.map((row, i) => (
            <li
              key={`${row.url}-${i}`}
              className={`flex flex-col gap-2 rounded-xl border border-border bg-card p-2 transition-colors ${expandedRow === i ? "border-primary/30 bg-primary/5" : ""}`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{row.info?.title || row.url}</p>
                  <p className="truncate text-[11px] text-muted-foreground capitalize">
                    {row.error ?? row.status}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  variant={expandedRow === i ? "secondary" : "default"}
                  disabled={row.status !== "ready"}
                  onClick={() => {
                    setExpandedRow(expandedRow === i ? null : i);
                  }}
                >
                  {row.status === "fetching" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : expandedRow === i ? (
                    <ChevronUp className="size-3.5" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  {expandedRow === i ? "Close" : "Download"}
                </Button>
              </div>
              {expandedRow === i && row.info && (
                <div className="animate-in slide-in-from-top-2 fade-in pt-1 pb-1">
                  <QualityCards onPick={(q) => {
                    triggerDownload(row.info!, "mp4", q);
                  }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
