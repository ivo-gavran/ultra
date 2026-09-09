import { isAppError } from "@/lib/api/errors/app-error";

const TRANSIENT_HTTP_STATUSES = new Set([500, 502, 503, 504]);
const MAX_RETRIES = 1;

export function shouldRetryRequest(failureCount: number, error: Error) {
  if (failureCount >= MAX_RETRIES || !isAppError(error)) {
    return false;
  }

  if (error.type === "network" || error.type === "timeout") {
    return true;
  }

  return (
    error.type === "http" &&
    error.status !== undefined &&
    TRANSIENT_HTTP_STATUSES.has(error.status)
  );
}
