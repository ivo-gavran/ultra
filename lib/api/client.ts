import type { AxiosInstance, RawAxiosRequestHeaders } from "axios";
import type { z } from "zod";

import { apiAxios } from "@/lib/api/axios-instance";
import { AppError } from "@/lib/api/errors/app-error";
import { normalizeError } from "@/lib/api/errors/normalize-error";

interface RequestOptions<TSchema extends z.ZodType> {
  schema: TSchema;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  json?: unknown;
  headers?: RawAxiosRequestHeaders;
  signal?: AbortSignal;
  timeoutMs?: number;
}

function validateResponse<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.output<TSchema> {
  let result: z.ZodSafeParseResult<z.output<TSchema>>;

  try {
    result = schema.safeParse(data);
  } catch (error) {
    throw new AppError({
      type: "contract",
      code: "INVALID_API_RESPONSE",
      data,
      originalError: error,
    });
  }

  if (!result.success) {
    throw new AppError({
      type: "contract",
      code: "INVALID_API_RESPONSE",
      data,
      originalError: result.error,
    });
  }

  return result.data;
}

export class HttpClient {
  constructor(private readonly transport: AxiosInstance) {}

  async request<TSchema extends z.ZodType>(
    path: string,
    options: RequestOptions<TSchema>,
  ): Promise<z.output<TSchema>> {
    this.assertConfiguration(options.timeoutMs);

    try {
      const response = await this.transport.request<unknown>({
        url: path,
        method: options.method ?? "GET",
        data: options.json,
        headers: options.headers,
        signal: options.signal,
        timeout: options.timeoutMs,
      });

      return validateResponse(options.schema, response.data);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  private assertConfiguration(timeoutMs: number | undefined) {
    const baseUrl = this.transport.defaults.baseURL;

    if (baseUrl === undefined || baseUrl.trim() === "") {
      throw new AppError({
        type: "application",
        code: "MISSING_CONFIGURATION",
        message: "NEXT_PUBLIC_API_URL is not configured.",
      });
    }

    if (baseUrl.startsWith("/") && typeof window === "undefined") {
      throw new AppError({
        type: "application",
        code: "RELATIVE_API_URL_ON_SERVER",
        message: "Server-side API requests require an absolute API URL.",
      });
    }

    if (
      timeoutMs !== undefined &&
      (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    ) {
      throw new AppError({
        type: "application",
        code: "INVALID_TIMEOUT",
        message: "Request timeout must be a positive finite number.",
      });
    }
  }
}

export const apiClient = new HttpClient(apiAxios);
