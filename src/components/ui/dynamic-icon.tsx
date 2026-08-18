import * as icons from "lucide-react";
import { HelpCircle, type LucideProps } from "lucide-react";

/** Renders a Lucide icon by its exported name string (content-driven icon fields). */
export function DynamicIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon =
    (icons as unknown as Record<string, React.ComponentType<LucideProps>>)[
      name
    ] ?? HelpCircle;
  return <Icon {...props} />;
}
