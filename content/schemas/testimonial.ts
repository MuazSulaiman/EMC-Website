import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 8.7. `verified` is a literal `true` — there is no false state to
// model, because an unverified testimonial must never be authored at all
// (Section 2.2: never write placeholder testimonials with fake names).
export const testimonialSchema = z.object({
  quote: localizedStringSchema,
  author: z.string(),
  title: z.string(),
  organization: z.string(),
  verified: z.literal(true),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
