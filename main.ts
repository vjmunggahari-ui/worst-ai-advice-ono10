import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line: the worst advice an AI could give, in 140 characters or fewer.
// 115 chars, no trailing newline.
const ENTRY =
  "To fix the failing deploy, just push straight to production on a Friday — the weekend traffic will test it for you.";

function main(): void {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  // Read-back self-check: the file must hold exactly the entry.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) throw new Error("read-back mismatch");
  if (back.length < 1 || back.length > 140) {
    throw new Error(`entry length ${back.length} outside 1-140`);
  }
  if (back.endsWith("\n")) {
    throw new Error("entry must not end with a newline");
  }
  if (back.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (back.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  if (back !== back.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // UTF-8 round-trip: the bytes must decode back to exactly the entry.
  const bytes = Buffer.from(back, "utf8");
  if (bytes.toString("utf8") !== back) {
    throw new Error("entry is not valid UTF-8 text");
  }
  console.log(`wrote ${outPath} (${back.length} chars)`);
}

main();
