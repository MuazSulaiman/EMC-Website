import { Reveal } from "@/components/motion/reveal";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export function PillarCard({
  icon,
  title,
  body,
  delay,
}: {
  icon: string;
  title: string;
  body: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
        <DynamicIcon name={icon} className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-heading font-semibold text-emc-purple-700">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </Reveal>
  );
}
