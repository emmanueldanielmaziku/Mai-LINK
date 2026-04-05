import { z } from "zod";

export const LinkSchema = z.object({
  amount: z.number(),
});

export type Link = z.infer<typeof LinkSchema>;
