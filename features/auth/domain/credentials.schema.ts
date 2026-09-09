import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

export type Credentials = z.infer<typeof credentialsSchema>;
