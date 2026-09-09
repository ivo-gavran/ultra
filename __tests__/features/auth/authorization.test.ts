import { describe, expect, test } from "vitest";

import type { AuthUser } from "@/features/auth/domain/auth-user";
import { getMockAdminUsers } from "@/features/auth/server/mock-admin-users";

const user: AuthUser = {
  id: "mock-user-1",
  email: "user@example.com",
  name: "Demo User",
  role: "USER",
};

const admin: AuthUser = {
  id: "mock-admin-1",
  email: "admin@example.com",
  name: "Demo Admin",
  role: "ADMIN",
};

describe("mock admin users handler", () => {
  test("requires authentication", async () => {
    const response = getMockAdminUsers(null);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("denies a USER", async () => {
    const response = getMockAdminUsers(user);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ code: "FORBIDDEN" });
  });

  test("allows an ADMIN and never returns fixture passwords", async () => {
    const response = getMockAdminUsers(admin);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("admin@example.com");
    expect(body).not.toContain("admin-password");
    expect(body).not.toContain("user-password");
  });
});
