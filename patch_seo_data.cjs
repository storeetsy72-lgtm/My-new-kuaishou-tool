const fs = require('fs');
let code = fs.readFileSync('src/components/reviews/ReviewsSection.tsx', 'utf8');

code = code.replace(
  'const APP_NAME = "Kuaishou & Kwai Video Downloader";',
  'const APP_NAME = "Kuaishou Video Downloader";'
);

code = code.replace(
  'const APP_URL = "https://kwaivideosaver.lovable.app/";',
  'const APP_URL = "https://kuaivideosdownloader.com/";'
);

code = code.replace(
  '"Free online tool to download Kuaishou and Kwai videos in HD, extract MP3 audio or save cover photos."',
  '"Free online tool to download Kuaishou and Kwai videos without watermark in HD & 4K quality. No login or app installation required."'
);

code = code.replace(
  'operatingSystem: "Any (web browser)",',
  'operatingSystem: "Android, iOS, Windows, macOS, Web",'
);

code = code.replace(
  'browserRequirements: "Requires JavaScript",',
  'browserRequirements: "Requires a modern web browser",'
);

fs.writeFileSync('src/components/reviews/ReviewsSection.tsx', code);
