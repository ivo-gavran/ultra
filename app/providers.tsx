"use client";

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

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

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient(queryClientConfig);
  }

  browserQueryClient ??= new QueryClient(queryClientConfig);
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
