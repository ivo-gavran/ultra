import type { AuthUser } from "@/features/auth/domain/auth-user";
import { hasRole } from "@/features/auth/domain/authorization";
import { listMockAuthUsers } from "@/features/auth/domain/mock-auth.fixture";
import { authErrorResponse } from "@/features/auth/server/error-response";

export function getMockAdminUsers(user: AuthUser | null): Response {
  if (user === null) {
    return authErrorResponse(401, "UNAUTHORIZED", "Authentication required");
  }

  if (!hasRole(user, "ADMIN")) {
    return authErrorResponse(403, "FORBIDDEN", "Admin role required");
  }

  return Response.json({ users: listMockAuthUsers() });
}
