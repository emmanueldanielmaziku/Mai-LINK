import { z } from "zod";

export const AuthSchema = z.object({
  business_number: z.number(),
  business_code: z.number(),
});

export type Auth = z.infer<typeof AuthSchema>;
