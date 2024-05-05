/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    eden: import('src/functions/middleware/backend.ts').Eden['api']['backend']
    user: import('$types/AuthenticatedUser').AuthenticatedUser | null
  }
}
