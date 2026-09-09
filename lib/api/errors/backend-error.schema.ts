import { z } from "zod";

const backendMessageSchema = z.union([
  z.string(),
  z.array(z.string()).nonempty(),
]);

export const backendErrorSchema = z.object({
  statusCode: z.number().int().min(400).max(599),
  code: z
    .string()
    .trim()
    .regex(/^[A-Z][A-Z0-9_]*$/),
  message: backendMessageSchema,
  data: z.unknown().optional(),
});

export type BackendError = z.infer<typeof backendErrorSchema>;
