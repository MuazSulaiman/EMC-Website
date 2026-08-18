import { SectionHeading } from "@/components/sections/section-heading";
import { SolutionCard } from "@/components/sections/solution-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import type { Solution } from "../../../../content/schemas";

export function SolutionsGrid({
  eyebrow,
  headline,
  solutions,
}: {
  eyebrow: string;
  headline: string;
  solutions: Solution[];
}) {
  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} headline={headline} align="center" />
      </Reveal>
      <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, i) => (
          <Reveal key={solution.slug} delay={i * 0.06}>
            <SolutionCard solution={solution} />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
