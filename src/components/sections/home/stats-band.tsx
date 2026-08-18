import { useLocale } from "next-intl";
import { StatCounter } from "@/components/ui/stat-counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { pickLocale } from "@/lib/i18n-content";
import type { Stat } from "../../../../content/schemas";

/**
 * Section 8.6 hard rule: never render a stat where `verified` is false.
 * `stats` here must already be pre-filtered by getVerifiedStats() — this
 * component renders nothing at all if that filtered list is empty, which is
 * the current state of every seeded stat (Phase 1).
 */
export function StatsBand({ stats }: { stats: Stat[] }) {
  const locale = useLocale();
  if (stats.length === 0) return null;

  return (
    <section className="bg-emc-navy-900 py-16 sm:py-20">
      <RevealGroup className="mx-auto grid max-w-7xl 2xl:max-w-[96rem] grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.08} className="text-center">
            <p className="text-4xl font-heading font-bold text-white">
              {stat.value !== null && <StatCounter value={stat.value} />}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {pickLocale(stat.label, locale)}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
