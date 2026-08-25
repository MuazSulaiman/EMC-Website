import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { getContactPageContent } from "@/lib/content";
import { pickLocale } from "@/lib/i18n-content";
import { siteConfig } from "@/lib/site-config";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { XIcon, InstagramIcon } from "@/components/icons/social-icons";
import { contactInquiryTypeSchema } from "@/lib/validations/leads";
import { buildMetadata, truncateDescription } from "@/lib/seo";

// Section 9.7: Services CTAs pre-filter this form to "Technical Support" or
// "Tender Support" via ?type=. Contact's own inquiry types (Section 9.10)
// have no literal "tender-support" option, so it maps onto "sales" — see
// DECISIONS.md.
function resolveInitialInquiryType(raw: string | undefined) {
  if (raw === "tender-support") return "sales" as const;
  const parsed = contactInquiryTypeSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const content = await getContactPageContent();
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("contact"),
    description: truncateDescription(pickLocale(content.intro.body, locale)),
  });
}

const MAP_QUERY = encodeURIComponent(
  `${siteConfig.address.line}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
);

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();

  const content = await getContactPageContent();
  const l = (v: { en: string; ar: string }) => pickLocale(v, locale);
  const initialInquiryType = resolveInitialInquiryType(type);

  return (
    <>
      <PageBreadcrumb trail={[{ label: t("nav.contact") }]} />

      <section className="mx-auto max-w-3xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <Reveal above>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {l(content.intro.eyebrow)}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            {l(content.intro.headline)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(content.intro.body)}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal above className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm initialInquiryType={initialInquiryType} />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={t("nav.contact")}
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-emc-teal-600" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    {siteConfig.address.line}, {siteConfig.address.city}, {siteConfig.address.country}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-emc-teal-600" aria-hidden="true" />
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="ltr-embed text-muted-foreground hover:text-foreground">
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-emc-teal-600" aria-hidden="true" />
                  <a href={`mailto:${siteConfig.email}`} className="ltr-embed text-muted-foreground hover:text-foreground">
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="size-4 shrink-0 text-emc-teal-600" aria-hidden="true" />
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t("common.whatsapp")}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-emc-teal-600" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    {l(content.workingHours)}
                    {!content.workingHoursVerified && (
                      <span className="ms-2 inline-block rounded-full bg-emc-gray-200 px-2 py-0.5 text-xs text-emc-gray-600">
                        {t("common.pendingConfirmation")}
                      </span>
                    )}
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                >
                  <XIcon className="size-4" />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
