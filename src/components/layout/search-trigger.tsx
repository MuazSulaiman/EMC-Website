"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * UI shell only in Phase 1 — the Fuse.js index (Section 7) has nothing to
 * index until Phases 2–4 ship product/solution/knowledge-center content.
 */
export function SearchTrigger() {
  const t = useTranslations("common");

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" aria-label={t("search")} />}
      >
        <Search aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          disabled
        />
        <p className="mt-2 text-xs text-muted-foreground">{t("comingSoon")}</p>
      </PopoverContent>
    </Popover>
  );
}
