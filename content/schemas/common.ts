import { z } from "zod";

// Every content-model text field is an {en, ar} pair — two native drafts,
// never a single field with runtime translation (Section 10).
export const localizedStringSchema = z.object({
  en: z.string(),
  ar: z.string(),
});
export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const mediaImageSchema = z.object({
  src: z.string(),
  // Alt text describes the device/subject, not "product photo" (Section 13).
  alt: localizedStringSchema,
  width: z.number().optional(),
  height: z.number().optional(),
});
export type MediaImage = z.infer<typeof mediaImageSchema>;

export const mediaVideoSchema = z.object({
  src: z.string(),
  caption: localizedStringSchema.optional(),
});
export type MediaVideo = z.infer<typeof mediaVideoSchema>;
