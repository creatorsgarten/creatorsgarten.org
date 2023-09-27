/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    backend: ReturnType<(typeof import('$functions/getBackend'))['getBackend']>
    user: import('$types/AuthenticatedUser').AuthenticatedUser | null
  }
}
