import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const apiUrlSchema = z.union([
  z.url(),
  z.string().regex(/^\/(?!\/)/, "Use an absolute URL or same-origin path."),
]);

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_API_URL: apiUrlSchema.optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ??
      (process.env.NODE_ENV === "production" ? undefined : "/api/mock"),
  },
  emptyStringAsUndefined: true,
});
