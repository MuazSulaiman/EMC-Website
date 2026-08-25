import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  getHomePageContent,
  getAboutPageContent,
  getSolutions,
  getPartners,
  getCustomers,
  getVerifiedStats,
  getNewsItems,
  getTestimonials,
} from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Hero } from "@/components/sections/home/hero";
import { TrustBand } from "@/components/sections/home/trust-band";
import { SolutionsGrid } from "@/components/sections/home/solutions-grid";
import { FeaturedTechnology } from "@/components/sections/home/featured-technology";
import { PartnersBand } from "@/components/sections/home/partners-band";
import { CustomersBand } from "@/components/sections/home/customers-band";
import { WhyEmcTeaser } from "@/components/sections/home/why-emc-teaser";
import { StatsBand } from "@/components/sections/home/stats-band";
import { KnowledgeCenterPreview } from "@/components/sections/home/knowledge-center-preview";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
import { CtaBand } from "@/components/sections/cta-band";
import { buildMetadata, buildOrganizationJsonLd, JsonLd, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getHomePageContent();
  return buildMetadata({
    locale,
    path: "/",
    title: "Excellence Medical Care (EMC)",
    description: truncateDescription(pickLocale(content.hero.subhead, locale)),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    content,
    aboutContent,
    solutions,
    partners,
    customers,
    verifiedStats,
    newsItems,
    testimonials,
  ] = await Promise.all([
    getHomePageContent(),
    getAboutPageContent(),
    getSolutions(),
    getPartners(),
    getCustomers(),
    getVerifiedStats(),
    getNewsItems(),
    getTestimonials(),
  ]);

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(locale)} />
      <Hero
        eyebrow={l(content.hero.eyebrow)}
        headline={l(content.hero.headline)}
        subhead={l(content.hero.subhead)}
        imageAlt={l(content.hero.imageAlt)}
      />

      <TrustBand headline={l(content.trustBand.headline)} />

      <SolutionsGrid
        eyebrow={l(content.solutionsGrid.eyebrow)}
        headline={l(content.solutionsGrid.headline)}
        solutions={solutions}
      />

      <FeaturedTechnology
        eyebrow={l(content.featuredTechnology.eyebrow)}
        headline={l(content.featuredTechnology.headline)}
        body={l(content.featuredTechnology.body)}
        imageAlt={l(content.featuredTechnology.imageAlt)}
        facts={content.featuredTechnology.facts.map((fact) => ({
          label: l(fact.label),
          value: fact.value,
          suffix: l(fact.suffix),
        }))}
      />

      <PartnersBand
        eyebrow={l(content.partnersBand.eyebrow)}
        headline={l(content.partnersBand.headline)}
        body={l(content.partnersBand.body)}
        partners={partners}
      />

      <CustomersBand
        eyebrow={l(content.customersBand.eyebrow)}
        headline={l(content.customersBand.headline)}
        body={l(content.customersBand.body)}
        customers={customers}
      />

      <WhyEmcTeaser
        eyebrow={l(content.whyEmcTeaser.eyebrow)}
        headline={l(content.whyEmcTeaser.headline)}
        body={l(content.whyEmcTeaser.body)}
        pillars={aboutContent.whyEmc.pillars.map((pillar) => ({
          icon: pillar.icon,
          title: l(pillar.title),
          body: l(pillar.body),
        }))}
      />

      <StatsBand stats={verifiedStats} />

      <KnowledgeCenterPreview items={newsItems} />

      <TestimonialsSection testimonials={testimonials} />

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <CtaBand
          headline={l(content.finalCta.headline)}
          body={l(content.finalCta.body)}
        />
      </div>
    </>
  );
}
