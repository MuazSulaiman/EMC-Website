import { z } from "zod";

// Section 8.8. Shared client/server validation for the four lead-gen forms.
// Wiring to Resend + durable storage is Phase 5 (Section 16) — these
// schemas exist now so the Request Demo modal and Contact page can validate
// against the real shape from day one instead of a Phase-5 rewrite.

// An empty text/url input submits "" via react-hook-form, not undefined —
// without this, z.string().url().optional() would reject a left-blank
// optional field as an invalid URL instead of treating it as not provided.
// (Written as .refine rather than z.preprocess so the resolver's inferred
// input/output types stay `string | undefined` instead of `unknown`.)
const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || z.string().url().safeParse(v).success, {
    message: "Enter a valid URL",
  });

export const demoRequestSchema = z.object({
  fullName: z.string().min(1),
  organization: z.string().min(1),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
  email: z.string().email(),
  mobile: z.string().min(1),
  productOrSolutionOfInterest: z.string().min(1),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  message: z.string().optional(),
});
export type DemoRequestPayload = z.infer<typeof demoRequestSchema>;

export const quotationRequestSchema = z.object({
  organization: z.string().min(1),
  contactPerson: z.string().min(1),
  department: z.string().optional(),
  product: z.string().min(1),
  quantity: z.number().positive(),
  city: z.string().optional(),
  procurementType: z.enum(["tender", "direct"]),
  message: z.string().optional(),
});
export type QuotationRequestPayload = z.infer<typeof quotationRequestSchema>;

export const contactInquiryTypeSchema = z.enum([
  "general",
  "sales",
  "technical-support",
  "demo-request",
]);

export const contactSchema = z.object({
  inquiryType: contactInquiryTypeSchema,
  name: z.string().min(1),
  organization: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().min(1),
});
export type ContactPayload = z.infer<typeof contactSchema>;

export const careersApplicationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  position: z.string().optional(), // defaults to "General interest" server-side when omitted
  cvUpload: z.string().optional(), // storage reference, populated server-side
  linkedinUrl: optionalUrl,
});
export type CareersApplicationPayload = z.infer<
  typeof careersApplicationSchema
>;
