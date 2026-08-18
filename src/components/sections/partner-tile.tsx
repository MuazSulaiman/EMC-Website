import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/i18n-content";
import type { Partner } from "../../../content/schemas";

/**
 * Renders the partner's logo once EMC supplies one; falls back to the
 * premium wordmark treatment (Section 15 originally only listed the EMC
 * logo and the UE Medical PDF, so most partners still have no logo file)
 * rather than fabricating or downloading logos from the partners' own
 * sites.
 */
export function PartnerTile({ partner }: { partner: Partner }) {
  const locale = useLocale();

  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group flex h-28 items-center justify-center rounded-2xl border border-border bg-card px-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emc-teal-400 focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {partner.logo ? (
        <div className="relative size-full">
          <Image
            src={partner.logo.src}
            alt={pickLocale(partner.logo.alt, locale)}
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-center font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-emc-purple-700">
          {partner.name}
        </span>
      )}
    </Link>
  );
}
