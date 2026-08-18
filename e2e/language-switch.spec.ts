import { test, expect } from "@playwright/test";

test.describe("Language switching", () => {
  test("switching to Arabic updates the URL, <html> lang/dir, and mirrors nav", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    // Base UI's Button stamps role="button" on its render target even when
    // that target is an <a> (it's a nav action styled/behaving as a button,
    // not a content link), so this is role "button" in the a11y tree, not
    // "link". Scoped to the header — the footer has its own copy too.
    await page.getByRole("banner").getByRole("button", { name: "Language" }).click();

    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("switching language preserves the current page (not just the homepage)", async ({
    page,
  }) => {
    await page.goto("/en/about");
    // Base UI's Button stamps role="button" on its render target even when
    // that target is an <a> (it's a nav action styled/behaving as a button,
    // not a content link), so this is role "button" in the a11y tree, not
    // "link". Scoped to the header — the footer has its own copy too.
    await page.getByRole("banner").getByRole("button", { name: "Language" }).click();
    await expect(page).toHaveURL(/\/ar\/about$/);
  });

  test("switching back to English from Arabic restores ltr", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.getByRole("banner").getByRole("button", { name: "اللغة" }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });
});
