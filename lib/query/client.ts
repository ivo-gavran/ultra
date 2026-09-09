import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

import { shouldRetryRequest } from "@/lib/query/retry";

const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetryRequest,
    },
    mutations: {
      retry: false,
    },
  },
} satisfies QueryClientConfig;

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient(queryClientConfig);
  }

  browserQueryClient ??= new QueryClient(queryClientConfig);
  return browserQueryClient;
}
