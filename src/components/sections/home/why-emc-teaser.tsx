import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PillarCard } from "@/components/sections/about/pillar-card";

export function WhyEmcTeaser({
  eyebrow,
  headline,
  body,
  pillars,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  pillars: { icon: string; title: string; body: string }[];
}) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-4 text-muted-foreground">{body}</p>
      </Reveal>
      <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.slice(0, 4).map((pillar, i) => (
          <PillarCard
            key={pillar.title}
            icon={pillar.icon}
            title={pillar.title}
            body={pillar.body}
            delay={i * 0.05}
          />
        ))}
      </RevealGroup>
      <div className="mt-8 text-center">
        <Button variant="outline" render={<Link href="/about#why-emc" />}>
          {t("common.learnMore")}
        </Button>
      </div>
    </section>
  );
}
