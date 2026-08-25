import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { DemoRequestModal } from "@/components/layout/demo-request-modal";

export function Hero({
  eyebrow,
  headline,
  subhead,
  imageAlt,
}: {
  eyebrow: string;
  headline: string;
  subhead: string;
  imageAlt: string;
}) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal above>
            <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
          </Reveal>
          <Reveal above delay={0.08}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {subhead}
            </p>
          </Reveal>
          <Reveal above delay={0.16}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/solutions" />}>
                {t("cta.exploreSolutions")}
              </Button>
              <DemoRequestModal size="lg" variant="outline" />
            </div>
          </Reveal>
        </div>
        <Reveal above delay={0.1}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl lg:aspect-square">
            <Image
              src="/media/photos/1.jpeg"
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
