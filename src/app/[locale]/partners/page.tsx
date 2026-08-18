import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getIndexPagesContent, getPartners } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PartnerTile } from "@/components/sections/partner-tile";
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
    path: "/partners",
    title: t("partners"),
    description: truncateDescription(pickLocale(content.partnersIndex.body, locale)),
  });
}

export default async function PartnersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const [content, partners] = await Promise.all([
    getIndexPagesContent(),
    getPartners(),
  ]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("partners") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.partnersIndex.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.partnersIndex.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.partnersIndex.body)}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {partners.map((partner, i) => (
            <Reveal key={partner.slug} delay={i * 0.06}>
              <PartnerTile partner={partner} />
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
