# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Getting Started

Refer to the [README.md](./README.md) for project overview, quick start commands, and links to detailed documentation in the `docs/` folder.

## Architecture-Specific Guidance

**Packlets System**: This codebase uses a modular packlets architecture in `src/packlets/`:
- `backend/` - ONLY this packlet can access MongoDB and secrets. Frontend code MUST NOT import from here.
- All frontend-backend communication MUST go through tRPC via `Astro.locals.backend`
- Cross-packlet dependencies should be minimized

**Security Boundaries**: Never directly access database or secrets from frontend code. Use the tRPC interface exclusively.

**Development Patterns**:
- Check existing patterns and libraries before adding new dependencies
- Follow the packlets architecture - keep features self-contained
- Environment variables are strictly typed via Astro's env schema in `astro.config.mjs`
- Use pnpm (required package manager)

## Key Commands Beyond README

```bash
# Type check entire codebase (recommended before commits)
npx astro check

# Single test runs
npx playwright test --headed  # Run with browser visible
```

## Wiki Editing Guide

This project uses a sophisticated wiki-driven content management system where content, templates, and configuration are stored in the wiki itself (GitHub repository: `creatorsgarten/wiki`).

### Editing Prerequisites
**IMPORTANT**: Before attempting any wiki edits, you MUST:
1. **Ask the user to log in** with an account that has editing permissions
2. **Verify permissions** by checking if editor pages show edit controls (not read-only mode)
3. **Refuse to edit** if user lacks proper permissions - tell them they must log in as the right user

The wiki editor pages will display the specific requirements and provide login links if permissions are insufficient.

### Environment URLs
- **Development**: `http://localhost:5173/` (when dev server is running)
- **Production**: `https://creatorsgarten.org/` (use when dev server unavailable)
- Always use relative paths starting with `/` in examples

### Content Types & Editor URLs
- **Events**: `/wiki/Events/[eventname]/editor` (e.g., `/wiki/Events/aliens/editor`)
- **People profiles**: `/wiki/People/[username]/editor` (e.g., `/wiki/People/dtinth/editor`)
- **Templates**: `/wiki/Template/[templatename]/editor` (e.g., `/wiki/Template/EventBox/editor`)
- **Site configuration**: `/wiki/WebsiteConfig/editor`
- **General pages**: `/wiki/[pagename]/editor`
- **Browse all templates**: `/wiki/Template`

### Wiki File Structure
Pages use YAML front matter + Markdown:
```yaml
---
# Structured data (YAML)
image: https://usercontent.creatorsgarten.org/c/v.../image.webp
event:
  name: Event Name
  date: "2025-05-18"
  location: Venue Name
---

# Markdown content starts here
Content with template includes like:
{% render 'EventBox', name: ref %}
```

### Template System
- **Available templates**: Check `/wiki/Template` for full list
- **Usage syntax**: `{% render 'TemplateName', param: value %}`
- **Common templates**:
  - `Event` - Event links with icons
  - `EventBox` - Event navigation with related links  
  - `EventpopButton` - Ticket purchase buttons
  - `Person` - Person profile links
- **Template editing**: Templates themselves are wiki pages at `/wiki/Template/[name]/editor`

### Site Configuration
- **WebsiteConfig**: Controls feature flags, recurring events, guild listings, service integrations, announcements
- **Location**: `/wiki/WebsiteConfig/editor`
- **Cache**: Changes take up to 1 minute to propagate due to caching

### Important Notes
- All changes are Git version controlled
- Images must be uploaded to `usercontent.creatorsgarten.org` via `/dashboard/upload`
- Uses Liquid template engine for dynamic content
- Templates can reference other templates and query wiki data
- Content supports both Thai and English naturally