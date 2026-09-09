import axios from "axios";

import { env } from "@/app/env";
import { normalizeError } from "@/lib/api/errors/normalize-error";

const DEFAULT_TIMEOUT_MS = 10_000;

export type AccessTokenProvider = () =>
  Promise<string | null | undefined> | string | null | undefined;

let accessTokenProvider: AccessTokenProvider | undefined;

export function configureApiAccessToken(provider?: AccessTokenProvider) {
  accessTokenProvider = provider;
}

export const apiAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
  transitional: {
    clarifyTimeoutError: true,
  },
});

apiAxios.interceptors.request.use(async (config) => {
  const accessToken = await accessTokenProvider?.();

  if (
    accessToken !== null &&
    accessToken !== undefined &&
    accessToken.trim() !== "" &&
    !config.headers.has("Authorization")
  ) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiAxios.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(normalizeError(error)),
);
