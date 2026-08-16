const fs = require("fs");

function addCatchToSave(file) {
  let code = fs.readFileSync(file, "utf8");

  if (code.includes("} catch (err) {") || code.includes("} catch (e: any) {")) return;

  const target = `    try {
      const next = await saveMyReview(rating, comment);
      setMine(next);
      setEditing(false);
      onChanged?.();
    } finally {`;

  const replacement = `    try {
      const next = await saveMyReview(rating, comment);
      setMine(next);
      setEditing(false);
      onChanged?.();
    } catch (e: any) {
      toast.error(e.message || "Could not save review");
    } finally {`;

  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
}

function addCatchToSendComment(file) {
  let code = fs.readFileSync(file, "utf8");

  if (code.includes("} catch (e: any) {")) return;

  const target = `    try {
      await saveMyReview(rating || 5, comment);
      onSubmitted();
      onClose();
    } catch {
      /* ignore */
    } finally {`;

  const replacement = `    try {
      await saveMyReview(rating || 5, comment);
      onSubmitted();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not save review");
    } finally {`;

  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
}

addCatchToSave("src/components/reviews/ReviewsSection.tsx");
addCatchToSendComment("src/components/reviews/ReviewPrompt.tsx");
