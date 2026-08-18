// One-time asset build script — Section 6.5 of PROJECT_SPEC.md.
// Regenerate whenever a new source logo raster is supplied.
// Usage: node scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "reference/brand/emc-logo-original.png";
const LOGO_DIR = "public/media/logo";

async function run() {
  await mkdir(LOGO_DIR, { recursive: true });

  const meta = await sharp(SOURCE).metadata();
  const side = Math.max(meta.width, meta.height);

  // Pad the raster to a perfect square on a transparent canvas — no redrawing
  // or distortion of the mark itself (hard rule, Section 6).
  const squared = sharp(SOURCE).resize(side, side, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  const targets = [
    { file: "favicon-16x16.png", size: 16 },
    { file: "favicon-32x32.png", size: 32 },
    { file: "apple-touch-icon-180x180.png", size: 180 },
    { file: "icon-512x512.png", size: 512 },
  ];

  for (const { file, size } of targets) {
    await squared
      .clone()
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toFile(`${LOGO_DIR}/${file}`);
    console.log(`wrote ${LOGO_DIR}/${file}`);
  }

  // Next.js App Router auto-served icons.
  await squared
    .clone()
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile("src/app/icon.png");
  await squared
    .clone()
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile("src/app/apple-icon.png");
  console.log("wrote src/app/icon.png, src/app/apple-icon.png");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
