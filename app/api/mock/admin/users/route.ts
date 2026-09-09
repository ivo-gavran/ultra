import { getCurrentUser } from "@/features/auth/server/current-user";
import { getMockAdminUsers } from "@/features/auth/server/mock-admin-users";

export async function GET() {
  return getMockAdminUsers(await getCurrentUser());
}
