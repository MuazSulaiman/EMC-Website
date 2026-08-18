// Verified facts only — Section 2.1 of PROJECT_SPEC.md.
// Never add a field here from anything that isn't independently confirmed.
export const siteConfig = {
  legalName: "Excellence Medical Care Ltd.",
  tradingName: "EMC",
  established: 2013,
  address: {
    line: "PO Box 9397, King Fahd Road",
    city: "Dammam",
    country: "Saudi Arabia",
  },
  phone: "+966 13 833 5536",
  // wa.me requires digits only, no leading +. This is EMC's one verified
  // phone number; it's formatted as a landline (area code 13), not
  // confirmed WhatsApp-reachable — see DECISIONS.md.
  whatsappNumber: "966138335536",
  email: "info@tamiozmed.com",
  social: {
    twitter: "https://x.com/tamiozmed",
    instagram: "https://instagram.com/tamiozmed1",
  },
  ceo: "Moosa Almoosa",
} as const;
