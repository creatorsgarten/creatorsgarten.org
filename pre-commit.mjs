#!/usr/bin/env zx

import 'zx/globals'

$.verbose = false

await Promise.all([$`pnpm astro check`]).catch(() => {
  console.error('Type-checking failed')
  process.exit(1)
})
