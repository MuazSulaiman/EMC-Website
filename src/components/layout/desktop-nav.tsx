"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { primaryNav, solutionsMenu, partnersMenu } from "@/lib/nav";

export function DesktopNav() {
  const t = useTranslations();
  const [home, ...rest] = primaryNav;
  const productsItem = rest.find((item) => item.href === "/products")!;
  const trailing = rest.filter((item) => item.href !== "/products");

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href={home.href} />}
            className={navigationMenuTriggerStyle()}
          >
            {t(home.labelKey)}
          </NavigationMenuLink>
        </NavigationMenuItem>

        <MegaMenuItem group={solutionsMenu} />

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href={productsItem.href} />}
            className={navigationMenuTriggerStyle()}
          >
            {t(productsItem.labelKey)}
          </NavigationMenuLink>
        </NavigationMenuItem>

        <MegaMenuItem group={partnersMenu} />

        {trailing.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              render={<Link href={item.href} />}
              className={navigationMenuTriggerStyle()}
            >
              {t(item.labelKey)}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MegaMenuItem({
  group,
}: {
  group: typeof solutionsMenu | typeof partnersMenu;
}) {
  const t = useTranslations();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t(group.labelKey)}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[280px] gap-1 p-2">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink render={<Link href={item.href} />}>
                {t(item.labelKey)}
              </NavigationMenuLink>
            </li>
          ))}
          <li className="mt-1 border-t border-border pt-2">
            <NavigationMenuLink
              render={<Link href={group.href} />}
              className={cn("font-medium text-emc-teal-700")}
            >
              {t("common.viewAll")}
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
