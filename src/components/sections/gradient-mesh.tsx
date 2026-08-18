import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Stand-in for editorial photography (none supplied yet — Section 15 only
 * provides the logo raster and the UE Medical PDF). Section 6.1: "use it in
 * gradients, editorial color blocks, or as a duotone overlay on photography
 * instead" of a flat purple fill. A fine engineered grid-line overlay nods
 * at "medical technology" without needing an actual device photo.
 */
export function GradientMesh({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      aria-hidden={children ? undefined : "true"}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-emc-purple-900",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(120% 90% at 15% 15%, var(--emc-purple-500) 0%, transparent 55%)",
            "radial-gradient(90% 80% at 90% 85%, var(--emc-teal-400) 0%, transparent 55%)",
            "radial-gradient(70% 60% at 60% 30%, var(--emc-teal-600) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emc-purple-900/40 via-transparent to-transparent" />
      {children && <div className="relative z-10 flex size-full items-center justify-center">{children}</div>}
    </div>
  );
}
