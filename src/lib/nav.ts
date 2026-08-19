// Primary IA — Section 7. Routes not built until later phases will 404
// until Phases 2–4 ship them (see DECISIONS.md); the nav follows the full
// sitemap now so the chrome doesn't need rework later.

export type NavItem = {
  labelKey: string;
  href: string;
  icon?: string;
};

export type MegaMenuGroup = {
  labelKey: string;
  href: string;
  items: NavItem[];
};

export const solutionsMenu: MegaMenuGroup = {
  labelKey: "nav.solutions",
  href: "/solutions",
  items: [
    { labelKey: "nav.solutionsMenu.anesthesiaAirwayManagement", href: "/solutions/anesthesia-airway-management", icon: "Syringe" },
    { labelKey: "nav.solutionsMenu.respiratoryCare", href: "/solutions/respiratory-care", icon: "AirVent" },
    { labelKey: "nav.solutionsMenu.criticalCare", href: "/solutions/critical-care", icon: "HeartPulse" },
    { labelKey: "nav.solutionsMenu.emergencyAccidental", href: "/solutions/emergency-accidental", icon: "Ambulance" },
    { labelKey: "nav.solutionsMenu.nursingGeneralConsumables", href: "/solutions/nursing-general-consumables", icon: "Bandage" },
  ],
};

// Reused by ProductCard (src/components/sections/product-card.tsx) to badge
// a product with its clinical specialty's icon — same source of truth as
// the mega-menu above, keyed by solution slug (the last path segment of
// each item's href).
export const solutionIcons: Record<string, string> = Object.fromEntries(
  solutionsMenu.items.map((item) => [item.href.split("/").pop()!, item.icon!]),
);

export const partnersMenu: MegaMenuGroup = {
  labelKey: "nav.partners",
  href: "/partners",
  items: [
    { labelKey: "nav.partnersMenu.ueMedical", href: "/partners/ue-medical" },
    { labelKey: "nav.partnersMenu.longLifeSurgical", href: "/partners/long-life-surgical-industries" },
    { labelKey: "nav.partnersMenu.frestems", href: "/partners/frestems" },
    { labelKey: "nav.partnersMenu.ameco", href: "/partners/ameco-technology" },
  ],
};

export const primaryNav: NavItem[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.knowledgeCenter", href: "/knowledge-center" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.careers", href: "/careers" },
  { labelKey: "nav.contact", href: "/contact" },
];

export const footerLegalLinks: NavItem[] = [
  { labelKey: "footer.privacyPolicy", href: "/privacy-policy" },
  { labelKey: "footer.termsOfUse", href: "/terms-of-use" },
  { labelKey: "footer.cookiePolicy", href: "/cookie-policy" },
];
