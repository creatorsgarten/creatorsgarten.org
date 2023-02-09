import { z, defineCollection } from 'astro:content'
import { event as eventSchema } from './schemas/_event'

const eventCollection = defineCollection({
  schema: eventSchema,
})

export const collections = {
  event: eventCollection,
}
