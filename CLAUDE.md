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