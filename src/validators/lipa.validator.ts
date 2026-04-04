import {z} from 'zod'

export const LipaSchema = z.object({
    lipa_name: z.string(),
    lipa_number: z.number(),
    lipa_network: z.string()
});

export type Lipa = z.infer<typeof LipaSchema>