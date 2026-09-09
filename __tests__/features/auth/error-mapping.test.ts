import { describe, expect, test } from "vitest";

import { AppError } from "@/lib/api/errors/app-error";
import { mapError } from "@/lib/api/errors/map-error";

describe("authentication error mapping", () => {
  test.each([
    ["INVALID_CREDENTIALS", "errors.invalidCredentials", "inline"],
    ["UNAUTHORIZED", "errors.unauthorized", "auth"],
    ["FORBIDDEN", "errors.forbidden", "error-state"],
    ["SESSION_EXPIRED", "errors.sessionExpired", "auth"],
  ] as const)("maps %s", (code, messageKey, presentation) => {
    const error = new AppError({ type: "http", code, status: 401 });

    expect(mapError(error)).toMatchObject({
      messageKey,
      presentation,
      report: false,
    });
  });
});
