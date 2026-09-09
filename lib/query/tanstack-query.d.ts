import "@tanstack/react-query";

import type { AppError } from "@/lib/api/errors/app-error";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AppError;
  }
}
