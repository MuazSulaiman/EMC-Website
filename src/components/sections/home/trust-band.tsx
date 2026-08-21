import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function TrustBand({ headline }: { headline: string }) {
  return (
    <section className="border-y border-border bg-emc-gray-50">
      <Reveal className="mx-auto flex max-w-7xl 2xl:max-w-[96rem] items-center justify-center gap-3 px-4 py-8 text-center sm:px-6 lg:px-8">
        <BadgeCheck
          className="size-6 shrink-0 text-emc-teal-700 sm:size-7"
          aria-hidden="true"
        />
        <p className="text-lg font-heading font-semibold text-emc-purple-900 sm:text-xl">
          {headline}
        </p>
      </Reveal>
    </section>
  );
}
