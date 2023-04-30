import { z } from 'zod'

export const frontMatterSchema = z.object({
  event: z
    .object({
      name: z.string(),
      location: z.string().optional(),
      date: z.string(),
      endDate: z.string().optional(),
      hosts: z.array(z.string()).default([]),
      site: z.string().optional(),
      eventpopId: z.coerce.number().optional(),
    })
    .optional(),
})

export function parseFrontMatter(data: any) {
  return frontMatterSchema.safeParse(data)
}
