import { z } from 'zod'

const announcementSchema = z.object({
  message: z.string(),
  link: z.string().nullish(),
  enabled: z.boolean(),
  start: z.coerce.date().nullish(),
  end: z.coerce.date().nullish(),
})

export const websiteConfigSchema = z.object({
  announcements: z.record(announcementSchema),
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
  integrations: z.object({
    services: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        url: z.string(),
      })
    ),
  }),
})

export type WebsiteConfig = z.infer<typeof websiteConfigSchema>
