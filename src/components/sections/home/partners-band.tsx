import { SectionHeading } from "@/components/sections/section-heading";
import { PartnerTile } from "@/components/sections/partner-tile";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import type { Partner } from "../../../../content/schemas";

export function PartnersBand({
  eyebrow,
  headline,
  body,
  partners,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  partners: Partner[];
}) {
  return (
    <section className="bg-emc-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} headline={headline} align="center" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            {body}
          </p>
        </Reveal>
        <RevealGroup className="mt-10 flex flex-wrap justify-center gap-4">
          {partners.map((partner, i) => (
            <Reveal key={partner.slug} delay={i * 0.05}>
              <PartnerTile partner={partner} />
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
