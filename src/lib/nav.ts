// Primary IA — Section 7. Routes not built until later phases will 404
// until Phases 2–4 ship them (see DECISIONS.md); the nav follows the full
// sitemap now so the chrome doesn't need rework later.

export type NavItem = {
  labelKey: string;
  href: string;
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
    { labelKey: "nav.solutionsMenu.airwayManagement", href: "/solutions/airway-management" },
    { labelKey: "nav.solutionsMenu.anesthesia", href: "/solutions/anesthesia" },
    { labelKey: "nav.solutionsMenu.criticalCare", href: "/solutions/critical-care" },
    { labelKey: "nav.solutionsMenu.respiratoryCare", href: "/solutions/respiratory-care" },
    { labelKey: "nav.solutionsMenu.orthopedics", href: "/solutions/orthopedics" },
    { labelKey: "nav.solutionsMenu.infectionControl", href: "/solutions/infection-control" },
  ],
};

export const partnersMenu: MegaMenuGroup = {
  labelKey: "nav.partners",
  href: "/partners",
  items: [
    { labelKey: "nav.partnersMenu.ueMedical", href: "/partners/ue-medical" },
    { labelKey: "nav.partnersMenu.oxyPharm", href: "/partners/oxy-pharm" },
    { labelKey: "nav.partnersMenu.longLifeSurgical", href: "/partners/long-life-surgical-industries" },
    { labelKey: "nav.partnersMenu.beneCareMedical", href: "/partners/benecare-medical" },
    { labelKey: "nav.partnersMenu.ortholand", href: "/partners/ortholand" },
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
