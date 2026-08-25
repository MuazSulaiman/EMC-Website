import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GradientMesh } from "@/components/sections/gradient-mesh";
import { QuotationRequestModal } from "@/components/layout/quotation-request-modal";

export function CtaBand({
  headline,
  body,
  defaultProduct,
}: {
  headline: string;
  body: string;
  defaultProduct?: string;
}) {
  const t = useTranslations();

  return (
    <div className="relative isolate overflow-hidden rounded-3xl">
      <GradientMesh className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-start gap-6 px-8 py-16 sm:px-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-heading font-bold text-white sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-3 max-w-xl text-white/80">{body}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <QuotationRequestModal
            defaultProduct={defaultProduct}
            size="xl"
            variant="secondary"
          />
          <Button
            size="xl"
            className="bg-white text-emc-purple-900 hover:bg-white/90"
            render={<Link href="/contact" />}
          >
            {t("cta.contactEmc")}
          </Button>
        </div>
      </div>
    </div>
  );
}
