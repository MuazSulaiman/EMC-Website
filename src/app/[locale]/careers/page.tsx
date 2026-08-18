import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Users2 } from "lucide-react";
import { getCareersPageContent, getJobs } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { JobCard } from "@/components/sections/careers/job-card";
import { ApplicationForm } from "@/components/sections/careers/application-form";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const content = await getCareersPageContent();
  return buildMetadata({
    locale,
    path: "/careers",
    title: t("careers"),
    description: truncateDescription(pickLocale(content.intro.body, locale)),
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [content, jobs] = await Promise.all([getCareersPageContent(), getJobs()]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("nav.careers") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.intro.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.intro.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(content.intro.body)}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {jobs.length > 0 ? (
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <Reveal key={job.slug} delay={i * 0.05}>
                <JobCard job={job} />
              </Reveal>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <Users2 className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-foreground">{t("careers.emptyTitle")}</p>
            <p className="max-w-md text-sm text-muted-foreground">{t("careers.emptyBody")}</p>
          </Reveal>
        )}
      </section>

      <section className="bg-emc-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-3xl font-heading font-bold text-foreground">
              {l(content.culture.headline)}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              {l(content.culture.body)}
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {content.culture.values.map((value, i) => (
              <Reveal
                key={value.name.en}
                delay={i * 0.06}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-heading font-semibold text-emc-purple-700">
                  {l(value.name)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{l(value.description)}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="apply" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {t("careers.joinTalentNetwork")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("careers.applicationIntro")}</p>
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ApplicationForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
