# Development Guide

## Architecture
- Frontend and backend code coexist in the same repository
- Backend exposes a tRPC server that the frontend communicates with
- Two development modes:
  - Remote mode (default): Frontend talks to production backend via network (no credentials needed)
  - Local mode: Frontend talks directly to local backend (requires credentials)

## Important Architectural Rules
- Frontend and backend are treated as separate components despite being in the same repository
- **Only code inside `src/packlets/backend/` folder can access MongoDB** and sensitive secrets
- **Frontend code MUST NOT directly import from backend folder** - must use tRPC
- All frontend-to-backend communication must go through tRPC (available via `Astro.locals.backend`)
- Backend API is publicly accessible, so it must implement proper access controls
- Backend must filter responses to only include data the user is authorized to see
- Never return MongoDB documents directly; always explicitly reconstruct objects with only the fields that should be exposed
- Use explicit DTO (Data Transfer Object) interfaces to define the shape of data returned by the backend

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

## Git Usage Notes
- When using Git with files that contain special characters like brackets (e.g., `[name]` in Astro file paths), always use quotes:
  ```sh
  # Correct
  git add "src/pages/wg/[name]/members.astro"
  
  # Incorrect - will fail with "no matches found"
  git add src/pages/wg/[name]/members.astro
  ```

## Development Environment
- [.envrc](../.envrc) - Environment configuration
- [.devcontainer/](../.devcontainer) - VS Code dev container setup
- [.husky/](../.husky) - Git hooks for code quality

## Docker Development
The project can be run in Docker:
- [Dockerfile](../Dockerfile) - Container image definition
- [docker-compose.yml](../docker-compose.yml) - Local development services

## Package Management
- Uses pnpm as the package manager
- [pnpm-lock.yaml](../pnpm-lock.yaml) - Locked dependencies
- [.npmrc](../.npmrc) - NPM configuration
