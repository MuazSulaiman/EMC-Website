import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 8.6. Hard rule, not a style preference: the homepage stats
// component must never render an entry where `verified` is false. Enforce
// this at the getter level (getVerifiedStats in lib/content.ts), not just in
// component code, so a future component can't accidentally skip the filter.
export const statSchema = z.object({
  id: z.string(),
  label: localizedStringSchema,
  value: z.number().nullable(),
  verified: z.boolean(),
  displayIfUnverified: z.literal(false),
});

export type Stat = z.infer<typeof statSchema>;
