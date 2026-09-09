import { beforeEach, describe, expect, test } from "vitest";

import type { AuthUser } from "@/features/auth/domain/auth-user";
import {
  deleteMockComment,
  resetMockComments,
} from "@/features/comments/server/mock-comments";

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

describe("mock comment deletion policy", () => {
  beforeEach(() => {
    resetMockComments();
  });

  test("requires authentication", async () => {
    const response = deleteMockComment("comment-user-owned", null);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("allows the resource owner to delete", () => {
    expect(deleteMockComment("comment-user-owned", user).status).toBe(204);
    expect(deleteMockComment("comment-user-owned", user).status).toBe(404);
  });

  test("denies a non-owner", async () => {
    const response = deleteMockComment("comment-admin-owned", user);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ code: "FORBIDDEN" });
  });

  test("allows an ADMIN to delete another user's resource", () => {
    expect(deleteMockComment("comment-user-admin-delete", admin).status).toBe(
      204,
    );
  });
});
