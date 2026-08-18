"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { DemoRequestModal } from "@/components/layout/demo-request-modal";

export function Header() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/95 backdrop-blur transition-[padding,box-shadow,border-color] duration-200 supports-backdrop-filter:bg-background/80",
        condensed ? "border-border shadow-sm" : "",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl 2xl:max-w-[96rem] items-center justify-between gap-4 px-4 transition-[padding] duration-200 sm:px-6 lg:px-8",
          condensed ? "py-2" : "py-4",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Excellence Medical Care">
          <Image
            src="/media/logo/emc-logo-original.png"
            alt="Excellence Medical Care"
            width={48}
            height={47}
            priority
            className={cn(
              "w-auto transition-[height] duration-200",
              condensed ? "h-10" : "h-12",
            )}
          />
        </Link>

        <DesktopNav />

        <div className="flex shrink-0 items-center gap-1">
          <SearchTrigger />
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <DemoRequestModal />
          </div>
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
