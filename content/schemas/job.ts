import { z } from "zod";
import { localizedStringSchema } from "./common";

// Section 8.5.
export const jobSchema = z.object({
  slug: z.string(),
  title: localizedStringSchema,
  department: z.string(),
  location: z.string(),
  employmentType: z.string(),
  description: localizedStringSchema,
  applyVia: z.enum(["form", "linkedin"]),
  linkedinUrl: z.string().url().optional(),
});

export type Job = z.infer<typeof jobSchema>;
