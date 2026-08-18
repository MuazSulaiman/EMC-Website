import { z } from "zod";
import { localizedStringSchema, mediaImageSchema } from "./common";

// Section 8.2. `foundedYear` and `externalWebsite` are EMC-supplied — left
// optional rather than defaulted. `relationshipStatement` must never claim
// exclusivity unless EMC confirms it; the default copy is the spec's own
// fallback sentence, supplied per-locale so nothing falls back to a single
// untranslated string. `country` is optional though the spec's field list
// doesn't mark it so — Section 2.1 only verifies country for 2 of the 5
// partners (UE Medical: China, BeneCare Medical: UK); making it required
// would force fabricating a country for the other 3 (see DECISIONS.md).
export const partnerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  logo: mediaImageSchema.optional(),
  country: z.string().optional(),
  foundedYear: z.number().optional(),
  summary: localizedStringSchema,
  technologyExpertise: localizedStringSchema,
  relationshipStatement: localizedStringSchema.default({
    en: "Represented in Saudi Arabia by Excellence Medical Care.",
    ar: "ممثلة في المملكة العربية السعودية من قبل شركة إكسلنس ميديكال كير.",
  }),
  clinicalAreas: z.array(z.string()).default([]),
  featuredProductSlugs: z.array(z.string()).default([]),
  externalWebsite: z.string().url().optional(),
});

export type Partner = z.infer<typeof partnerSchema>;
