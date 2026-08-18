import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/i18n-content";
import type { Product, Partner } from "../../../content/schemas";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { solutionIcons } from "@/lib/nav";

export function ProductCard({
  product,
  manufacturer,
}: {
  product: Product;
  manufacturer?: Partner;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const iconName = solutionIcons[product.clinicalSpecialty[0]];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {iconName && (
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
          <DynamicIcon name={iconName} className="size-5" aria-hidden="true" />
        </span>
      )}
      {manufacturer && (
        <span className="text-xs font-semibold tracking-wide text-emc-teal-700 uppercase">
          {manufacturer.name}
        </span>
      )}
      <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {pickLocale(product.shortDescription, locale)}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
}
