import type { LocalizedString } from "../../content/schemas";

/** Picks the field for the active locale out of a Section-8 {en, ar} pair. */
export function pickLocale(value: LocalizedString, locale: string): string {
  return locale === "ar" ? value.ar : value.en;
}
