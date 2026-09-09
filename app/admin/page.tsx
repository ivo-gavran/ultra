import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/features/auth/domain/authorization";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user === undefined) {
    redirect("/login");
  }

  if (!hasRole(session.user, "ADMIN")) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <p className="text-sm font-medium text-red-700">FORBIDDEN</p>
        <h1 className="mt-2 text-3xl font-semibold">Admin access required</h1>
        <p className="mt-4 text-zinc-600">
          The server rendered this denial from your session role. The mock admin
          API independently enforces the same rule.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-sm font-medium text-emerald-700">AUTHORIZED</p>
      <h1 className="mt-2 text-3xl font-semibold">Admin area</h1>
      <p className="mt-4 text-zinc-600">
        Your ADMIN role passed the server-side RBAC check.
      </p>
    </main>
  );
}
