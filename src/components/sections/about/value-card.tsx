import { Reveal } from "@/components/motion/reveal";

export function ValueCard({
  name,
  description,
  delay,
}: {
  name: string;
  description: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h3 className="font-heading font-semibold text-emc-purple-700">
        {name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Reveal>
  );
}
