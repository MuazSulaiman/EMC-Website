import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getJob, getJobs } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/sections/careers/application-form";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJob(slug);
  if (!job) return {};
  return buildMetadata({
    locale,
    path: `/careers/${slug}`,
    title: pickLocale(job.title, locale),
    description: truncateDescription(pickLocale(job.description, locale)),
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const job = await getJob(slug);
  if (!job) notFound();

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb
        trail={[
          { label: t("nav.careers"), href: "/careers" },
          { label: l(job.title) },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(job.title)}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {job.department} · {job.location} · {job.employmentType}
          </p>
          <div className="mt-6 whitespace-pre-line text-muted-foreground">
            {l(job.description)}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            {job.applyVia === "linkedin" && job.linkedinUrl ? (
              <Button size="lg" render={<a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" />}>
                {t("careers.joinTalentNetwork")}
                <ExternalLink aria-hidden="true" />
              </Button>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <ApplicationForm defaultPosition={l(job.title)} />
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
