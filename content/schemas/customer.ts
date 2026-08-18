import { z } from "zod";

// "Our Customers" logo strip on the home page — same wordmark-over-logo-image
// precedent as PartnerTile (see partner.ts). content/customers/ currently
// ships clearly-marked placeholder entries until EMC supplies verified
// customer names/logos; never replace them with plausible-sounding fakes.
export const customerSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;
