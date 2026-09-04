const fs = require('fs');
const file = 'src/components/promos/GraphicDesignPromo.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '                 {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}               </button>             </div>',
  '                 {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}<span className="text-[11px] font-bold ml-1">{copied ? "Copied!" : "Copy number"}</span></button>             </div>'
);
content = content.replace(
  '               <button                 type="button"                 onClick={handleCopy}                 className="tap flex items-center justify-center rounded-md p-1',
  '               <button                 type="button"                 onClick={handleCopy}                 className="tap flex items-center justify-center rounded-md px-2 py-1'
);

fs.writeFileSync(file, content);
