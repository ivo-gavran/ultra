import type { AuthRole, AuthUser } from "./auth-user";

export interface OwnedResource {
  readonly authorId: string;
}

/** Role-based access control. */
export function hasRole(user: AuthUser, role: AuthRole): boolean {
  return user.role === role;
}

/** Property/ownership-based access control, with the explicit admin override. */
export function canDeleteOwnedResource(
  user: AuthUser,
  resource: OwnedResource,
): boolean {
  return resource.authorId === user.id || user.role === "ADMIN";
}
