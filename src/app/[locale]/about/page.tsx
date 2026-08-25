import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getAboutPageContent } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { GradientMesh } from "@/components/sections/gradient-mesh";
import { ValueCard } from "@/components/sections/about/value-card";
import { PillarCard } from "@/components/sections/about/pillar-card";
import { LeaderCard } from "@/components/sections/about/leader-card";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const content = await getAboutPageContent();
  return buildMetadata({
    locale,
    path: "/about",
    title: t("about"),
    description: truncateDescription(pickLocale(content.whoWeAre.body, locale)),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const content = await getAboutPageContent();
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const tAbout = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("about") }]} />

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {l(content.intro.eyebrow)}
            </p>
            <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              {l(content.intro.headline)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <GradientMesh className="aspect-[4/3] w-full" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {l(content.whoWeAre.headline)}
          </h2>
          <p className="mt-4 text-muted-foreground">{l(content.whoWeAre.body)}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {l(content.ourStory.headline)}
          </h2>
          <p className="mt-4 text-muted-foreground">{l(content.ourStory.body)}</p>
        </Reveal>
      </section>

      <section className="bg-emc-gray-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl 2xl:max-w-[96rem] gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          <Reveal className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {tAbout("vision")}
            </h3>
            <p className="mt-3 text-lg font-heading font-medium text-foreground">
              {l(content.vision)}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {tAbout("mission")}
            </h3>
            <p className="mt-3 text-lg font-heading font-medium text-foreground">
              {l(content.mission)}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <h2 className="text-center text-3xl font-heading font-bold text-foreground">
            {tAbout("coreValues")}
          </h2>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {content.values.map((value, i) => (
            <ValueCard
              key={value.name.en}
              name={l(value.name)}
              description={l(value.description)}
              delay={i * 0.06}
            />
          ))}
        </RevealGroup>
      </section>

      <section id="why-emc" className="bg-emc-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {l(content.whyEmc.eyebrow)}
            </p>
            <h2 className="mt-2 text-3xl font-heading font-bold text-foreground">
              {l(content.whyEmc.headline)}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {l(content.whyEmc.body)}
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.whyEmc.pillars.map((pillar, i) => (
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

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {tAbout("leadership")}
          </h2>
        </Reveal>
        <div className="mt-6 flex flex-col gap-4">
          {content.leadership.map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              title={l(leader.title)}
              bio={l(leader.bio)}
            />
          ))}
        </div>
      </section>

      <section className="bg-emc-gray-50 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {l(content.corporatePhilosophy.headline)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.corporatePhilosophy.body)}
          </p>
        </Reveal>
      </section>
    </>
  );
}
