import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { primaryNav, footerLegalLinks, solutionsMenu, partnersMenu } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { XIcon, InstagramIcon } from "@/components/icons/social-icons";
import { Phone, Mail, MapPin } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emc-navy-900 text-white">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/media/logo/emc-logo-original.png"
              alt="Excellence Medical Care"
              width={48}
              height={47}
              className="h-12 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex size-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={solutionsMenu.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t(solutionsMenu.labelKey)}
                </Link>
              </li>
              <li>
                <Link
                  href={partnersMenu.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t(partnersMenu.labelKey)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold">
              {t("footer.legal")}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/sitemap.xml"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("footer.sitemap")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold">
              {t("footer.contactInfo")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {siteConfig.address.line}, {siteConfig.address.city},{" "}
                  {siteConfig.address.country}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="ltr-embed hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="ltr-embed hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {siteConfig.legalName} {t("footer.rightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
