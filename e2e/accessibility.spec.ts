import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Section 4 / 13: axe-core accessibility checks. Scoped to WCAG 2.1 A/AA
 * rules (the bar Section 13 sets) so this doesn't fail on best-practice-only
 * rules the spec never asked for.
 */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const pages: { name: string; path: string }[] = [
  { name: "home (en)", path: "/en" },
  { name: "home (ar)", path: "/ar" },
  { name: "product detail", path: "/en/products/uescope-video-laryngoscope" },
  { name: "solutions index", path: "/en/solutions" },
  { name: "contact", path: "/en/contact" },
  { name: "careers", path: "/en/careers" },
];

for (const { name, path } of pages) {
  test(`${name} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });
}

test("Request a Demo modal has no WCAG 2.1 A/AA violations while open", async ({ page }) => {
  await page.goto("/en");
  await page.locator("header").getByRole("button", { name: "Request a Demo" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
