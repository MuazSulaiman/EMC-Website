import { useTranslations } from "next-intl";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale } from "@/lib/i18n-content";
import type { LegalPageContent } from "../../../../content/schemas";

/** Shared renderer for Privacy Policy / Terms of Use / Cookie Policy (Section 9.11) — same structure, different content. */
export function LegalPageView({
  content,
  locale,
  breadcrumbLabel,
}: {
  content: LegalPageContent;
  locale: string;
  breadcrumbLabel: string;
}) {
  const t = useTranslations();
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const dateLocale = locale === "ar" ? "ar-SA" : "en-US";

  return (
    <>
      <PageBreadcrumb trail={[{ label: breadcrumbLabel }]} />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.headline)}
          </h1>
          <p className="ltr-embed mt-2 text-sm text-muted-foreground">
            {new Date(content.lastUpdated).toLocaleDateString(dateLocale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-6 text-muted-foreground">{l(content.intro)}</p>

          <div className="mt-10 flex flex-col gap-8">
            {content.sections.map((section) => (
              <div key={section.title.en}>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {l(section.title)}
                </h2>
                <p className="mt-2 text-muted-foreground">{l(section.body)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-border bg-emc-gray-50 p-5 text-sm text-muted-foreground">
            {t("legal.reviewNotice")}
          </div>
        </Reveal>
      </section>
    </>
  );
}
