import axios, { AxiosError, type AxiosResponse } from "axios";

import { AppError, isAppError } from "./app-error";
import { backendErrorSchema } from "./backend-error.schema";

function isAbortError(error: unknown) {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
}

function createHttpError(error: AxiosError, response: AxiosResponse<unknown>) {
  const parsedError = backendErrorSchema.safeParse(response.data);

  if (parsedError.success && parsedError.data.statusCode === response.status) {
    const backendMessage = Array.isArray(parsedError.data.message)
      ? parsedError.data.message.join("; ")
      : parsedError.data.message;

    return new AppError({
      type: "http",
      status: response.status,
      code: parsedError.data.code,
      message: backendMessage,
      data: parsedError.data.data,
      originalError: error,
    });
  }

  return new AppError({
    type: "http",
    status: response.status,
    code: `HTTP_${String(response.status)}`,
    originalError: error,
  });
}

function normalizeAxiosError(error: AxiosError) {
  if (axios.isCancel(error) || error.code === AxiosError.ERR_CANCELED) {
    return new AppError({
      type: "cancelled",
      code: "REQUEST_CANCELLED",
      originalError: error,
    });
  }

  if (
    error.code === AxiosError.ECONNABORTED ||
    error.code === AxiosError.ETIMEDOUT
  ) {
    return new AppError({
      type: "timeout",
      code: "REQUEST_TIMEOUT",
      originalError: error,
    });
  }

  if (error.response !== undefined) {
    return createHttpError(error, error.response);
  }

  if (
    error.code === AxiosError.ERR_NETWORK ||
    error.code === AxiosError.ECONNREFUSED ||
    error.request !== undefined
  ) {
    return new AppError({
      type: "network",
      code: "NETWORK_ERROR",
      originalError: error,
    });
  }

  return new AppError({
    type: "unknown",
    code: "UNKNOWN_ERROR",
    originalError: error,
  });
}

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (axios.isAxiosError<unknown>(error)) {
    return normalizeAxiosError(error);
  }

  if (isAbortError(error)) {
    return new AppError({
      type: "cancelled",
      code: "REQUEST_CANCELLED",
      originalError: error,
    });
  }

  return new AppError({
    type: "unknown",
    code: "UNKNOWN_ERROR",
    originalError: error,
  });
}
