import { test, expect } from "@playwright/test";

test.describe("Primary navigation", () => {
  test("home page loads with expected nav links", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Excellence Medical Care/);

    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Products", exact: true })).toBeVisible();
    await expect(header.getByRole("button", { name: "Solutions" })).toBeVisible();
  });

  test("a plain nav link navigates to its page", async ({ page }) => {
    await page.goto("/en");
    await page.locator("header").getByRole("link", { name: "Products", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/products$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("Solutions mega-menu opens on keyboard focus and its links navigate", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.locator("header").getByRole("button", { name: "Solutions" });
    await trigger.focus();
    await trigger.press("Enter");

    // exact:true disambiguates from the home page's own SolutionsGrid card,
    // whose accessible name is the longer "Anesthesia & Airway Management
    // Video…" — only the mega-menu's own link is named exactly "Anesthesia &
    // Airway Management".
    const airwayLink = page.getByRole("link", { name: "Anesthesia & Airway Management", exact: true });
    await expect(airwayLink).toBeVisible();
    await airwayLink.click();
    await expect(page).toHaveURL(/\/en\/solutions\/anesthesia-airway-management$/);
  });

  test("breadcrumb on an interior page links back to its section index", async ({ page }) => {
    await page.goto("/en/solutions/anesthesia-airway-management");
    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await expect(breadcrumb).toBeVisible();
    await breadcrumb.getByRole("link", { name: "Solutions" }).click();
    await expect(page).toHaveURL(/\/en\/solutions$/);
  });

  test("404 page renders for an unknown route", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
