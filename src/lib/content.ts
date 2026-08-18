import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";
import {
  solutionSchema,
  partnerSchema,
  customerSchema,
  productSchema,
  newsItemSchema,
  jobSchema,
  statSchema,
  testimonialSchema,
  homePageSchema,
  aboutPageSchema,
  indexPagesSchema,
  contactPageSchema,
  servicesPageSchema,
  careersPageSchema,
  legalPageSchema,
  type Solution,
  type Partner,
  type Customer,
  type Product,
  type NewsItem,
  type Job,
  type Stat,
  type Testimonial,
  type HomePageContent,
  type AboutPageContent,
  type IndexPagesContent,
  type ContactPageContent,
  type ServicesPageContent,
  type CareersPageContent,
  type LegalPageContent,
} from "../../content/schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function readDirAsJson<T>(
  dirName: string,
  schema: ZodType<T>,
): Promise<T[]> {
  const dirPath = path.join(CONTENT_ROOT, dirName);
  let files: string[];
  try {
    files = await readdir(dirPath);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const items = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(dirPath, file), "utf-8");
      return schema.parse(JSON.parse(raw));
    }),
  );
  return items;
}

async function readFileAsJson<T>(
  fileName: string,
  schema: ZodType<T>,
): Promise<T> {
  const raw = await readFile(path.join(CONTENT_ROOT, fileName), "utf-8");
  return schema.parse(JSON.parse(raw));
}

// ---- Solutions -----------------------------------------------------------

export async function getSolutions(): Promise<Solution[]> {
  return readDirAsJson("solutions", solutionSchema);
}

export async function getSolution(slug: string): Promise<Solution | undefined> {
  const solutions = await getSolutions();
  return solutions.find((solution) => solution.slug === slug);
}

// ---- Partners --------------------------------------------------------------

export async function getPartners(): Promise<Partner[]> {
  return readDirAsJson("partners", partnerSchema);
}

export async function getPartner(slug: string): Promise<Partner | undefined> {
  const partners = await getPartners();
  return partners.find((partner) => partner.slug === slug);
}

// ---- Customers ("Our Customers" band) --------------------------------------

export async function getCustomers(): Promise<Customer[]> {
  return readDirAsJson("customers", customerSchema);
}

// ---- Products --------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  return readDirAsJson("products", productSchema);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

// ---- Knowledge Center --------------------------------------------------------

export async function getNewsItems(): Promise<NewsItem[]> {
  const items = await readDirAsJson("news", newsItemSchema);
  return items.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}

export async function getNewsItem(slug: string): Promise<NewsItem | undefined> {
  const items = await getNewsItems();
  return items.find((item) => item.slug === slug);
}

// ---- Careers -----------------------------------------------------------------

export async function getJobs(): Promise<Job[]> {
  return readDirAsJson("jobs", jobSchema);
}

export async function getJob(slug: string): Promise<Job | undefined> {
  const jobs = await getJobs();
  return jobs.find((job) => job.slug === slug);
}

// ---- Stats (Section 8.6) ------------------------------------------------------

export async function getStats(): Promise<Stat[]> {
  return readFileAsJson("stats.json", statSchema.array());
}

/** Hard rule (Section 2.2, 8.6): never render a stat where verified is false. */
export async function getVerifiedStats(): Promise<Stat[]> {
  const stats = await getStats();
  return stats.filter((stat) => stat.verified);
}

// ---- Testimonials (Section 8.7) ------------------------------------------------

export async function getTestimonials(): Promise<Testimonial[]> {
  return readDirAsJson("testimonials", testimonialSchema);
}

// ---- One-off page copy (Home / About / Why EMC — see DECISIONS.md) ------------

export async function getHomePageContent(): Promise<HomePageContent> {
  return readFileAsJson("pages/home.json", homePageSchema);
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  return readFileAsJson("pages/about.json", aboutPageSchema);
}

export async function getIndexPagesContent(): Promise<IndexPagesContent> {
  return readFileAsJson("pages/index-pages.json", indexPagesSchema);
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  return readFileAsJson("pages/contact.json", contactPageSchema);
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  return readFileAsJson("pages/services.json", servicesPageSchema);
}

export async function getCareersPageContent(): Promise<CareersPageContent> {
  return readFileAsJson("pages/careers.json", careersPageSchema);
}

export type LegalSlug = "privacy-policy" | "terms-of-use" | "cookie-policy";

export async function getLegalPageContent(
  slug: LegalSlug,
): Promise<LegalPageContent> {
  return readFileAsJson(`pages/${slug}.json`, legalPageSchema);
}
