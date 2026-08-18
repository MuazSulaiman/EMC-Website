import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import {
  getSolutions,
  getProducts,
  getPartners,
  getJobs,
  getNewsItems,
} from "@/lib/content";

const STATIC_PATHS = [
  "/",
  "/about",
  "/solutions",
  "/products",
  "/partners",
  "/services",
  "/knowledge-center",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/cookie-policy",
];

function entry(path: string): MetadataRoute.Sitemap[number] {
  const clean = path === "/" ? "" : path;
  return {
    url: `${SITE_URL}/${routing.defaultLocale}${clean}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${clean}`]),
      ),
    },
  };
}

/** Section 12: sitemap enumerating every static and content-driven route, both locales via alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, products, partners, jobs, newsItems] = await Promise.all([
    getSolutions(),
    getProducts(),
    getPartners(),
    getJobs(),
    getNewsItems(),
  ]);

  const dynamicPaths = [
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
    ...partners.map((p) => `/partners/${p.slug}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
    ...newsItems.map((n) => `/knowledge-center/${n.slug}`),
  ];

  return [...STATIC_PATHS, ...dynamicPaths].map(entry);
}
