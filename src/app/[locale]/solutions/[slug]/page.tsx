import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  getSolution,
  getSolutions,
  getPartners,
  getProducts,
  getIndexPagesContent,
} from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { GradientMesh } from "@/components/sections/gradient-mesh";
import { CtaBand } from "@/components/sections/cta-band";
import { ProductCard } from "@/components/sections/product-card";
import { DemoRequestModal } from "@/components/layout/demo-request-modal";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) return {};
  return buildMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: pickLocale(solution.name, locale),
    description: truncateDescription(pickLocale(solution.shortDescription, locale)),
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const solution = await getSolution(slug);
  if (!solution) notFound();

  const [allPartners, allProducts, pageContent] = await Promise.all([
    getPartners(),
    getProducts(),
    getIndexPagesContent(),
  ]);
  const relatedPartners = allPartners.filter((partner) =>
    solution.relatedPartnerSlugs.includes(partner.slug),
  );
  const relatedProducts = allProducts.filter((product) =>
    solution.relatedProductSlugs.includes(product.slug),
  );
  const manufacturerBySlug = new Map(allPartners.map((p) => [p.slug, p]));

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const isExpanding = solution.status === "expanding";

  return (
    <>
      <PageBreadcrumb
        trail={[
          { label: t("nav.solutions"), href: "/solutions" },
          { label: l(solution.name) },
        ]}
      />

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
                <DynamicIcon name={solution.icon} className="size-6" aria-hidden="true" />
              </span>
              {isExpanding && (
                <Badge variant="secondary" className="text-emc-purple-700">
                  {t("common.comingSoon")}
                </Badge>
              )}
            </div>
            <h1 className="mt-4 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              {l(solution.name)}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {l(solution.shortDescription)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="xl" render={<Link href="/contact" />}>
                {t("cta.speakWithSpecialist")}
              </Button>
              {!isExpanding && (
                <DemoRequestModal
                  defaultInterest={l(solution.name)}
                  size="xl"
                  variant="outline"
                />
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <GradientMesh className="aspect-[4/3] w-full" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-muted-foreground">{l(solution.clinicalOverview)}</p>
        </Reveal>
      </section>

      {relatedPartners.length > 0 && (
        <section className="bg-emc-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {t("nav.partners")}
              </h2>
            </Reveal>
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {relatedPartners.map((partner, i) => (
                <Reveal
                  key={partner.slug}
                  delay={i * 0.06}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  {partner.logo && (
                    <div className="relative mb-4 h-10 w-32">
                      <Image
                        src={partner.logo.src}
                        alt={pickLocale(partner.logo.alt, locale)}
                        fill
                        sizes="128px"
                        className="object-contain object-left"
                      />
                    </div>
                  )}
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {l(partner.summary)}
                  </p>
                  <Link
                    href={`/partners/${partner.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-emc-teal-700 hover:underline"
                  >
                    {t("common.learnMore")}
                  </Link>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {!isExpanding && (
        <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {t("nav.products")}
            </h2>
          </Reveal>
          {relatedProducts.length > 0 ? (
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product, i) => (
                <Reveal key={product.slug} delay={i * 0.06}>
                  <ProductCard
                    product={product}
                    manufacturer={manufacturerBySlug.get(product.manufacturer)}
                  />
                </Reveal>
              ))}
            </RevealGroup>
          ) : (
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("common.comingSoon")}
            </p>
          )}
        </section>
      )}

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <CtaBand
          headline={l(pageContent.detailPageCta.headline)}
          body={l(pageContent.detailPageCta.body)}
        />
      </div>
    </>
  );
}
