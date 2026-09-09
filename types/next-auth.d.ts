import type { AuthRole } from "@/features/auth/domain/auth-user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: AuthRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: AuthRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AuthRole;
  }
}
