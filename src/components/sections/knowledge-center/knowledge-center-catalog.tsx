"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useTranslations } from "next-intl";
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
import { ArticleCard } from "@/components/sections/knowledge-center/article-card";
import { newsTypeSchema, type NewsItem } from "../../../../content/schemas";

const ALL = "all";
const TYPES = newsTypeSchema.options;

export function KnowledgeCenterCatalog({ items }: { items: NewsItem[] }) {
  const t = useTranslations();
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title.en", "title.ar", "excerpt.en", "excerpt.ar"],
        threshold: 0.35,
      }),
    [items],
  );

  const filtered = useMemo(() => {
    let result = items;
    if (typeFilter !== ALL) {
      result = result.filter((item) => item.type === typeFilter);
    }
    if (query.trim()) {
      const matchedSlugs = new Set(fuse.search(query).map((r) => r.item.slug));
      result = result.filter((item) => matchedSlugs.has(item.slug));
    }
    return result;
  }, [items, typeFilter, query, fuse]);

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

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? ALL)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue>
              {(value: string | null) =>
                !value || value === ALL
                  ? t("common.viewAll")
                  : t(`knowledgeCenter.types.${value}`)
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("common.viewAll")}</SelectItem>
            {TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`knowledgeCenter.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.05}>
              <ArticleCard item={item} />
            </Reveal>
          ))}
        </RevealGroup>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">{t("common.noResults")}</p>
      )}
    </div>
  );
}
