"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const nextLocale = locale === "en" ? "ar" : "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      render={
        <Link href={pathname} locale={nextLocale} />
      }
    >
      <Languages aria-hidden="true" />
      {t("switchLanguage")}
    </Button>
  );
}
