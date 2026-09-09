import { mockUsers } from "@/lib/api/users/users.mock";
import { createUserInputSchema } from "@/lib/api/users/users.schemas";
import { z } from "zod";

export async function POST(request: Request) {
  let requestData: unknown;

  try {
    requestData = await request.json();
  } catch {
    return Response.json(
      {
        statusCode: 400,
        code: "INVALID_REQUEST_BODY",
        message: "Request body must be valid JSON",
        data: {},
      },
      { status: 400 },
    );
  }

  const input = createUserInputSchema.safeParse(requestData);

  if (!input.success) {
    return Response.json(
      {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "User data is invalid",
        data: { validation: z.treeifyError(input.error) },
      },
      { status: 400 },
    );
  }

  const emailExists = mockUsers.some(
    (user) => user.email.toLowerCase() === input.data.email.toLowerCase(),
  );

  if (emailExists) {
    return Response.json(
      {
        statusCode: 409,
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email already exists",
        data: { field: "email" },
      },
      { status: 409 },
    );
  }

  return Response.json(
    {
      id: crypto.randomUUID(),
      name: input.data.name,
      email: input.data.email,
    },
    { status: 201 },
  );
}
