import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getIndexPagesContent, getSolutions } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { SolutionCard } from "@/components/sections/solution-card";
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
    path: "/solutions",
    title: t("solutions"),
    description: truncateDescription(pickLocale(content.solutionsIndex.body, locale)),
  });
}

export default async function SolutionsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const [content, solutions] = await Promise.all([
    getIndexPagesContent(),
    getSolutions(),
  ]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("solutions") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.solutionsIndex.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.solutionsIndex.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.solutionsIndex.body)}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <RevealGroup className="flex flex-wrap justify-center gap-5">
          {solutions.map((solution, i) => (
            <Reveal
              key={solution.slug}
              delay={i * 0.06}
              className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
            >
              <SolutionCard solution={solution} />
            </Reveal>
          ))}
        </RevealGroup>
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
