import type { Customer } from "../../../content/schemas";

/**
 * Same wordmark-over-logo-image precedent as PartnerTile — no customer logo
 * assets exist yet. Not a link: customers don't have dedicated pages.
 */
export function CustomerTile({ customer }: { customer: Customer }) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center rounded-xl border border-border bg-card px-6 shadow-xs">
      <span className="text-center font-heading text-sm font-semibold whitespace-nowrap text-foreground sm:text-base">
        {customer.name}
      </span>
    </div>
  );
}
