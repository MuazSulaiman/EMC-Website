import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FeaturedTechnology({
  eyebrow,
  headline,
  body,
  imageAlt,
  facts,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  imageAlt: string;
  facts: { label: string; value: string }[];
}) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card">
            <Image
              src="/media/photos/2.jpeg"
              alt={imageAlt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-6"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-muted-foreground">{body}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="ltr-embed mt-1 text-xl font-heading font-bold text-emc-purple-700">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Button render={<Link href="/partners/ue-medical" />}>
              {t("common.learnMore")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
