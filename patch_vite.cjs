const fs = require("fs");
let code = fs.readFileSync("vite.config.ts", "utf8");

code = code.replace(
  "tanstackStart: {",
  `nitro: {
    output: {
      dir: "dist",
      serverDir: "dist/server",
      publicDir: "dist/client"
    }
  },
  tanstackStart: {`,
);

fs.writeFileSync("vite.config.ts", code);
