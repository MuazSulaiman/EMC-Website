import { SectionHeading } from "@/components/sections/section-heading";
import { CustomerMarquee } from "@/components/sections/home/customer-marquee";
import { Reveal } from "@/components/motion/reveal";
import type { Customer } from "../../../../content/schemas";

/** Renders only if content exists — never mock customers (see content/customers/README.md). */
export function CustomersBand({
  eyebrow,
  headline,
  body,
  customers,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  customers: Customer[];
}) {
  if (customers.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} headline={headline} align="center" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            {body}
          </p>
        </Reveal>
        <div className="mt-10">
          <CustomerMarquee customers={customers} />
        </div>
      </div>
    </section>
  );
}
