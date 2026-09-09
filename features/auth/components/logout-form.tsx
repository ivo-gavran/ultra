import { logoutAction } from "@/features/auth/actions";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        className="rounded-lg border border-zinc-300 px-4 py-2 font-medium"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
