import axios, {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { apiAxios, configureApiAccessToken } from "@/lib/api/axios-instance";
import { apiClient, HttpClient } from "@/lib/api/client";
import { AppError } from "@/lib/api/errors/app-error";
import { mapError } from "@/lib/api/errors/map-error";

const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const originalApiAdapter = apiAxios.defaults.adapter;

function createResponse(
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse<unknown> {
  return {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
  };
}

function createResolvedAdapter(data: unknown, status = 200) {
  return vi.fn<AxiosAdapter>((config) =>
    Promise.resolve(createResponse(config, data, status)),
  );
}

function createRejectedResponseAdapter(data: unknown, status: number) {
  return vi.fn<AxiosAdapter>((config) => {
    const response = createResponse(config, data, status);

    return Promise.reject(
      new AxiosError(
        `Request failed with status ${String(status)}`,
        status >= 500
          ? AxiosError.ERR_BAD_RESPONSE
          : AxiosError.ERR_BAD_REQUEST,
        config,
        {},
        response,
      ),
    );
  });
}

function createClient(
  adapter: AxiosAdapter,
  baseURL = "https://api.example.com/v1",
) {
  return new HttpClient(
    axios.create({
      baseURL,
      timeout: 10_000,
      headers: { Accept: "application/json" },
      adapter,
    }),
  );
}

async function captureAppError(promise: Promise<unknown>) {
  try {
    await promise;
    throw new Error("Expected request to reject.");
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    return error as AppError;
  }
}

afterEach(() => {
  apiAxios.defaults.adapter = originalApiAdapter;
  configureApiAccessToken();
});

describe("HttpClient", () => {
  test("uses the configured Axios instance and parses typed data", async () => {
    const adapter = createResolvedAdapter({
      id: "1",
      name: "Ada",
      ignored: true,
    });
    apiAxios.defaults.adapter = adapter;
    configureApiAccessToken(() => "access-token");

    await expect(
      apiClient.request("/items/1", { schema: itemSchema }),
    ).resolves.toEqual({ id: "1", name: "Ada" });
    expect(adapter).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "/api/mock",
        url: "/items/1",
        method: "get",
        timeout: 10_000,
      }),
    );

    const requestConfig = adapter.mock.calls[0][0];
    expect(requestConfig.headers.get("Accept")).toBe("application/json");
    expect(requestConfig.headers.get("Authorization")).toBe(
      "Bearer access-token",
    );
  });

  test("supports a same-origin mock API base path in the browser", async () => {
    const adapter = createResolvedAdapter({ id: "1", name: "Ada" });
    const client = createClient(adapter, "/api/mock");

    await client.request("/items/1", { schema: itemSchema });

    expect(adapter).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "/api/mock",
        url: "/items/1",
      }),
    );
  });

  test("rejects an invalid successful response as a contract error", async () => {
    const client = createClient(createResolvedAdapter({ id: 1, name: "Ada" }));

    const error = await captureAppError(
      client.request("/items/1", { schema: itemSchema }),
    );

    expect(error).toMatchObject({
      type: "contract",
      code: "INVALID_API_RESPONSE",
      data: { id: 1, name: "Ada" },
    });
    expect(error.originalError).toBeInstanceOf(z.ZodError);
  });

  test("normalizes an Axios network failure", async () => {
    const adapter = vi.fn<AxiosAdapter>((config) =>
      Promise.reject(
        new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, {}),
      ),
    );
    const client = createClient(adapter);

    const error = await captureAppError(
      client.request("/items/1", { schema: itemSchema }),
    );

    expect(error).toMatchObject({
      type: "network",
      code: "NETWORK_ERROR",
    });
    expect(axios.isAxiosError(error.originalError)).toBe(true);
  });

  test("normalizes an Axios timeout", async () => {
    const adapter = vi.fn<AxiosAdapter>((config) =>
      Promise.reject(
        new AxiosError("timeout exceeded", AxiosError.ETIMEDOUT, config, {}),
      ),
    );
    const client = createClient(adapter);

    const error = await captureAppError(
      client.request("/items/1", { schema: itemSchema, timeoutMs: 25 }),
    );

    expect(error).toMatchObject({
      type: "timeout",
      code: "REQUEST_TIMEOUT",
    });
  });

  test("distinguishes an intentional Axios cancellation", async () => {
    const controller = new AbortController();
    const adapter = vi.fn<AxiosAdapter>((config) => {
      controller.abort();
      return Promise.reject(new CanceledError("Request cancelled", config));
    });
    const client = createClient(adapter);

    const error = await captureAppError(
      client.request("/items/1", {
        schema: itemSchema,
        signal: controller.signal,
      }),
    );

    expect(error).toMatchObject({
      type: "cancelled",
      code: "REQUEST_CANCELLED",
    });
    expect(mapError(error)).toBeNull();
  });

  test("uses a validated backend status and business code", async () => {
    const client = createClient(
      createRejectedResponseAdapter(
        {
          statusCode: 409,
          code: "EMAIL_ALREADY_EXISTS",
          message: "Email already exists",
          data: { field: "email" },
        },
        409,
      ),
    );

    const error = await captureAppError(
      client.request("/users", { schema: itemSchema }),
    );

    expect(error).toMatchObject({
      type: "http",
      status: 409,
      code: "EMAIL_ALREADY_EXISTS",
      data: { field: "email" },
    });
    expect(axios.isAxiosError(error.originalError)).toBe(true);
    expect(mapError(error)?.message).toBe("This email is already registered.");
  });

  test("falls back safely for a malformed backend error payload", async () => {
    const client = createClient(
      createRejectedResponseAdapter("<html>Bad gateway</html>", 502),
    );

    const error = await captureAppError(
      client.request("/items/1", { schema: itemSchema }),
    );

    expect(error).toMatchObject({
      type: "http",
      status: 502,
      code: "HTTP_502",
      data: undefined,
    });
  });

  test("normalizes an unclassified request failure as unknown", async () => {
    const originalError = new Error("unexpected");
    const adapter = vi.fn<AxiosAdapter>(() => Promise.reject(originalError));
    const client = createClient(adapter);
    const error = await captureAppError(
      client.request("/items/1", { schema: itemSchema }),
    );

    expect(error).toMatchObject({
      type: "unknown",
      code: "UNKNOWN_ERROR",
      originalError,
    });
  });

  test("normalizes Axios failures at the shared response interceptor", async () => {
    apiAxios.defaults.adapter = vi.fn<AxiosAdapter>((config) =>
      Promise.reject(
        new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, {}),
      ),
    );

    const error = await captureAppError(apiAxios.get("/items/1"));

    expect(error).toMatchObject({
      type: "network",
      code: "NETWORK_ERROR",
    });
  });
});
