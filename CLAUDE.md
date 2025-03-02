# Creatorsgarten.org Development Guide

## Architecture
- Frontend and backend code coexist in the same repository
- Backend exposes a tRPC server that the frontend communicates with
- Two development modes:
  - Remote mode (default): Frontend talks to production backend via network (no credentials needed)
  - Local mode: Frontend talks directly to local backend (requires credentials)

## Build & Development Commands
- `pnpm dev` - Run development server (uses remote mode by default)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm format` - Format code with Prettier
- `npx playwright test` - Run all tests
- `npx playwright test tests/website.spec.ts` - Run specific test file
- `npx playwright test -g "Homepage works"` - Run test by title
- `npx astro check` - Type check the codebase

## Code Style Guidelines
- Use TypeScript with strong typing
- Use path aliases for imports (e.g., `$components/`, `$functions/`)
- Follow Prettier config: no semicolons, arrow parens avoid, single quotes
- Use 2 spaces for indentation, max line width 80 characters
- Use React for interactive components, Astro for static content
- Use Tailwind for styling, follow component patterns in `src/components/`
- Use Zod for schema validation and type inference
- Prefer functional components and hooks over class components
- Use named exports over default exports when possible
- Follow existing file naming conventions (camelCase for utils, PascalCase for components)
- Backend code lives in `src/packlets/backend/` with tRPC endpoints