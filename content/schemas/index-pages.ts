import { z } from "zod";
import { localizedStringSchema } from "./common";

const introSchema = z.object({
  eyebrow: localizedStringSchema,
  headline: localizedStringSchema,
  body: localizedStringSchema,
});

// Intro copy for the Solutions and Partners index pages (Section 9.3, 9.5).
// Same one-off page-copy pattern as home/about — see DECISIONS.md.
export const indexPagesSchema = z.object({
  solutionsIndex: introSchema,
  partnersIndex: introSchema,
  productsIndex: introSchema,
  knowledgeCenterIndex: introSchema,
  // Shared closing CTA reused across every solution/partner detail page —
  // avoids repeating the same headline/body in all 11 content files.
  detailPageCta: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
});

export type IndexPagesContent = z.infer<typeof indexPagesSchema>;
