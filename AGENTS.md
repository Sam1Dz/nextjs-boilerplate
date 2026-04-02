# Project Guidelines

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Code Style

- Next.js 16 App Router using `src/app` directory structure.
- **React 19** with React Compiler enabled (manual `useMemo`/`useCallback` generally not needed).
- **Tailwind CSS v4** natively integrated for styling.
- Written in TypeScript.
- Use the `tsdoc` workflow (`/tsdoc`) to generate comprehensive TSDoc comments for components.

## Architecture

- **Server Components by Default:** Keep components as Server Components unless browser API or interactivity is explicitly required (requires `use client`).
- Push `use client` boundaries as deep into the component tree as possible.
- Adhere to the latest Next.js 16 caching, routing, and data fetching paradigms.

## Build and Test

- Package manager: **Bun**
- Install dependencies: `bun install`
- Start dev server: `bun dev`
- Build for production: `bun run build`
- Lint code: `bun run lint`

## Conventions

- Use Conventional Commits (`/commit` workflow).
- Link, don't embed: For deep or detailed standards, link to an external `.md` doc.
