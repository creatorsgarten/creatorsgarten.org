/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    backend: import('$functions/getBackend').Backend
    user: import('$types/AuthenticatedUser').AuthenticatedUser | null
  }
}
