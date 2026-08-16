const fs = require("fs");
const file = "src/routes/index.tsx";
let code = fs.readFileSync(file, "utf8");

if (!code.includes("loader: async () => {")) {
  const target = `export const Route = createFileRoute("/")({`;
  const replacement = `const loadReviewsWithTimeout = async (): Promise<ReviewSummary> => {
  try {
    return await Promise.race([
      fetchReviewSummary(),
      new Promise<ReviewSummary>((resolve) => 
        setTimeout(() => resolve({ average: 0, count: 0, recent: [] }), 800)
      )
    ]);
  } catch {
    return { average: 0, count: 0, recent: [] };
  }
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const summary = await loadReviewsWithTimeout();
    return { summary };
  },`;
  code = code.replace(target, replacement);

  // Use loader data for initial state
  code = code.replace(
    "  const [summary, setSummary] = useState<ReviewSummary>({ average: 0, count: 0, recent: [] });",
    "  const initialSummary = Route.useLoaderData({ select: (d) => d.summary });\n  const [summary, setSummary] = useState<ReviewSummary>(initialSummary);",
  );

  fs.writeFileSync(file, code);
}
