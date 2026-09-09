import { describe, expect, test } from "vitest";

import { GET } from "@/app/api/mock/users/[id]/route";
import { POST } from "@/app/api/mock/users/route";
import { backendErrorSchema } from "@/lib/api/errors/backend-error.schema";
import { userSchema } from "@/lib/api/users/users.schemas";

describe("mock users API", () => {
  test("returns a user fixture", async () => {
    const response = await GET(
      new Request("http://localhost/api/mock/users/1"),
      { params: Promise.resolve({ id: "1" }) },
    );
    const responseData: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(userSchema.parse(responseData)).toEqual({
      id: "1",
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  test("returns the NestJS-style not-found contract", async () => {
    const response = await GET(
      new Request("http://localhost/api/mock/users/missing"),
      { params: Promise.resolve({ id: "missing" }) },
    );
    const responseData: unknown = await response.json();

    expect(response.status).toBe(404);
    expect(backendErrorSchema.parse(responseData)).toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
  });

  test("returns the business error contract for a duplicate email", async () => {
    const response = await POST(
      new Request("http://localhost/api/mock/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Another Ada", email: "ada@example.com" }),
      }),
    );
    const responseData: unknown = await response.json();

    expect(response.status).toBe(409);
    expect(backendErrorSchema.parse(responseData)).toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      data: { field: "email" },
    });
  });
});
