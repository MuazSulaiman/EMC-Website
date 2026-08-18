import { z } from "zod";
import { localizedStringSchema, mediaImageSchema } from "./common";

// Section 8.4. Single filterable Knowledge Center index, not six top-level
// page types (Section 7).
export const newsTypeSchema = z.enum([
  "article",
  "case-study",
  "white-paper",
  "news",
  "event",
  "workshop",
]);

export const newsItemSchema = z.object({
  slug: z.string(),
  type: newsTypeSchema,
  title: localizedStringSchema,
  publishDate: z.string(), // ISO date
  excerpt: localizedStringSchema,
  body: localizedStringSchema,
  coverImage: mediaImageSchema.optional(),
  relatedSolutionSlugs: z.array(z.string()).default([]),
  downloadUrl: z.string().optional(),
  eventDate: z.string().optional(),
  eventLocation: localizedStringSchema.optional(),
});

export type NewsItem = z.infer<typeof newsItemSchema>;
