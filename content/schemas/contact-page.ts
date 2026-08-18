import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 9.10. `workingHours` is explicitly a placeholder pending EMC
// confirmation — `workingHoursVerified` stays a literal false until EMC
// supplies the real hours, mirroring the stats.json pattern (Section 8.6)
// even though this field renders (flagged), unlike an unverified stat.
export const contactPageSchema = z.object({
  intro: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  workingHours: localizedStringSchema,
  workingHoursVerified: z.literal(false),
});

export type ContactPageContent = z.infer<typeof contactPageSchema>;
