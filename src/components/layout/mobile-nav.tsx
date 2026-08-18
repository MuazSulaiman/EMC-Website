"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { primaryNav, solutionsMenu, partnersMenu } from "@/lib/nav";

export function MobileNav() {
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const side = locale === "ar" ? "left" : "right";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t("common.openMenu")} />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side={side} className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("common.menu")}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          <SheetClose
            render={<Link href="/" />}
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            {t("nav.home")}
          </SheetClose>

          <Accordion className="w-full">
            <AccordionItem value="solutions">
              <AccordionTrigger className="px-3 text-sm font-medium">
                {t(solutionsMenu.labelKey)}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                {solutionsMenu.items.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} />}
                    className="rounded-lg px-6 py-2 text-sm hover:bg-muted"
                  >
                    {t(item.labelKey)}
                  </SheetClose>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="partners">
              <AccordionTrigger className="px-3 text-sm font-medium">
                {t(partnersMenu.labelKey)}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                {partnersMenu.items.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} />}
                    className="rounded-lg px-6 py-2 text-sm hover:bg-muted"
                  >
                    {t(item.labelKey)}
                  </SheetClose>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {primaryNav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <SheetClose
                key={item.href}
                render={<Link href={item.href} />}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {t(item.labelKey)}
              </SheetClose>
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
