import type { User } from "@/lib/api/users/users.schemas";

export const mockUsers = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@example.com",
  },
] as const satisfies readonly User[];
