import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadHref, triggerDownload, videoKey, type HistoryItem } from "@/lib/downloader-client";

export function HistoryTab({ items, onClear }: { items: HistoryItem[]; onClear: () => void }) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No downloads yet.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">Recent downloads</p>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-7 gap-1 text-xs">
          <Trash2 className="size-3.5" /> Clear all
        </Button>
      </div>
      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <li
            key={item.timestamp}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-2"
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title || "Video cover"}
                loading="lazy"
                className="size-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="size-10 shrink-0 rounded-lg bg-muted" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title || "Kuaishou video"}
              </p>
              <p className="truncate text-xs text-muted-foreground">{item.author || "Unknown"}</p>
            </div>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                triggerDownload(item, "mp4", "1080p");
              }}
            >
              <Download className="size-3.5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
