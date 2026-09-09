import { getCurrentUser } from "@/features/auth/server/current-user";
import { deleteMockComment } from "@/features/comments/server/mock-comments";

interface CommentRouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  _request: Request,
  context: CommentRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  return deleteMockComment(id, await getCurrentUser());
}
