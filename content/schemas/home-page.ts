import { z } from "zod";
import { localizedStringSchema } from "./common";

// One-off page body copy, not a Section 8 model — see DECISIONS.md
// ("Home/About/Why EMC page copy needed a content model of its own").
export const homePageSchema = z.object({
  hero: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    subhead: localizedStringSchema,
    imageAlt: localizedStringSchema,
  }),
  trustBand: z.object({
    headline: localizedStringSchema,
  }),
  solutionsGrid: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
  }),
  featuredTechnology: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
    imageAlt: localizedStringSchema,
    facts: z.array(
      z.object({
        label: localizedStringSchema,
        value: z.number(),
        suffix: localizedStringSchema,
      }),
    ),
  }),
  partnersBand: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  customersBand: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  whyEmcTeaser: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  finalCta: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
});

export type HomePageContent = z.infer<typeof homePageSchema>;
