import { z } from "zod"

export const BusinessSchema = z.object({
  business_name: z.string(),
  business_number: z.number(),
  business_network: z.string(),
  business_code: z.number(),
});

export type Business = z.infer<typeof BusinessSchema>