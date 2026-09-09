import { z } from "zod";

export const authRoleSchema = z.enum(["USER", "ADMIN"]);

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  role: authRoleSchema,
});

export type AuthRole = z.infer<typeof authRoleSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
