type AuthErrorCode = "UNAUTHORIZED" | "FORBIDDEN";

export function authErrorResponse(
  status: 401 | 403,
  code: AuthErrorCode,
  message: string,
): Response {
  return Response.json(
    {
      statusCode: status,
      code,
      message,
      data: {},
    },
    { status },
  );
}
