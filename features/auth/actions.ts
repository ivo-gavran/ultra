"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { credentialsSchema } from "@/features/auth/domain/credentials.schema";
import { getSafeRedirectPath } from "@/features/auth/domain/redirect";

export interface LoginActionState {
  code?: "INVALID_CREDENTIALS";
  message?: string;
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!credentials.success) {
    return {
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect.",
    };
  }

  try {
    await signIn("credentials", {
      ...credentials.data,
      redirectTo: getSafeRedirectPath(formData.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return {
        code: "INVALID_CREDENTIALS",
        message: "Email or password is incorrect.",
      };
    }

    throw error;
  }

  return {};
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
