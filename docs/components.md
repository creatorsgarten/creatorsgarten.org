# Component Architecture

The project uses a mix of Astro components and React components. Here's how they're organized:

## Core Components
- [src/components/cfImage.astro](../src/components/cfImage.astro) - Cloudflare Image component
- [src/components/breadcrumb.astro](../src/components/breadcrumb.astro) - Navigation breadcrumbs
- [src/components/mainHorizontalPadding.astro](../src/components/mainHorizontalPadding.astro) - Layout padding component

## Feature Components
- [src/components/auth/](../src/components/auth) - Authentication related components
- [src/components/connections/](../src/components/connections) - Social/external connection components
- [src/components/frontpage/](../src/components/frontpage) - Homepage specific components
- [src/components/markdown/](../src/components/markdown) - Markdown rendering components

## Content Components
- [src/components/eventPoster.astro](../src/components/eventPoster.astro) - Event display component
- [src/components/guilds.astro](../src/components/guilds.astro) - Guilds listing component
- [src/components/announcement.astro](../src/components/announcement.astro) - Announcement component
- [src/components/requirementsList.astro](../src/components/requirementsList.astro) - Requirements display
- [src/components/avatarGrid.tsx](../src/components/avatarGrid.tsx) - Grid of user avatars
