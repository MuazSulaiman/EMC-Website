import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  headline,
  align = "start",
  className,
}: {
  eyebrow?: string;
  headline: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
        {headline}
      </h2>
    </div>
  );
}
