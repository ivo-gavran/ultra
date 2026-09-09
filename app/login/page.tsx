import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeRedirectPath } from "@/features/auth/domain/redirect";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;
  const redirectPath = getSafeRedirectPath(
    Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl,
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-zinc-500">Auth.js demo</p>
        <h1 className="text-3xl font-semibold">Sign in</h1>
      </div>
      <LoginForm callbackUrl={redirectPath} />
      <aside className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700">
        <p className="font-semibold">Development fixtures</p>
        <p>USER: user@example.com / user-password</p>
        <p>ADMIN: admin@example.com / admin-password</p>
      </aside>
      <Link className="text-sm underline" href="/">
        Back home
      </Link>
    </main>
  );
}
