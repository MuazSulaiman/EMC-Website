import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/i18n-content";
import type { Job } from "../../../../content/schemas";

export function JobCard({ job }: { job: Job }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Link
      href={`/careers/${job.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">
        {pickLocale(job.title, locale)}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {job.department} · {job.location} · {job.employmentType}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
}
