import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LogoutForm } from "@/features/auth/components/logout-form";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user === undefined) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-zinc-500">Protected route</p>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl border border-zinc-200 p-5">
        <dt className="font-medium">Name</dt>
        <dd>{session.user.name}</dd>
        <dt className="font-medium">Email</dt>
        <dd>{session.user.email}</dd>
        <dt className="font-medium">Role</dt>
        <dd>{session.user.role}</dd>
      </dl>
      <div className="flex items-center gap-4">
        <Link className="underline" href="/admin">
          Admin area
        </Link>
        <LogoutForm />
      </div>
    </main>
  );
}
