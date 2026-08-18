import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { pickLocale } from "@/lib/i18n-content";
import type { NewsItem } from "../../../../content/schemas";

/** Section 6.3's required "article card." */
export function ArticleCard({ item }: { item: NewsItem }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Link
      href={`/knowledge-center/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-emc-purple-700">
          {t(`knowledgeCenter.types.${item.type}`)}
        </Badge>
        <time dateTime={item.publishDate} className="ltr-embed text-xs text-muted-foreground">
          {new Date(item.publishDate).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
        {pickLocale(item.title, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {pickLocale(item.excerpt, locale)}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
}
