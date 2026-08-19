import { z } from "zod";
import { mediaImageSchema } from "./common";

// "Our Customers" logo strip on the home page — same wordmark-over-logo-image
// precedent as PartnerTile (see partner.ts). `logo` is optional: where a
// real, verifiable official logo couldn't be sourced for an entity,
// CustomerTile falls back to the text-wordmark treatment rather than
// guessing at an asset. Never replace an entry with a plausible-sounding
// fake name or logo.
export const customerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  logo: mediaImageSchema.optional(),
});

export type Customer = z.infer<typeof customerSchema>;
