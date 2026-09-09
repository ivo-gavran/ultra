import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authUserSchema } from "@/features/auth/domain/auth-user";
import { authenticateMockCredentials } from "@/features/auth/domain/mock-auth.fixture";
import { authorizeRoute } from "@/features/auth/routing";
import { env } from "@/lib/env";

const developmentSecret =
  "development-and-test-only-auth-secret-change-before-production";

export const authConfig = {
  secret:
    env.AUTH_SECRET ??
    (env.NODE_ENV === "production" ? undefined : developmentSecret),
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Development credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authenticateMockCredentials,
    }),
  ],
  callbacks: {
    authorized: authorizeRoute,
    jwt({ token, user }) {
      const parsedUser = authUserSchema.safeParse(user);

      if (parsedUser.success) {
        token.role = parsedUser.data.role;
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: authUserSchema.parse({
          id: token.sub,
          email: token.email,
          name: token.name,
          role: token.role,
        }),
      };
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
