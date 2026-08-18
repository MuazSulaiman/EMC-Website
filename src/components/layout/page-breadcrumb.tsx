import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildBreadcrumbJsonLd, JsonLd } from "@/lib/seo";

/**
 * Section 7: breadcrumbs on every page except home. Chevron mirrors in RTL.
 * Also emits BreadcrumbList JSON-LD (Section 12) for every page that renders
 * this — i.e. every interior page — from the same trail data, so no page
 * needs to build breadcrumb structured data separately.
 */
export function PageBreadcrumb({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) {
  const t = useTranslations("common");
  const locale = useLocale();

  const jsonLdItems = [
    { name: t("breadcrumbHome"), href: "/" },
    ...trail.map((crumb) => ({ name: crumb.label, href: crumb.href })),
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(jsonLdItems, locale)} />
      <Breadcrumb className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-6 sm:px-6 lg:px-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              {t("breadcrumbHome")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {trail.map((crumb, i) => (
            // Fragment, not a wrapper element — BreadcrumbList renders <ol>,
            // which axe (correctly) requires to contain only <li> children;
            // a <span> here (even display:contents) fails that check.
            <Fragment key={crumb.label}>
              <BreadcrumbSeparator>
                <ChevronRight className="rtl:rotate-180" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {crumb.href && i < trail.length - 1 ? (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
