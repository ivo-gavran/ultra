import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { usersApi } from "@/lib/api/users/users.api";
import type { CreateUserInput } from "@/lib/api/users/users.schemas";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function userQueryOptions(id: string) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => usersApi.getById(id, { signal }),
  });
}

export function createUserMutationOptions() {
  return mutationOptions({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
  });
}
