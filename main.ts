// news-image-20261121 — entrypoint (node22, stdlib only).
// Copies entry.png into the grader's output directory and verifies each copy
// is byte-for-byte identical (SHA-256 of source vs destination); fails
// loudly on any mismatch, so a truncated or corrupted copy never passes.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
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

const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const srcSize = statSync(src).size;
const srcHash = sha256(src);
for (const dest of targets) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  const destSize = statSync(dest).size;
  const destHash = sha256(dest);
  if (destSize !== srcSize || destHash !== srcHash) {
    console.error(`copy mismatch: ${src} is ${srcSize} bytes sha256 ${srcHash} but ${dest} is ${destSize} bytes sha256 ${destHash}`);
    process.exit(1);
  }
  console.log(`copied entry.png (${srcSize} bytes, sha256 ${srcHash}) to ${dest}`);
}
