import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import {
  getProduct,
  getProducts,
  getPartner,
  getIndexPagesContent,
} from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientMesh } from "@/components/sections/gradient-mesh";
import { CtaBand } from "@/components/sections/cta-band";
import { ProductCard } from "@/components/sections/product-card";
import { TechSpecsTable } from "@/components/sections/products/tech-specs";
import { ProductVideo } from "@/components/sections/products/product-video";
import { DemoRequestModal } from "@/components/layout/demo-request-modal";
import { QuotationRequestModal } from "@/components/layout/quotation-request-modal";
import { buildMetadata, buildProductJsonLd, JsonLd, truncateDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.name,
    description: truncateDescription(pickLocale(product.shortDescription, locale)),
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const product = await getProduct(slug);
  if (!product) notFound();

  const [manufacturer, allProducts, pageContent] = await Promise.all([
    getPartner(product.manufacturer),
    getProducts(),
    getIndexPagesContent(),
  ]);
  const relatedProducts = allProducts.filter((p) =>
    product.relatedProductSlugs.includes(p.slug),
  );

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const hasDownloads = Boolean(product.brochureUrl || product.ifuUrl);

  return (
    <>
      <JsonLd
        data={buildProductJsonLd({
          name: product.name,
          description: l(product.shortDescription),
          manufacturerName: manufacturer?.name,
          locale,
          slug: product.slug,
        })}
      />
      <PageBreadcrumb
        trail={[
          { label: t("nav.products"), href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            {manufacturer && (
              <Link
                href={`/partners/${manufacturer.slug}`}
                className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase hover:underline"
              >
                {manufacturer.name}
              </Link>
            )}
            <h1 className="mt-2 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {l(product.shortDescription)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoRequestModal defaultInterest={product.name} size="xl" />
              <QuotationRequestModal defaultProduct={product.name} variant="outline" />
              <Button size="xl" variant="outline" render={<Link href="/contact" />}>
                {t("cta.speakWithSpecialist")}
              </Button>
              {product.brochureUrl && (
                <Button
                  size="xl"
                  variant="ghost"
                  render={<a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" />}
                >
                  <FileDown aria-hidden="true" />
                  {t("cta.downloadBrochure")}
                </Button>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            {product.heroImage ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card">
                <Image
                  src={product.heroImage.src}
                  alt={l(product.heroImage.alt)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-contain p-6"
                />
              </div>
            ) : (
              <GradientMesh className="aspect-[4/3] w-full" />
            )}
          </Reveal>
        </div>
      </section>

      {product.gallery.length > 0 && (
        <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.gallery")}
            </h2>
          </Reveal>
          <RevealGroup className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.gallery.map((image, i) => (
              <Reveal key={image.src} delay={i * 0.05}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
                  <Image
                    src={image.src}
                    alt={l(image.alt)}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-contain p-3"
                  />
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </section>
      )}

      {product.videos.length > 0 && (
        <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.videos")}
            </h2>
          </Reveal>
          <RevealGroup className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {product.videos.map((video, i) => (
              <Reveal key={video.src} delay={i * 0.05}>
                <ProductVideo src={video.src} caption={video.caption && l(video.caption)} />
              </Reveal>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {t("common.overview")}
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">{t("products.category")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{product.category}</dd>
            </div>
            {product.family && (
              <div>
                <dt className="text-xs text-muted-foreground">{t("products.family")}</dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{product.family}</dd>
              </div>
            )}
            {product.model && (
              <div>
                <dt className="text-xs text-muted-foreground">{t("products.model")}</dt>
                <dd className="ltr-embed mt-0.5 text-sm font-medium text-foreground">{product.model}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted-foreground">{t("products.businessUnit")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{product.businessUnit}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {t("products.clinicalApplications")}
          </h2>
          <p className="mt-3 text-muted-foreground">{l(product.clinicalApplications)}</p>
        </Reveal>

        {product.keyBenefits.length > 0 && (
          <Reveal delay={0.1} className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.keyBenefits")}
            </h2>
            <ul className="mt-3 space-y-2">
              {product.keyBenefits.map((benefit) => (
                <li key={l(benefit)} className="flex gap-2 text-muted-foreground">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emc-teal-500" />
                  {l(benefit)}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {product.keyFeatures.length > 0 && (
          <Reveal delay={0.15} className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.features")}
            </h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.keyFeatures.map((feature) => (
                <li key={l(feature)} className="flex gap-2 text-muted-foreground">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emc-purple-500" />
                  {l(feature)}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {product.technicalSpecs.length > 0 && (
          <Reveal delay={0.2} className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.technicalSpecs")}
            </h2>
            <div className="mt-3">
              <TechSpecsTable specs={product.technicalSpecs} />
            </div>
          </Reveal>
        )}

        {product.certificates.length > 0 && (
          <Reveal delay={0.25} className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.certificates")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.certificates.map((cert) => (
                <Badge key={cert.name} variant="secondary" className="text-emc-purple-700">
                  {cert.name}
                </Badge>
              ))}
            </div>
          </Reveal>
        )}

        {hasDownloads && (
          <Reveal delay={0.3} className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("products.downloads")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.brochureUrl && (
                <Button variant="outline" render={<a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" />}>
                  <FileDown aria-hidden="true" />
                  {t("cta.downloadBrochure")}
                </Button>
              )}
              {product.ifuUrl && (
                <Button variant="outline" render={<a href={product.ifuUrl} target="_blank" rel="noopener noreferrer" />}>
                  <FileDown aria-hidden="true" />
                  {t("products.ifu")}
                </Button>
              )}
            </div>
          </Reveal>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-emc-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {t("products.relatedProducts")}
              </h2>
            </Reveal>
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related, i) => (
                <Reveal key={related.slug} delay={i * 0.06}>
                  <ProductCard product={related} />
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {manufacturer && (
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal className="rounded-2xl border border-border bg-card p-6">
            <span className="text-xs font-semibold tracking-wide text-emc-teal-700 uppercase">
              {t("products.manufacturedBy")}
            </span>
            <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
              {manufacturer.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {l(manufacturer.summary)}
            </p>
            <Link
              href={`/partners/${manufacturer.slug}`}
              className="mt-4 inline-block text-sm font-medium text-emc-teal-700 hover:underline"
            >
              {t("common.learnMore")}
            </Link>
          </Reveal>
        </section>
      )}

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <CtaBand
          headline={l(pageContent.detailPageCta.headline)}
          body={l(pageContent.detailPageCta.body)}
          defaultProduct={product.name}
        />
      </div>
    </>
  );
}
