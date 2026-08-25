import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getIndexPagesContent, getPartners } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PartnerTile } from "@/components/sections/partner-tile";
import { PillarCard } from "@/components/sections/about/pillar-card";
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
        <RevealGroup className="flex flex-wrap justify-center gap-4">
          {partners.map((partner, i) => (
            <Reveal key={partner.slug} delay={i * 0.06}>
              <PartnerTile partner={partner} />
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-emc-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {l(content.partnerWithUs.eyebrow)}
            </p>
            <h2 className="mt-2 text-3xl font-heading font-bold text-foreground">
              {l(content.partnerWithUs.headline)}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {l(content.partnerWithUs.body)}
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.partnerWithUs.pillars.map((pillar, i) => (
              <PillarCard
                key={pillar.title.en}
                icon={pillar.icon}
                title={l(pillar.title)}
                body={l(pillar.body)}
                delay={i * 0.05}
              />
            ))}
          </RevealGroup>
        </div>
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
