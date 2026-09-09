import { mockUsers } from "@/lib/api/users/users.mock";

interface UserRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: UserRouteContext) {
  const { id } = await context.params;
  const user = mockUsers.find((candidate) => candidate.id === id);

  if (user === undefined) {
    return Response.json(
      {
        statusCode: 404,
        code: "NOT_FOUND",
        message: "User not found",
        data: { id },
      },
      { status: 404 },
    );
  }

  return Response.json(user);
}
