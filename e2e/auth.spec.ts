import { expect, type Page, test } from "@playwright/test";

async function signIn(page: Page, email: string, password: string) {
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("rejects invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await signIn(page, "user@example.com", "wrong-password");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByText("Email or password is incorrect.", { exact: true }),
  ).toBeVisible();
});

test("protects routes and supports the USER session lifecycle", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard$/);

  await signIn(page, "user@example.com", "user-password");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Demo User")).toBeVisible();
  await expect(page.getByText("USER", { exact: true })).toBeVisible();

  const sessionResponse = await page.request.get("/api/auth/session");
  await expect(sessionResponse.json()).resolves.toMatchObject({
    user: {
      id: "mock-user-1",
      email: "user@example.com",
      name: "Demo User",
      role: "USER",
    },
  });
  await expect(
    page.evaluate(() => ({
      cookie: document.cookie,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
    })),
  ).resolves.toEqual({
    cookie: "",
    localStorageKeys: [],
    sessionStorageKeys: [],
  });

  const adminResponse = await page.request.get("/api/mock/admin/users");
  expect(adminResponse.status()).toBe(403);

  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard$/);
});

test("allows an ADMIN to read the admin resource", async ({ page }) => {
  await page.goto("/login");
  await signIn(page, "admin@example.com", "admin-password");
  await expect(page).toHaveURL(/\/dashboard$/);

  const response = await page.request.get("/api/mock/admin/users");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({
    users: expect.arrayContaining([
      expect.objectContaining({ role: "USER" }),
      expect.objectContaining({ role: "ADMIN" }),
    ]),
  });
});
