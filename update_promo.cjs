const fs = require('fs');
const file = 'src/components/promos/GraphicDesignPromo.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { useEffect } from "react";\nimport { X, Palette, CheckCircle2, MessageCircle, Zap, ShieldCheck, Infinity } from "lucide-react";',
  'import { useEffect, useState } from "react";\nimport { X, Palette, CheckCircle2, MessageCircle, Zap, ShieldCheck, Infinity, Copy, Check } from "lucide-react";'
);

content = content.replace(
  'export function GraphicDesignPromo({\n  onClose,\n}: {\n  onClose: () => void;\n}) {',
  'export function GraphicDesignPromo({\n  onClose,\n}: {\n  onClose: () => void;\n}) {\n  const [copied, setCopied] = useState(false);\n  const handleCopy = () => {\n    navigator.clipboard.writeText("03437893678");\n    setCopied(true);\n    setTimeout(() => setCopied(false), 2000);\n  };\n'
);

content = content.replace(
  '             {/* Uncopyable Phone Number */}\n             <div \n                className="mt-2 flex items-center justify-center select-none"\n                style={{ WebkitUserSelect: \'none\', userSelect: \'none\' }}\n                onContextMenu={(e) => e.preventDefault()}\n             >\n               <p className="text-[13px] font-black tracking-wide text-foreground/90 pointer-events-none">\n                  0343 789 3678\n               </p>\n             </div>',
  '             {/* Copyable Phone Number */}\n             <div className="mt-2 flex items-center justify-center gap-1.5">\n               <p className="text-[13px] font-black tracking-wide text-foreground/90">\n                  0343 789 3678\n               </p>\n               <button\n                 type="button"\n                 onClick={handleCopy}\n                 className="tap flex items-center justify-center rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"\n                 aria-label="Copy phone number"\n               >\n                 {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}\n               </button>\n             </div>'
);

fs.writeFileSync(file, content);
