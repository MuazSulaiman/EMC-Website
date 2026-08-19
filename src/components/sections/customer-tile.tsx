import Image from "next/image";
import { useLocale } from "next-intl";
import { pickLocale } from "@/lib/i18n-content";
import type { Customer } from "../../../content/schemas";

/**
 * Renders the customer's logo once sourced; falls back to the text-wordmark
 * treatment (same precedent as PartnerTile) when no verified logo exists for
 * that entry. Not a link: customers don't have dedicated pages.
 */
export function CustomerTile({ customer }: { customer: Customer }) {
  const locale = useLocale();

  return (
    <div className="flex h-28 w-56 shrink-0 items-center justify-center rounded-xl border border-border bg-card px-5 py-3 shadow-xs">
      {customer.logo ? (
        <div className="relative h-full w-full">
          <Image
            src={customer.logo.src}
            alt={pickLocale(customer.logo.alt, locale)}
            fill
            sizes="220px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-center font-heading text-sm leading-snug font-semibold text-foreground">
          {customer.name}
        </span>
      )}
    </div>
  );
}
