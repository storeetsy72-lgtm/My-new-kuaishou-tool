const fs = require("fs");
const file = "src/components/reviews/ReviewsSection.tsx";
let code = fs.readFileSync(file, "utf8");

// 1. Add toast and SPAM_REGEX import
if (!code.includes("import { toast }")) {
  code = code.replace(
    'import { Loader2, Pencil, Trash2, X } from "lucide-react";',
    'import { Loader2, Pencil, Trash2, X } from "lucide-react";\nimport { toast } from "sonner";',
  );
}

if (!code.includes("SPAM_REGEX")) {
  code = code.replace(
    '  type ReviewSummary,\n} from "@/lib/reviews";',
    '  type ReviewSummary,\n  SPAM_REGEX\n} from "@/lib/reviews";',
  );
}

// 2. Add URL blocker in save function
const saveTarget = `  const save = async () => {
    if (!rating || busy) return;
    setBusy(true);`;
const saveReplacement = `  const save = async () => {
    if (!rating || busy) return;
    
    if (SPAM_REGEX.test(comment)) {
      toast.error("Links are not allowed in reviews.");
      return;
    }

    setBusy(true);`;
code = code.replace(saveTarget, saveReplacement);

// 3. Replace the grid with a marquee
const listTarget = `        {summary.recent.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {summary.recent.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-2.5">
                <Stars value={r.rating} size={13} />
                <p className="mt-1 text-sm text-foreground">{r.comment}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {(r.updated_at ?? r.created_at).slice(0, 10)}
                </p>
              </li>
            ))}
          </ul>
        )}`;
const listReplacement = `        {summary.recent.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl mask-horizontal">
            <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
              {[...summary.recent, ...summary.recent].map((r, i) => (
                <div key={r.id + "-" + i} className="w-64 flex-shrink-0 rounded-xl border border-border bg-card p-3 shadow-sm whitespace-normal text-left">
                  <Stars value={r.rating} size={13} />
                  <p className="mt-1.5 text-sm text-foreground line-clamp-3">{r.comment}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {(r.updated_at ?? r.created_at).slice(0, 10)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}`;
code = code.replace(listTarget, listReplacement);

fs.writeFileSync(file, code);
