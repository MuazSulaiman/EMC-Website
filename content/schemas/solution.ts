import { z } from "zod";
import { localizedStringSchema, mediaImageSchema } from "./common";

// Section 8.1. `status` is not enumerated in the spec's field list but is
// required to implement Section 9.3's "portfolio expanding" state for
// Critical Care / Respiratory Care without fabricating content — see
// DECISIONS.md.
export const solutionSchema = z.object({
  slug: z.string(),
  name: localizedStringSchema,
  shortDescription: localizedStringSchema,
  heroImage: mediaImageSchema.optional(),
  clinicalOverview: localizedStringSchema,
  relatedProductSlugs: z.array(z.string()).default([]),
  relatedPartnerSlugs: z.array(z.string()).default([]),
  icon: z.string(),
  status: z.enum(["active", "expanding"]).default("active"),
});

export type Solution = z.infer<typeof solutionSchema>;
