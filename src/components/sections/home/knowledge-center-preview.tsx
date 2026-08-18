import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { pickLocale } from "@/lib/i18n-content";
import type { NewsItem } from "../../../../content/schemas";

/** Renders nothing until Phase 6 seeds Knowledge Center content. */
export function KnowledgeCenterPreview({ items }: { items: NewsItem[] }) {
  const t = useTranslations();
  const locale = useLocale();
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow={t("nav.knowledgeCenter")}
          headline={t("nav.knowledgeCenter")}
        />
      </Reveal>
      <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.slice(0, 3).map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.06}>
            <Link
              href={`/knowledge-center/${item.slug}`}
              className="block rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-heading font-semibold text-foreground">
                {pickLocale(item.title, locale)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pickLocale(item.excerpt, locale)}
              </p>
            </Link>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
