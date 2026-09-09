import { apiClient } from "@/lib/api/client";
import {
  type CreateUserInput,
  userSchema,
} from "@/lib/api/users/users.schemas";

interface RequestContext {
  signal?: AbortSignal;
}

export const usersApi = {
  getById(id: string, context: RequestContext = {}) {
    return apiClient.request(`/users/${encodeURIComponent(id)}`, {
      schema: userSchema,
      signal: context.signal,
    });
  },

  create(input: CreateUserInput, context: RequestContext = {}) {
    return apiClient.request("/users", {
      method: "POST",
      schema: userSchema,
      json: input,
      signal: context.signal,
    });
  },
};
