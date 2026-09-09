import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const apiUrlSchema = z.union([
  z.url(),
  z.string().regex(/^\/(?!\/)/, "Use an absolute URL or same-origin path."),
]);

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(32).optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_API_URL: apiUrlSchema.optional(),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ??
      (process.env.NODE_ENV === "production" ? undefined : "/api/mock"),
  },
  emptyStringAsUndefined: true,
});
