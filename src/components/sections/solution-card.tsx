import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Badge } from "@/components/ui/badge";
import { pickLocale } from "@/lib/i18n-content";
import type { Solution } from "../../../content/schemas";

export function SolutionCard({ solution }: { solution: Solution }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
          <DynamicIcon name={solution.icon} className="size-5" aria-hidden="true" />
        </span>
        {solution.status === "expanding" && (
          <Badge variant="secondary" className="text-emc-purple-700">
            {t("common.comingSoon")}
          </Badge>
        )}
      </div>
      <h3 className="mt-4 text-lg font-heading font-semibold text-foreground">
        {pickLocale(solution.name, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {pickLocale(solution.shortDescription, locale)}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
}
