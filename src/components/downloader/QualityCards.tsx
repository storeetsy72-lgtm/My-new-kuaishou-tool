import { Download } from "lucide-react";
import type { Quality } from "@/lib/downloader-client";

const QUALITIES: { id: Quality; label: string; badge?: string }[] = [
  { id: "360p", label: "360p" },
  { id: "720p", label: "720p HD" },
  { id: "1080p", label: "1080p HD", badge: "Recommended" },
  { id: "4K", label: "4K Ultra" },
];

export function QualityCards({ onPick }: { onPick: (q: Quality) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">Choose video quality</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUALITIES.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onPick(q.id)}
            className="tap group rounded-xl border border-border bg-card p-2.5 text-left hover:border-primary hover:bg-accent active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center justify-between gap-1">
              <span className="truncate text-sm font-semibold text-foreground">{q.label}</span>
              <Download className="size-3.5 shrink-0 text-primary" />
            </div>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {q.badge ?? "MP4 video"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
