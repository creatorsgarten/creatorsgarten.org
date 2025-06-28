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

## Wiki Editing Instructions for AI Agents

This project uses a sophisticated wiki-driven content management system. For comprehensive wiki documentation, see the [Wiki Guide](./docs/wiki-guide.md).

### Prerequisites for AI Agents
**IMPORTANT**: Before attempting any wiki edits, you MUST:
1. **Ask the user to log in** with an account that has editing permissions
2. **Verify permissions** by checking if editor pages show edit controls (not read-only mode)  
3. **Refuse to edit** if user lacks proper permissions - tell them they must log in as the right user

The wiki editor pages will display the specific requirements and provide login links if permissions are insufficient.

### Quick Reference for AI Agents
- **Environment URLs**: `http://localhost:5173/` (dev) or `https://creatorsgarten.org/` (production)
- **Editor URL pattern**: `/wiki/[PageName]/editor`
- **Common editors**: `/wiki/WebsiteConfig/editor`, `/wiki/Events/[name]/editor`, `/wiki/People/[username]/editor`
- **Template browsing**: `/wiki/Template`

For detailed information about file structure, available templates, and content creation workflows, refer to the [Wiki Guide](./docs/wiki-guide.md).