import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getServicesPageContent, getIndexPagesContent } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const content = await getServicesPageContent();
  return buildMetadata({
    locale,
    path: "/services",
    title: t("services"),
    description: truncateDescription(pickLocale(content.intro.body, locale)),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [content, pageContent] = await Promise.all([
    getServicesPageContent(),
    getIndexPagesContent(),
  ]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("nav.services") }]} />

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
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.map((service, i) => (
            <Reveal
              key={service.title.en}
              delay={i * 0.05}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
                <DynamicIcon name={service.icon} className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading font-semibold text-foreground">
                {l(service.title)}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {l(service.description)}
              </p>
              {service.ctaType && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 self-start"
                  render={<Link href={`/contact?type=${service.ctaType}`} />}
                >
                  {t("cta.contactEmc")}
                </Button>
              )}
            </Reveal>
          ))}
        </RevealGroup>
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
