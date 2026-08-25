import { test, expect } from "@playwright/test";

test.describe("Request a Demo", () => {
  test("filling and submitting the form shows the inline success state", async ({ page }) => {
    await page.goto("/en");

    await page.locator("header").getByRole("button", { name: "Request a Demo" }).click();

    const dialog = page.getByRole("dialog", { name: "Request a Demo" });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("Full Name").fill("Sara Al-Qahtani");
    await dialog.getByLabel("Organization").fill("King Fahd Hospital");

    // Job Title, Department, and City are optional and live inside a
    // collapsed <details>/<summary> progressive-disclosure section — open it
    // before interacting with those fields (see demo-request-modal.tsx).
    await dialog.getByText("More details (optional)").click();
    await dialog.getByLabel("Job Title").fill("Biomedical Engineer");
    await dialog.getByLabel("Department").fill("Anesthesia");
    await dialog.getByLabel("City").fill("Dammam");
    await dialog.getByLabel("Email").fill("sara.qahtani@example.com");
    await dialog.getByLabel("Mobile").fill("0555555555");
    await dialog.getByLabel("Product or Solution of Interest").fill("UEScope Video Laryngoscope");

    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/leads/demo-request")),
      dialog.getByRole("button", { name: "Request a Demo" }).click(),
    ]);

    await expect(dialog.getByText("Request received")).toBeVisible();
    await expect(dialog.getByText("Thank you")).toBeVisible();
  });

  test("submitting with required fields empty shows inline validation errors, not a network call", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.locator("header").getByRole("button", { name: "Request a Demo" }).click();

    const dialog = page.getByRole("dialog", { name: "Request a Demo" });
    await dialog.getByRole("button", { name: "Request a Demo" }).click();

    await expect(dialog.getByLabel("Full Name")).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByText("Request received")).not.toBeVisible();
  });

  test("Escape closes the modal and returns focus to its trigger", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.locator("header").getByRole("button", { name: "Request a Demo" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Request a Demo" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
