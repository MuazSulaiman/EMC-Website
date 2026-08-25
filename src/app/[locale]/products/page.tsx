import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getIndexPagesContent, getProducts, getSolutions, getPartners } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { ProductCatalog } from "@/components/sections/products/product-catalog";
import { CtaBand } from "@/components/sections/cta-band";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const content = await getIndexPagesContent();
  return buildMetadata({
    locale,
    path: "/products",
    title: t("products"),
    description: truncateDescription(pickLocale(content.productsIndex.body, locale)),
  });
}

export default async function ProductsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const [content, products, solutions, partners] = await Promise.all([
    getIndexPagesContent(),
    getProducts(),
    getSolutions(),
    getPartners(),
  ]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("products") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.productsIndex.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.productsIndex.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.productsIndex.body)}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ProductCatalog products={products} solutions={solutions} partners={partners} />
      </section>

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <CtaBand
          headline={l(content.detailPageCta.headline)}
          body={l(content.detailPageCta.body)}
        />
      </div>
    </>
  );
}
