import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import {
  getPartner,
  getPartners,
  getSolutions,
  getProducts,
  getIndexPagesContent,
} from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { GradientMesh } from "@/components/sections/gradient-mesh";
import { CtaBand } from "@/components/sections/cta-band";
import { ProductCard } from "@/components/sections/product-card";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const partners = await getPartners();
  return partners.map((partner) => ({ slug: partner.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) return {};
  return buildMetadata({
    locale,
    path: `/partners/${slug}`,
    title: partner.name,
    description: truncateDescription(pickLocale(partner.summary, locale)),
  });
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const partner = await getPartner(slug);
  if (!partner) notFound();

  const [allSolutions, allProducts, pageContent] = await Promise.all([
    getSolutions(),
    getProducts(),
    getIndexPagesContent(),
  ]);
  const relatedSolutions = allSolutions.filter((solution) =>
    partner.clinicalAreas.includes(solution.slug),
  );
  const featuredProducts = allProducts.filter((product) =>
    partner.featuredProductSlugs.includes(product.slug),
  );

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const metaLine = [
    partner.country,
    partner.foundedYear
      ? `${t("partners.establishedLabel")} ${partner.foundedYear}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageBreadcrumb
        trail={[
          { label: t("nav.partners"), href: "/partners" },
          { label: partner.name },
        ]}
      />

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            {metaLine && (
              <p className="ltr-embed inline-block text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
                {metaLine}
              </p>
            )}
            <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              {partner.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {l(partner.summary)}
            </p>
            {partner.externalWebsite && (
              <a
                href={partner.externalWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emc-teal-700 hover:underline"
              >
                {partner.name}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <GradientMesh className="aspect-[4/3] w-full">
              <span className="px-6 text-center font-heading text-3xl font-bold text-white/90 sm:text-4xl">
                {partner.name}
              </span>
            </GradientMesh>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {t("nav.whyEmc")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {l(partner.technologyExpertise)}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 rounded-2xl border border-border bg-emc-teal-100 p-5">
          <p className="text-sm font-medium text-emc-purple-900">
            {l(partner.relationshipStatement)}
          </p>
        </Reveal>

        {relatedSolutions.length > 0 && (
          <Reveal delay={0.15} className="mt-10">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {t("nav.solutions")}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedSolutions.map((solution) => (
                <Badge
                  key={solution.slug}
                  variant="secondary"
                  render={<Link href={`/solutions/${solution.slug}`} />}
                >
                  {l(solution.name)}
                </Badge>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.2} className="mt-10">
          <h3 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {t("nav.products")}
          </h3>
        </Reveal>
        {featuredProducts.length > 0 ? (
          <RevealGroup className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.slug} delay={0.05 * i}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-3 text-muted-foreground">{t("common.comingSoon")}</p>
        )}
      </section>

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <CtaBand
          headline={l(pageContent.detailPageCta.headline)}
          body={l(pageContent.detailPageCta.body)}
        />
      </div>
    </>
  );
}
