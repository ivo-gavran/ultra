const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

export function getSafeRedirectPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return value;
}
