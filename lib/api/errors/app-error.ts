export type AppErrorType =
  | "network"
  | "timeout"
  | "cancelled"
  | "http"
  | "contract"
  | "application"
  | "unknown";

export interface AppErrorOptions {
  type: AppErrorType;
  code: string;
  message?: string;
  status?: number;
  data?: unknown;
  originalError?: unknown;
}

function getDefaultMessage(options: AppErrorOptions) {
  if (options.type === "http" && options.status !== undefined) {
    return `Request failed with HTTP status ${String(options.status)}.`;
  }

  return options.code;
}

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly code: string;
  readonly status: number | undefined;
  readonly data: unknown;
  readonly originalError: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message ?? getDefaultMessage(options), {
      cause: options.originalError,
    });

    this.name = "AppError";
    this.type = options.type;
    this.code = options.code;
    this.status = options.status;
    this.data = options.data;
    this.originalError = options.originalError;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
