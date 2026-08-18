import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CalendarDays, MapPin, FileDown } from "lucide-react";
import {
  getNewsItem,
  getNewsItems,
  getSolutions,
  getIndexPagesContent,
} from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { buildArticleJsonLd, buildMetadata, JsonLd, truncateDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const items = await getNewsItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return {};
  return buildMetadata({
    locale,
    path: `/knowledge-center/${slug}`,
    title: pickLocale(item.title, locale),
    description: truncateDescription(pickLocale(item.excerpt, locale)),
  });
}

export default async function KnowledgeCenterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const item = await getNewsItem(slug);
  if (!item) notFound();

  const [allSolutions, pageContent] = await Promise.all([
    getSolutions(),
    getIndexPagesContent(),
  ]);
  const relatedSolutions = allSolutions.filter((solution) =>
    item.relatedSolutionSlugs.includes(solution.slug),
  );

  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const dateLocale = locale === "ar" ? "ar-SA" : "en-US";

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          headline: l(item.title),
          description: l(item.excerpt),
          datePublished: item.publishDate,
          locale,
          slug: item.slug,
        })}
      />
      <PageBreadcrumb
        trail={[
          { label: t("nav.knowledgeCenter"), href: "/knowledge-center" },
          { label: l(item.title) },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-emc-purple-700">
              {t(`knowledgeCenter.types.${item.type}`)}
            </Badge>
            <time dateTime={item.publishDate} className="ltr-embed text-sm text-muted-foreground">
              {new Date(item.publishDate).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="mt-4 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(item.title)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(item.excerpt)}</p>

          {(item.eventDate || item.eventLocation) && (
            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
              {item.eventDate && (
                <div className="flex items-center gap-2 text-foreground">
                  <CalendarDays className="size-4 text-emc-teal-600" aria-hidden="true" />
                  <span className="ltr-embed">
                    {new Date(item.eventDate).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {item.eventLocation && (
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="size-4 text-emc-teal-600" aria-hidden="true" />
                  {l(item.eventLocation)}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 whitespace-pre-line text-muted-foreground">{l(item.body)}</div>

          {item.downloadUrl && (
            <Button
              className="mt-8"
              variant="outline"
              render={<a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <FileDown aria-hidden="true" />
              {t("products.downloads")}
            </Button>
          )}

          {relatedSolutions.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
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
            </div>
          )}
        </Reveal>
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
