import { Reveal } from "@/components/motion/reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** No leadership photos supplied yet — an initials avatar stands in rather than a stock photo. */
export function LeaderCard({
  name,
  title,
  bio,
}: {
  name: string;
  title: string;
  bio: string;
}) {
  return (
    <Reveal className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-emc-purple-700 font-heading text-xl font-bold text-white">
        {initials(name)}
      </span>
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {name}
        </h3>
        <p className="text-sm font-medium text-emc-teal-700">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{bio}</p>
      </div>
    </Reveal>
  );
}
