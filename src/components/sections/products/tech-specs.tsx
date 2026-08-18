import { useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pickLocale } from "@/lib/i18n-content";
import type { Product } from "../../../../content/schemas";

/** Section 9.4: technical specs render as a table on desktop, an accordion on mobile. */
export function TechSpecsTable({ specs }: { specs: Product["technicalSpecs"] }) {
  const locale = useLocale();
  if (specs.length === 0) return null;

  return (
    <>
      <table className="hidden w-full text-sm sm:table">
        <tbody>
          {specs.map((spec) => (
            <tr key={pickLocale(spec.label, locale)} className="border-b border-border">
              <th className="w-1/3 py-3 pe-4 text-start font-medium text-foreground">
                {pickLocale(spec.label, locale)}
              </th>
              <td className="ltr-embed py-3 text-muted-foreground">
                {pickLocale(spec.value, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Accordion className="sm:hidden">
        {specs.map((spec) => (
          <AccordionItem key={pickLocale(spec.label, locale)} value={pickLocale(spec.label, locale)}>
            <AccordionTrigger>{pickLocale(spec.label, locale)}</AccordionTrigger>
            <AccordionContent className="ltr-embed">
              {pickLocale(spec.value, locale)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
