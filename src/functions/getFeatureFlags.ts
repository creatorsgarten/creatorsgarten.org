import type { AstroGlobal } from 'astro'
import type { FrontMatter } from './parseFrontMatter'
import type { WebsiteConfig } from '$constants/websiteConfigSchema'

const queryOnlyFeatureFlags = ['staging'] as const
const queryOnlyFeatureFlagSet = new Set<string>(queryOnlyFeatureFlags)

type FeatureFlagKeyFromConfig = keyof NonNullable<
  FrontMatter['websiteConfig']
>['featureFlags']

type FeatureFlagKeyFromQuery = (typeof queryOnlyFeatureFlags)[number]

export type FeatureFlagKey = FeatureFlagKeyFromConfig | FeatureFlagKeyFromQuery

type AstroContext = Pick<AstroGlobal, 'url'>

export function getFeatureFlags(
  Astro: AstroContext,
  websiteConfig: WebsiteConfig | null
): {
  isEnabled: (name: FeatureFlagKey) => boolean
}
export function getFeatureFlags(Astro: AstroContext): {
  isEnabled: (name: FeatureFlagKeyFromQuery) => boolean
}
export function getFeatureFlags(
  Astro: AstroContext,
  websiteConfig?: WebsiteConfig | null
) {
  const queryFlagSet = new Set(
    (Astro.url.searchParams.get('flags') || '').split(',')
  )
  return {
    isEnabled: (name: string) => {
      if (queryFlagSet.has(name)) return true
      if (queryFlagSet.has(`-${name}`)) return false
      if (queryOnlyFeatureFlagSet.has(name)) return false
      return (
        ((websiteConfig?.featureFlags || {}) as Record<string, boolean>)[
          name
        ] ?? false
      )
    },
  }
}
