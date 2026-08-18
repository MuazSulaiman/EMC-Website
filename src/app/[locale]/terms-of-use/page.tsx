import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getLegalPageContent } from "@/lib/content";
import { LegalPageView } from "@/components/sections/legal/legal-page-view";
import { pickLocale } from "@/lib/i18n-content";
import { buildMetadata, truncateDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  const content = await getLegalPageContent("terms-of-use");
  return buildMetadata({
    locale,
    path: "/terms-of-use",
    title: t("termsOfUse"),
    description: truncateDescription(pickLocale(content.intro, locale)),
  });
}

export default async function TermsOfUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "footer" });
  const content = await getLegalPageContent("terms-of-use");

  return <LegalPageView content={content} locale={locale} breadcrumbLabel={t("termsOfUse")} />;
}
