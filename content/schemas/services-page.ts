import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 9.7. `ctaType` drives the Contact-page prefill for the 2 services
// the spec calls out ("Technical Support" / "Tender Support") — see
// DECISIONS.md for how "Tender Support" maps onto Contact's 4 fixed
// inquiry types (Section 9.10 has no literal tender option).
export const servicesPageSchema = z.object({
  intro: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  services: z.array(
    z.object({
      icon: z.string(),
      title: localizedStringSchema,
      description: localizedStringSchema,
      ctaType: z.enum(["technical-support", "tender-support"]).optional(),
    }),
  ),
});

export type ServicesPageContent = z.infer<typeof servicesPageSchema>;
