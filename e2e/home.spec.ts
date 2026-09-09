import { expect, test } from "@playwright/test";

test("renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Auth Starter/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Authentication and authorization starter",
  );
});
