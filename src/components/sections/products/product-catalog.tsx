"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevealGroup, Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/sections/product-card";
import { pickLocale } from "@/lib/i18n-content";
import type { Product, Solution, Partner } from "../../../../content/schemas";

const ALL = "all";

export function ProductCatalog({
  products,
  solutions,
  partners,
}: {
  products: Product[];
  solutions: Solution[];
  partners: Partner[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [solutionFilter, setSolutionFilter] = useState(ALL);
  const [manufacturerFilter, setManufacturerFilter] = useState(ALL);
  const [query, setQuery] = useState("");

  const partnerBySlug = useMemo(
    () => new Map(partners.map((p) => [p.slug, p])),
    [partners],
  );

  const solutionLabel = (value: string | null) =>
    value === ALL || !value
      ? t("common.viewAll")
      : pickLocale(
          solutions.find((s) => s.slug === value)?.name ?? { en: "", ar: "" },
          locale,
        );
  const partnerLabel = (value: string | null) =>
    value === ALL || !value
      ? t("common.viewAll")
      : (partnerBySlug.get(value)?.name ?? "");

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "shortDescription.en", "shortDescription.ar", "category"],
        threshold: 0.35,
      }),
    [products],
  );

  const filtered = useMemo(() => {
    let result = products;

    if (solutionFilter !== ALL) {
      result = result.filter((p) => p.clinicalSpecialty.includes(solutionFilter));
    }
    if (manufacturerFilter !== ALL) {
      result = result.filter((p) => p.manufacturer === manufacturerFilter);
    }
    if (query.trim()) {
      const matchedSlugs = new Set(fuse.search(query).map((r) => r.item.slug));
      result = result.filter((p) => matchedSlugs.has(p.slug));
    }
    return result;
  }, [products, solutionFilter, manufacturerFilter, query, fuse]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.searchPlaceholder")}
            aria-label={t("common.search")}
            className="ps-9"
          />
        </div>

        <Select
          value={solutionFilter}
          onValueChange={(value) => setSolutionFilter(value ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder={t("nav.solutions")}>
              {solutionLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("common.viewAll")}</SelectItem>
            {solutions.map((solution) => (
              <SelectItem key={solution.slug} value={solution.slug}>
                {pickLocale(solution.name, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={manufacturerFilter}
          onValueChange={(value) => setManufacturerFilter(value ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder={t("nav.partners")}>
              {partnerLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("common.viewAll")}</SelectItem>
            {partners.map((partner) => (
              <SelectItem key={partner.slug} value={partner.slug}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.05}>
              <ProductCard
                product={product}
                manufacturer={partnerBySlug.get(product.manufacturer)}
              />
            </Reveal>
          ))}
        </RevealGroup>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          {t("common.noResults")}
        </p>
      )}
    </div>
  );
}
