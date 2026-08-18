import type { Metadata } from "next";
import { createElement } from "react";
import { siteConfig } from "@/lib/site-config";

// No production domain has ever been confirmed for this project — never
// fall back to an invented one (e.g. "emc-website.com"). Must be set via
// env before deployment; see .env.example. Defaults to localhost so
// canonical/OG URLs are at least well-formed in local dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SITE_NAME = "Excellence Medical Care (EMC)";

function localizedPath(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}/${locale}${clean}`;
}

/** Trims to a meta-description-friendly length without cutting mid-word. */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Section 12: per-locale metadata with canonical + hreflang alternates and
 * OpenGraph/Twitter cards. Every page's generateMetadata should build on
 * this rather than returning a bare {title}.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = localizedPath(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: localizedPath("en", path),
        ar: localizedPath("ar", path),
        "x-default": localizedPath("en", path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ---- JSON-LD builders (Section 12) ----------------------------------------

export function buildOrganizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.tradingName,
    url: localizedPath(locale, "/"),
    logo: `${SITE_URL}/media/logo/emc-logo-original.png`,
    foundingDate: String(siteConfig.established),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line,
      addressLocality: siteConfig.address.city,
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
    },
    sameAs: [siteConfig.social.twitter, siteConfig.social.instagram],
  };
}

export function buildProductJsonLd({
  name,
  description,
  manufacturerName,
  locale,
  slug,
}: {
  name: string;
  description: string;
  manufacturerName?: string;
  locale: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: localizedPath(locale, `/products/${slug}`),
    ...(manufacturerName && {
      brand: { "@type": "Brand", name: manufacturerName },
      manufacturer: { "@type": "Organization", name: manufacturerName },
    }),
    // No price/offers — Section 9.4: no cart, no price, no "buy" language.
  };
}

export function buildArticleJsonLd({
  headline,
  description,
  datePublished,
  locale,
  slug,
}: {
  headline: string;
  description: string;
  datePublished: string;
  locale: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    url: localizedPath(locale, `/knowledge-center/${slug}`),
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/media/logo/emc-logo-original.png`,
      },
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; href?: string }[],
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href && { item: localizedPath(locale, item.href) }),
    })),
  };
}

/**
 * Renders a JSON-LD <script> tag. Server Components only. Plain
 * `createElement` (not JSX) so this file can stay a .ts module, matching
 * Section 5's file plan.
 */
export function JsonLd({ data }: { data: object }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
