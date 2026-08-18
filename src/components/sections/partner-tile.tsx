import { Link } from "@/i18n/navigation";
import type { Partner } from "../../../content/schemas";

/**
 * No partner logo assets were supplied (Section 15 only lists the EMC logo
 * and the UE Medical PDF) — a premium wordmark treatment stands in until
 * EMC provides partner logo files, rather than fabricating or downloading
 * logos from the partners' own sites.
 */
export function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group flex h-28 items-center justify-center rounded-2xl border border-border bg-card px-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emc-teal-400 focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="text-center font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-emc-purple-700">
        {partner.name}
      </span>
    </Link>
  );
}
