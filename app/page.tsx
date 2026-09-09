import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Next.js + Auth.js
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Authentication and authorization starter
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600">
          Cookie-backed sessions, lightweight route protection, server-side
          RBAC, and resource ownership policies with deterministic development
          users.
        </p>
      </div>
      <nav className="flex flex-wrap gap-3">
        <Link
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white"
          href="/login"
        >
          Sign in
        </Link>
        <Link
          className="rounded-lg border border-zinc-300 px-4 py-2 font-medium"
          href="/dashboard"
        >
          Protected dashboard
        </Link>
        <Link
          className="rounded-lg border border-zinc-300 px-4 py-2 font-medium"
          href="/admin"
        >
          Admin area
        </Link>
      </nav>
    </main>
  );
}
