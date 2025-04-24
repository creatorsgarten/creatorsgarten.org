# GitHub Copilot Instructions

This document provides guidance for GitHub Copilot when working with the Creatorsgarten.org codebase.

## Project Overview

Creatorsgarten.org is built with:

- Astro
- TypeScript
- MongoDB for data storage
- Wiki system for content management

## Key Concepts

### User System

- Users authenticate via Eventpop
- User data is stored in MongoDB
- Users can connect external accounts (GitHub, Discord, Google, Figma)
- Username system allows users to have unique identifiers

### Wiki System

- Content is stored in markdown files with frontmatter
- Person profiles are stored at `People/[username]` path
- Frontmatter schema validates content structure

## Code Style Guidelines

- Use TypeScript for type safety
- Follow existing patterns for new components and functions
- Use zod for schema validation
- Use optional chaining and nullish coalescing where appropriate

## Architecture Patterns

### Frontend-Backend Separation

- The application has two distinct parts: Astro server and tRPC backend
- Astro pages must not import backend functions directly
- Access backend functionality in Astro via `Astro.locals.backend`
- Access authenticated user in Astro via `Astro.locals.user`

### Backend Organization

- Backend code should be modular and organized by feature:
  - Create a directory for each feature under `src/packlets/backend/`
  - Split implementations into service files (business logic) and router files (API definition)
  - Keep the main backend index.ts file clean by importing routers from feature modules

### Database Schema Design

- Follow single-source-of-truth principle: avoid redundant data storage
- Use appropriate MongoDB data types and schemas

## Current Development Focus

- Implementing username reservation system
- Expanding user profile fields via Wiki pages
- User profiles should be stored in Wiki pages rather than in database
- Working Group system to centralize member information for events

## Database Schema Notes

- User data structure is defined in `src/@types/mongo/User/index.ts`
- Only add new fields to the User schema when absolutely necessary
- Prefer storing public user information in Wiki pages
- New MongoDB schemas should be defined in `src/@types/mongo/` directory

## Wiki Content Schema

The frontmatter schema for person profiles is defined in `src/functions/parseFrontMatter.ts`.
See the `person` object in the `frontMatterSchema` for the complete definition of profile fields.

## Username Rules

- Lowercase alphanumeric characters only [a-z0-9]
- Minimum 3 characters, maximum 30 characters
- Must not conflict with existing paths or reserved words
