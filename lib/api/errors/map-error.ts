import type { AppError } from "./app-error";

export type ErrorPresentation =
  "inline" | "auth" | "connectivity" | "retry" | "error-state";

export interface UserFacingError {
  message: string;
  messageKey: string;
  presentation: ErrorPresentation;
  report: boolean;
}

export type ErrorMessageTranslator = (
  messageKey: string,
  defaultMessage: string,
) => string;

const useDefaultMessage: ErrorMessageTranslator = (
  _messageKey,
  defaultMessage,
) => defaultMessage;

type ErrorDescriptor = Omit<UserFacingError, "message"> & {
  defaultMessage: string;
};

const codeMappings: Readonly<Partial<Record<string, ErrorDescriptor>>> = {
  INVALID_CREDENTIALS: {
    messageKey: "errors.invalidCredentials",
    defaultMessage: "Email or password is incorrect.",
    presentation: "inline",
    report: false,
  },
  EMAIL_ALREADY_EXISTS: {
    messageKey: "errors.emailAlreadyExists",
    defaultMessage: "This email is already registered.",
    presentation: "inline",
    report: false,
  },
  UNAUTHORIZED: {
    messageKey: "errors.unauthorized",
    defaultMessage: "Please sign in to continue.",
    presentation: "auth",
    report: false,
  },
  FORBIDDEN: {
    messageKey: "errors.forbidden",
    defaultMessage: "You do not have permission to do that.",
    presentation: "error-state",
    report: false,
  },
  NOT_FOUND: {
    messageKey: "errors.notFound",
    defaultMessage: "The requested item could not be found.",
    presentation: "error-state",
    report: false,
  },
  RATE_LIMITED: {
    messageKey: "errors.rateLimited",
    defaultMessage: "Too many requests. Please try again shortly.",
    presentation: "retry",
    report: false,
  },
};

function translateDescriptor(
  descriptor: ErrorDescriptor,
  translate: ErrorMessageTranslator,
): UserFacingError {
  return {
    message: translate(descriptor.messageKey, descriptor.defaultMessage),
    messageKey: descriptor.messageKey,
    presentation: descriptor.presentation,
    report: descriptor.report,
  };
}

export function mapError(
  error: AppError,
  translate: ErrorMessageTranslator = useDefaultMessage,
): UserFacingError | null {
  if (error.type === "cancelled") {
    return null;
  }

  const codeMapping = codeMappings[error.code];

  if (codeMapping !== undefined) {
    return translateDescriptor(codeMapping, translate);
  }

  switch (error.type) {
    case "network":
      return translateDescriptor(
        {
          messageKey: "errors.network",
          defaultMessage: "Check your internet connection.",
          presentation: "connectivity",
          report: false,
        },
        translate,
      );
    case "timeout":
      return translateDescriptor(
        {
          messageKey: "errors.timeout",
          defaultMessage: "The request took too long. Please try again.",
          presentation: "retry",
          report: false,
        },
        translate,
      );
    case "contract":
      return translateDescriptor(
        {
          messageKey: "errors.invalidResponse",
          defaultMessage: "Something went wrong. Please try again.",
          presentation: "error-state",
          report: true,
        },
        translate,
      );
    case "application":
    case "unknown":
      return translateDescriptor(
        {
          messageKey: "errors.unexpected",
          defaultMessage: "Something went wrong. Please try again.",
          presentation: "error-state",
          report: true,
        },
        translate,
      );
    case "http":
      return translateDescriptor(
        {
          messageKey: "errors.requestFailed",
          defaultMessage:
            "We could not complete the request. Please try again.",
          presentation: "error-state",
          report: error.status === undefined || error.status >= 500,
        },
        translate,
      );
  }
}
