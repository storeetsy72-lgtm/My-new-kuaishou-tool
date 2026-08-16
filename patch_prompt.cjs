const fs = require("fs");
const file = "src/components/reviews/ReviewPrompt.tsx";
let code = fs.readFileSync(file, "utf8");

if (!code.includes("import { SPAM_REGEX }")) {
  code = code.replace(
    'import { getMyReview, saveMyReview } from "@/lib/reviews";',
    'import { getMyReview, saveMyReview, SPAM_REGEX } from "@/lib/reviews";\nimport { toast } from "sonner";',
  );
}

const target = `  const sendComment = async () => {
    if (!comment.trim() || saving) return;
    setSaving(true);`;

const replacement = `  const sendComment = async () => {
    if (!comment.trim() || saving) return;
    
    if (SPAM_REGEX.test(comment)) {
      toast.error("Links are not allowed in reviews.");
      return;
    }

    setSaving(true);`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
