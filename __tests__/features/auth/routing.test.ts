import type { Session } from "next-auth";
import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";

import { authorizeRoute } from "@/features/auth/routing";

const userSession: Session = {
  expires: "2099-01-01T00:00:00.000Z",
  user: {
    id: "mock-user-1",
    email: "user@example.com",
    name: "Demo User",
    role: "USER",
  },
};

describe("Auth.js proxy route authorization", () => {
  test("redirects a guest from a protected route to login", () => {
    const result = authorizeRoute({
      auth: null,
      request: new NextRequest("https://example.test/dashboard?tab=profile"),
    });

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(307);
    expect((result as Response).headers.get("location")).toBe(
      "https://example.test/login?callbackUrl=%2Fdashboard%3Ftab%3Dprofile",
    );
  });

  test("redirects an authenticated user away from a guest-only route", () => {
    const result = authorizeRoute({
      auth: userSession,
      request: new NextRequest("https://example.test/login"),
    });

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get("location")).toBe(
      "https://example.test/dashboard",
    );
  });

  test("allows public routes", () => {
    expect(
      authorizeRoute({
        auth: null,
        request: new NextRequest("https://example.test/"),
      }),
    ).toBe(true);
  });
});
