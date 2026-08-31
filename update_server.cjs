const fs = require('fs');
const file = 'src/routes/api/public/fetch-video.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const reqOrigin = request\.headers\.get\("origin"\) \|\| "";/,
  `if (request.headers.get("x-kvd-client") !== "v1") {
    return Response.json({ success: false, error: "Unauthorized endpoint usage" }, { status: 401 });
  }`
);

fs.writeFileSync(file, content);
