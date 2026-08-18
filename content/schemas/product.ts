import { z } from "zod";
import {
  localizedStringSchema,
  mediaImageSchema,
  mediaVideoSchema,
} from "./common";

// Certificates require a source document reference per item (Section 8.3) —
// never rendered from a bare string, so a badge can't be shown without
// something to trace the claim back to.
export const certificateSchema = z.object({
  name: z.string(),
  sourceDocumentRef: z.string(),
});
export type Certificate = z.infer<typeof certificateSchema>;

const technicalSpecSchema = z.object({
  label: localizedStringSchema,
  value: localizedStringSchema,
});

// Section 8.3. `brochureUrl`, `ifuUrl`, and `certificates` are EMC-supplied;
// left optional/empty rather than defaulted so an absent brochure renders no
// download button instead of a broken link.
export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  manufacturer: z.string(), // ref Partner.slug
  businessUnit: z.string(),
  clinicalSpecialty: z.array(z.string()).default([]), // ref Solution.slug
  category: z.string(),
  family: z.string().optional(),
  model: z.string().optional(),
  shortDescription: localizedStringSchema,
  heroImage: mediaImageSchema.optional(),
  gallery: z.array(mediaImageSchema).default([]),
  clinicalApplications: localizedStringSchema,
  keyFeatures: z.array(localizedStringSchema).default([]),
  keyBenefits: z.array(localizedStringSchema).default([]),
  technicalSpecs: z.array(technicalSpecSchema).default([]),
  accessories: z.array(localizedStringSchema).default([]),
  compatibleProductSlugs: z.array(z.string()).default([]),
  brochureUrl: z.string().optional(),
  ifuUrl: z.string().optional(),
  certificates: z.array(certificateSchema).default([]),
  videos: z.array(mediaVideoSchema).default([]),
  relatedProductSlugs: z.array(z.string()).default([]),
});

export type Product = z.infer<typeof productSchema>;
