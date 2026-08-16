const fs = require("fs");
const file = "src/routes/__root.tsx";
let code = fs.readFileSync(file, "utf8");

if (!code.includes('import { Toaster } from "sonner";')) {
  code = code.replace(
    'import { reportLovableError } from "../lib/lovable-error-reporting";',
    'import { reportLovableError } from "../lib/lovable-error-reporting";\nimport { Toaster } from "sonner";',
  );
  code = code.replace(
    "<Outlet />\n    </QueryClientProvider>",
    '<Outlet />\n      <Toaster position="top-center" />\n    </QueryClientProvider>',
  );
  fs.writeFileSync(file, code);
}
