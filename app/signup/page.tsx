import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold">Sign up</h1>
      <p className="text-zinc-600">
        Account creation is intentionally unavailable in the deterministic mock.
        It will be connected when the NestJS registration contract exists.
      </p>
      <Link className="underline" href="/login">
        Sign in with a fixture account
      </Link>
    </main>
  );
}
