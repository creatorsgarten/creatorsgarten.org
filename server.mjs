import Fastify from 'fastify'
import fastifyMiddie from '@fastify/middie'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'url'
import { handler as ssrHandler } from './dist/server/entry.mjs'

const app = Fastify({ logger: true })

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
    setHeaders: (res, path) => {
      if (path.includes('/_astro/') && path.match(/\.[a-f0-9]{8}\.\w+$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
      }
    },
  })
  .register(fastifyMiddie)
app.use(ssrHandler)

app.listen({ port: +process.env.PORT || 3000 })
