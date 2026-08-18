import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 9.9. Culture section is a generic reframing of the 5 values
// already verified on the About page (Section 2.1 PDF) — never invented
// perks (free lunch, unlimited PTO, etc. aren't sourced anywhere).
export const careersPageSchema = z.object({
  intro: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  culture: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
    values: z.array(
      z.object({ name: localizedStringSchema, description: localizedStringSchema }),
    ),
  }),
});

export type CareersPageContent = z.infer<typeof careersPageSchema>;
