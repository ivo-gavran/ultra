import type { AuthUser } from "./auth-user";
import { credentialsSchema } from "./credentials.schema";

interface DevelopmentAuthFixture {
  readonly user: AuthUser;
  readonly password: string;
}

/**
 * Development and test fixtures only. These plaintext passwords are not a
 * production credential store. Replace `authenticateMockCredentials` with a
 * NestJS API call when the backend auth contract is available.
 */
export const DEVELOPMENT_AUTH_FIXTURES = [
  {
    user: {
      id: "mock-user-1",
      email: "user@example.com",
      name: "Demo User",
      role: "USER",
    },
    password: "user-password",
  },
  {
    user: {
      id: "mock-admin-1",
      email: "admin@example.com",
      name: "Demo Admin",
      role: "ADMIN",
    },
    password: "admin-password",
  },
] as const satisfies readonly DevelopmentAuthFixture[];

export function authenticateMockCredentials(
  credentials: unknown,
): AuthUser | null {
  const parsedCredentials = credentialsSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return null;
  }

  const fixture = DEVELOPMENT_AUTH_FIXTURES.find(
    (candidate) =>
      candidate.user.email === parsedCredentials.data.email &&
      candidate.password === parsedCredentials.data.password,
  );

  return fixture === undefined ? null : { ...fixture.user };
}

export function listMockAuthUsers(): AuthUser[] {
  return DEVELOPMENT_AUTH_FIXTURES.map(({ user }) => ({ ...user }));
}
