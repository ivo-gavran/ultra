import { auth } from "@/auth";
import type { AuthUser } from "@/features/auth/domain/auth-user";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  return session?.user ?? null;
}
