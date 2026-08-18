// Content cross-reference integrity check.
//
// Every relationship between solutions/partners/products in content/ is a
// plain string slug (no database, no foreign keys — see content/README.md).
// Zod validates each JSON file's shape independently, but nothing catches a
// typo'd slug that simply doesn't match any file in the target collection —
// the referencing page just silently renders without that item. This script
// checks every cross-reference field against the actual slugs on disk.
//
// Usage: node scripts/validate-content-refs.mjs
// Runs automatically before `npm run build` via the `prebuild` script.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function readCollection(dirName) {
  const dirPath = path.join(CONTENT_ROOT, dirName);
  let files;
  try {
    files = await readdir(dirPath);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  return Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(dirPath, file), "utf-8");
      return { file: `${dirName}/${file}`, data: JSON.parse(raw) };
    }),
  );
}

function checkRefs(entries, field, getRefs, targetSlugs, targetCollection, errors) {
  for (const { file, data } of entries) {
    const refs = getRefs(data);
    for (const ref of refs) {
      if (ref && !targetSlugs.has(ref)) {
        errors.push(
          `${file}: ${field} references "${ref}", which does not match any slug in content/${targetCollection}/`,
        );
      }
    }
  }
}

async function run() {
  const [solutions, partners, products] = await Promise.all([
    readCollection("solutions"),
    readCollection("partners"),
    readCollection("products"),
  ]);

  const solutionSlugs = new Set(solutions.map((s) => s.data.slug));
  const partnerSlugs = new Set(partners.map((p) => p.data.slug));
  const productSlugs = new Set(products.map((p) => p.data.slug));

  const errors = [];

  // Solution -> Product / Partner
  checkRefs(solutions, "relatedProductSlugs", (d) => d.relatedProductSlugs ?? [], productSlugs, "products", errors);
  checkRefs(solutions, "relatedPartnerSlugs", (d) => d.relatedPartnerSlugs ?? [], partnerSlugs, "partners", errors);

  // Partner -> Product / Solution
  checkRefs(partners, "featuredProductSlugs", (d) => d.featuredProductSlugs ?? [], productSlugs, "products", errors);
  checkRefs(partners, "clinicalAreas", (d) => d.clinicalAreas ?? [], solutionSlugs, "solutions", errors);

  // Product -> Partner / Solution / Product
  checkRefs(products, "manufacturer", (d) => [d.manufacturer], partnerSlugs, "partners", errors);
  checkRefs(products, "clinicalSpecialty", (d) => d.clinicalSpecialty ?? [], solutionSlugs, "solutions", errors);
  checkRefs(products, "relatedProductSlugs", (d) => d.relatedProductSlugs ?? [], productSlugs, "products", errors);
  checkRefs(products, "compatibleProductSlugs", (d) => d.compatibleProductSlugs ?? [], productSlugs, "products", errors);

  if (errors.length > 0) {
    console.error(`Content reference check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n`);
    for (const error of errors) console.error(`  - ${error}`);
    console.error("\nFix the slug(s) above, or add the missing file, before building.");
    process.exit(1);
  }

  console.log(
    `Content references OK (${solutionSlugs.size} solutions, ${partnerSlugs.size} partners, ${productSlugs.size} products checked).`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
