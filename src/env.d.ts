import type { AuthenticatedUser } from '$types/AuthenticatedUser'

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
      user: AuthenticatedUser | null
    }
  }
}
