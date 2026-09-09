"use client";

import { useActionState } from "react";

import { loginAction, type LoginActionState } from "@/features/auth/actions";

const initialState: LoginActionState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2 font-normal"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2 font-normal"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.message === undefined ? null : (
        <p className="text-sm text-red-700" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}
      <button
        className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
