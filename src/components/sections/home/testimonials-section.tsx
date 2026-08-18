import { useLocale } from "next-intl";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { pickLocale } from "@/lib/i18n-content";
import type { Testimonial } from "../../../../content/schemas";

/**
 * Section 9.1 / 2.2: renders only if content exists — never mock
 * testimonials. `testimonials/` is still empty, so this returns null today.
 */
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const locale = useLocale();
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {testimonials.map((testimonial, i) => (
          <Reveal
            key={testimonial.author}
            delay={i * 0.06}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-foreground">
              &ldquo;{pickLocale(testimonial.quote, locale)}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {testimonial.author}
            </p>
            <p className="text-sm text-muted-foreground">
              {testimonial.title}, {testimonial.organization}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
