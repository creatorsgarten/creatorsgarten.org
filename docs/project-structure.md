# Project Structure Guide

This is the Creatorsgarten.org website codebase, built with Astro. Here's how the project is organized:

## Core Configuration Files
- [astro.config.mjs](../astro.config.mjs) - Main Astro configuration
- [tailwind.config.mjs](../tailwind.config.mjs) - Tailwind CSS configuration
- [tsconfig.json](../tsconfig.json) - TypeScript configuration
- [package.json](../package.json) - Project dependencies and scripts

## Source Code Structure
The main source code is in the `src` directory:
- [src/pages/](../src/pages) - Astro pages and routes
- [src/components/](../src/components) - Reusable UI components
- [src/packlets/](../src/packlets) - Modular feature packages
- [src/functions/](../src/functions) - Utility functions
- [src/utils/](../src/utils) - Helper utilities
- [src/constants/](../src/constants) - Shared constants
- [src/@types/](../src/@types) - TypeScript type definitions
- [src/middleware.ts](../src/middleware.ts) - Request middleware

## Development and Testing
- [playwright.config.ts](../playwright.config.ts) - E2E testing configuration
- [tests/](../tests) - Test files
- [docker-compose.yml](../docker-compose.yml) - Docker development setup

## Project Structure Overview

This project is a monorepo built with Astro, housing both the frontend and backend components. The primary codebase resides within the `src/` directory.

Key directories include:

*   `src/@types/`: Contains all TypeScript type definitions, including those for MongoDB schemas.
*   `src/components/`: Reusable UI components, primarily built with Astro, React (.tsx), and Svelte (.svelte).
*   `src/constants/`: Application-wide constants and configurations.
*   `src/functions/`: Utility functions used across the application. This includes specialized subdirectories like `middleware/` for Astro middleware and `wiki/` for wiki-related functionalities.
*   `src/middleware.ts`: Astro middleware for request processing.
*   `src/pages/`: Defines the application's routes and web pages, following Astro's file-based routing conventions. This includes API routes under `src/pages/api/`.
*   `src/packlets/`: This is a core organizational concept in this project. **Packlets** are modules encapsulating specific feature areas or domains. They might contain UI components, backend logic, type definitions, and utility functions relevant to that domain. Notable packlets include:
    *   `backend/`: Contains all backend logic, primarily the tRPC API router and its procedures. This is the only part of the application that should directly interact with the database and handle sensitive secrets.
    *   `wiki/`: Manages functionality related to the wiki system.
    *   `events/`: Handles event-related features.
    *   `dashboard/`: Components and logic for the user dashboard.
    *   `workingGroups/`: Features related to collaborative working groups.
    *   And others like `commons/`, `gartenfi/`, `layouts/`, `markdown/`, `staffList/`, `videos/`.

Below is a high-level diagram illustrating the architecture:

```mermaid
graph TD
    User -->|HTTPS| AstroFrontend[Astro Frontend (SSR - src/pages, src/components, src/packlets)]
    AstroFrontend -->|tRPC (via Astro.locals.backend)| BackendAPI[Backend API (src/packlets/backend)]
    BackendAPI -->|MongoDB Driver| MongoDB[(MongoDB)]
    BackendAPI -->|API Calls| Cloudinary[Cloudinary API]
    BackendAPI -->|OAuth2/API| AuthProviders[OAuth Providers (GitHub, Google, Discord, Figma)]
    BackendAPI -->|API Calls| Eventpop[Eventpop API]
    AstroFrontend -->|Fetch/Embed| WikiContent[wiki.creatorsgarten.org (External Content)]

    subgraph "creatorsgarten.org Monorepo (src/)"
        AstroFrontend
        BackendAPI
    end
```

This structure promotes modularity and separation of concerns, with `packlets/backend/` serving as the clear boundary for server-side operations.

## Environment Variables

The application requires a comprehensive set of environment variables for its operation. These are defined in `astro.config.mjs` and should be provided via an `.env` file locally (copied from `.env.example`) or through the deployment environment's configuration.

Key categories of environment variables include:

*   **Backend & Content URLs:** Endpoints for backend services and content APIs.
*   **API Credentials:** Keys for various internal and third-party services.
*   **OAuth Client Credentials:** For services like Discord, GitHub, Google, Figma, and Eventpop.
*   **Database Connection Details:** For connecting to MongoDB.
*   **Security Keys:** Secrets for CSRF protection, JWT signing, etc.
*   **Sentry Configuration:** DSN and auth token for error reporting.

Please refer to the `.env.example` file for a complete list of required and optional environment variables.
