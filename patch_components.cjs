const fs = require("fs");

function patchFile(file) {
  let code = fs.readFileSync(file, "utf8");
  code = code.replace(
    /const href = downloadHref\([^)]+\);\s*if \(href\) triggerDownload\(href, videoKey\([^)]+\)\);/g,
    (match) => {
      return match; // Wait, let's use regex correctly
    },
  );

  // SingleTab
  if (file.includes("SingleTab")) {
    code = code.replace(
      /const href = downloadHref\(data, format\);\s*if \(href\) triggerDownload\(href, videoKey\(data\)\);/g,
      "triggerDownload(data, format);",
    );
    code = code.replace(
      /const href = downloadHref\(info, "mp4", q\);\s*if \(href\) triggerDownload\(href, videoKey\(info\)\);/g,
      'triggerDownload(info, "mp4", q);',
    );
  }

  // HistoryTab
  if (file.includes("HistoryTab")) {
    code = code.replace(
      /const href = downloadHref\(item, "mp4", "1080p"\);\s*if \(href\) triggerDownload\(href, videoKey\(item\)\);/g,
      'triggerDownload(item, "mp4", "1080p");',
    );
  }

  // BatchTab
  if (file.includes("BatchTab")) {
    code = code.replace(
      /const href = row.info && downloadHref\(row.info, "mp4", "1080p"\);\s*if \(href && row.info\) triggerDownload\(href, videoKey\(row.info\)\);/g,
      'if (row.info) triggerDownload(row.info, "mp4", "1080p");',
    );
  }

  fs.writeFileSync(file, code);
}

patchFile("src/components/downloader/SingleTab.tsx");
patchFile("src/components/downloader/HistoryTab.tsx");
patchFile("src/components/downloader/BatchTab.tsx");
