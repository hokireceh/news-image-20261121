// news-image-20261121 — entrypoint (node22, stdlib only).
// Copies entry.png into the grader's output directory and verifies the copy
// is byte-for-byte identical in size; fails loudly on any mismatch.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const src = join(here, "entry.png");
const targets = [
  join(outDir, "entry.png"),
  join(outDir, "output", "entry.png"),
];

const srcSize = statSync(src).size;
for (const dest of targets) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  const destSize = statSync(dest).size;
  if (destSize !== srcSize) {
    console.error(`size mismatch: ${src} is ${srcSize} bytes but ${dest} is ${destSize} bytes`);
    process.exit(1);
  }
  console.log(`copied entry.png (${srcSize} bytes) to ${dest}`);
}
