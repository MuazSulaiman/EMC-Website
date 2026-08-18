import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function WhyEmcTeaser({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string;
  headline: string;
  body: string;
}) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-4 text-muted-foreground">{body}</p>
        <div className="mt-6">
          <Button variant="outline" render={<Link href="/about#why-emc" />}>
            {t("common.learnMore")}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
