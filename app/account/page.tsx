import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();

  if (session?.user === undefined) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold">Account</h1>
      <p className="mt-4">Signed in as {session.user.email}.</p>
    </main>
  );
}
