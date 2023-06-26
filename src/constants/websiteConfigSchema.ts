import { z } from 'zod'

const announcementSchema = z.object({
  message: z.string(),
  link: z.string().nullish(),
  enabled: z.boolean(),
  start: z.coerce.date().nullish(),
  end: z.coerce.date().nullish(),
})

export const websiteConfigSchema = z.object({
  featureFlags: z.object({
    example: z.boolean(),
  }),
  events: z.object({
    recurring: z.array(
      z.object({
        name: z.string(),
        schedule: z.string(),
        url: z.string(),
      })
    ),
  }),
  announcements: z.record(announcementSchema),
})

export type WebsiteConfig = z.infer<typeof websiteConfigSchema>
