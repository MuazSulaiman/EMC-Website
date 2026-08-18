import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getIndexPagesContent, getNewsItems } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { KnowledgeCenterCatalog } from "@/components/sections/knowledge-center/knowledge-center-catalog";
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
    path: "/knowledge-center",
    title: t("knowledgeCenter"),
    description: truncateDescription(pickLocale(content.knowledgeCenterIndex.body, locale)),
  });
}

export default async function KnowledgeCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [content, items] = await Promise.all([getIndexPagesContent(), getNewsItems()]);
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("nav.knowledgeCenter") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.knowledgeCenterIndex.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.knowledgeCenterIndex.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.knowledgeCenterIndex.body)}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {items.length > 0 ? (
          <KnowledgeCenterCatalog items={items} />
        ) : (
          <Reveal className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <BookOpen className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-foreground">{t("knowledgeCenter.emptyTitle")}</p>
            <p className="max-w-md text-sm text-muted-foreground">
              {t("knowledgeCenter.emptyBody")}
            </p>
          </Reveal>
        )}
      </section>
    </>
  );
}
