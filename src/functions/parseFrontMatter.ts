import { z } from 'zod'

const ISODate = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Date must be a string formatted like this: "YYYY-MM-DD". Note that in YAML, you must wrap the date in quotes.'
  )

export const frontMatterSchema = z.object({
  event: z
    .object({
      name: z.string(),
      location: z.string().optional(),
      date: ISODate,
      endDate: ISODate.optional(),
      hosts: z.array(z.string()).default([]),
      site: z.string().optional(),
      eventpopId: z.coerce.number().optional(),
      unlisted: z.boolean().optional(),
    })
    .optional(),

  sponsor: z
    .object({
      name: z.string(),
      site: z.string().optional(),
    })
    .optional(),

  venue: z
    .object({
      name: z.string(),
      site: z.string().optional(),
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
