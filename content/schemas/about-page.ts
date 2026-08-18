import { z } from "zod";
import { localizedStringSchema } from "./common";

const leaderSchema = z.object({
  name: z.string(),
  title: localizedStringSchema,
  bio: localizedStringSchema,
});

// Section 9.2. One-off page body copy — see DECISIONS.md.
export const aboutPageSchema = z.object({
  intro: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
  }),
  whoWeAre: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  ourStory: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
  vision: localizedStringSchema,
  mission: localizedStringSchema,
  values: z.array(
    z.object({ name: localizedStringSchema, description: localizedStringSchema }),
  ),
  whyEmc: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    body: localizedStringSchema,
    pillars: z.array(
      z.object({
        icon: z.string(),
        title: localizedStringSchema,
        body: localizedStringSchema,
      }),
    ),
  }),
  leadership: z.array(leaderSchema),
  corporatePhilosophy: z.object({
    headline: localizedStringSchema,
    body: localizedStringSchema,
  }),
});

export type AboutPageContent = z.infer<typeof aboutPageSchema>;
