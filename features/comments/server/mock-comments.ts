import type { AuthUser } from "@/features/auth/domain/auth-user";
import { canDeleteOwnedResource } from "@/features/auth/domain/authorization";
import { authErrorResponse } from "@/features/auth/server/error-response";

export interface MockComment {
  readonly id: string;
  readonly authorId: string;
  readonly body: string;
}

const initialComments = [
  {
    id: "comment-user-owned",
    authorId: "mock-user-1",
    body: "Owned by the USER fixture.",
  },
  {
    id: "comment-admin-owned",
    authorId: "mock-admin-1",
    body: "Owned by the ADMIN fixture.",
  },
  {
    id: "comment-user-admin-delete",
    authorId: "mock-user-1",
    body: "May also be deleted by an admin.",
  },
] as const satisfies readonly MockComment[];

let comments = new Map<string, MockComment>(
  initialComments.map((comment) => [comment.id, { ...comment }]),
);

export function resetMockComments(): void {
  comments = new Map<string, MockComment>(
    initialComments.map((comment) => [comment.id, { ...comment }]),
  );
}

export function deleteMockComment(id: string, user: AuthUser | null): Response {
  if (user === null) {
    return authErrorResponse(401, "UNAUTHORIZED", "Authentication required");
  }

  const comment = comments.get(id);

  if (comment === undefined) {
    return Response.json(
      {
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Comment not found",
        data: { id },
      },
      { status: 404 },
    );
  }

  if (!canDeleteOwnedResource(user, comment)) {
    return authErrorResponse(
      403,
      "FORBIDDEN",
      "Only the comment author or an admin may delete this comment",
    );
  }

  comments.delete(id);
  return new Response(null, { status: 204 });
}
