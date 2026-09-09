import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
