import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 9.11: generic, non-fabricated legal structure — flagged for EMC
// legal review before launch (see DECISIONS.md). Same shape reused for
// Privacy Policy, Terms of Use, and Cookie Policy.
export const legalPageSchema = z.object({
  headline: localizedStringSchema,
  lastUpdated: z.string(), // ISO date
  intro: localizedStringSchema,
  sections: z.array(
    z.object({
      title: localizedStringSchema,
      body: localizedStringSchema,
    }),
  ),
});

export type LegalPageContent = z.infer<typeof legalPageSchema>;
