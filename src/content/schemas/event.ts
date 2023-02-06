import { z } from 'astro:content'

export const event = z.object({
  name: z.string(),
  location: z.string(),
  date: z
    .string()
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  site: z.string().optional(),
  hosts: z.array(z.string()),
})
