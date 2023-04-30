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
  websiteConfig: z
    .object({
      featureFlags: z.object({
        example: z.boolean(),
      }),
      events: z.object({
        recurring: z.array(
          z.object({
            name: z.string(),
            schedule: z.string(),
          })
        ),
      }),
    })
    .optional(),
})

// Make sure that all properties are optional.
// This is because we don't want to throw an error if the frontmatter is empty.
frontMatterSchema.parse({}) // <- Will throw an error if any property is required

export function parseFrontMatter(data: any) {
  return frontMatterSchema.safeParse(data)
}

export type FrontMatter = z.infer<typeof frontMatterSchema>
