/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { AuthenticatedUser } from '$types/AuthenticatedUser'

declare global {
  namespace App {
    interface Locals {
      user: AuthenticatedUser | null
    }
  }
}
