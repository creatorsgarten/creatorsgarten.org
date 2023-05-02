import { z } from 'zod'

const announcementSchema = z.object({
  message: z.string(),
  link: z.string().optional(),
  enabled: z.boolean(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
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
      })
    ),
  }),
  announcements: z.record(announcementSchema),
})

export type WebsiteConfig = z.infer<typeof websiteConfigSchema>
