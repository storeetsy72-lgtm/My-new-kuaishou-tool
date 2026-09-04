const fs = require('fs');
const file = 'src/components/promos/GraphicDesignPromo.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<button
                type="button"
                onClick={handleCopy}
                className="tap flex items-center justify-center rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy phone number"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>`;

const replacement = `<button
                type="button"
                onClick={handleCopy}
                className="tap flex items-center justify-center gap-1.5 rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy phone number"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span className="text-[11px] font-bold">{copied ? "Copied!" : "Copy number"}</span>
              </button>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
