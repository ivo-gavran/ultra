import { describe, expect, test } from "vitest";

import { authenticateMockCredentials } from "@/features/auth/domain/mock-auth.fixture";

describe("mock credential authentication", () => {
  test("authenticates the deterministic USER fixture", () => {
    expect(
      authenticateMockCredentials({
        email: "USER@example.com",
        password: "user-password",
      }),
    ).toEqual({
      id: "mock-user-1",
      email: "user@example.com",
      name: "Demo User",
      role: "USER",
    });
  });

  test("authenticates the deterministic ADMIN fixture", () => {
    expect(
      authenticateMockCredentials({
        email: "admin@example.com",
        password: "admin-password",
      }),
    ).toMatchObject({
      id: "mock-admin-1",
      role: "ADMIN",
    });
  });

  test("rejects invalid credentials without returning identity data", () => {
    expect(
      authenticateMockCredentials({
        email: "user@example.com",
        password: "wrong-password",
      }),
    ).toBeNull();
  });
});
