import { z, defineCollection } from 'astro:content'
import { eventSchema } from './schemas'

const eventCollection = defineCollection({
  schema: eventSchema,
})

export const collections = {
  event: eventCollection,
}
