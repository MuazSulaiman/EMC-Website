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
  // Supplier/manufacturer-facing pitch on the Partners index page — distinct
  // audience from partnersIndex.body (hospital/buyer-facing). See DECISIONS.md.
  partnerWithUs: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
    pillars: z.array(
      z.object({
        icon: z.string(),
        title: localizedStringSchema,
        body: localizedStringSchema,
      }),
    ),
  }),
});

export type IndexPagesContent = z.infer<typeof indexPagesSchema>;
