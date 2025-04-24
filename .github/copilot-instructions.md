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

## Current Development Focus

- Implementing username reservation system
- Expanding user profile fields via Wiki pages
- User profiles should be stored in Wiki pages rather than in database

## Database Schema Notes

- User data structure is defined in `src/@types/mongo/User/index.ts`
- Only add new fields to the User schema when absolutely necessary
- Prefer storing public user information in Wiki pages

## Wiki Content Schema

The frontmatter schema for person profiles is defined in `src/functions/parseFrontMatter.ts`.
See the `person` object in the `frontMatterSchema` for the complete definition of profile fields.

## Username Rules

- Lowercase alphanumeric characters only [a-z0-9]
- Minimum 3 characters, maximum 30 characters
- Must not conflict with existing paths or reserved words
