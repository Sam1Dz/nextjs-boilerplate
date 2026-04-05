# Project Guidelines

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Code Style

- Next.js 16 App Router using `src/app` directory structure.
- **React 19** with React Compiler enabled (manual `useMemo`/`useCallback` generally not needed).
- **HeroUI** (`@heroui/react`) combined with **Tailwind CSS v4** for UI components.
- Written in TypeScript. Path aliases use `~/` instead of `@/` (e.g. `~/components/...`).
- Use the `tsdoc` workflow (`/tsdoc`) to generate comprehensive TSDoc comments for components.
- Run `bun run format` (Prettier) and `bun run lint:fix` (ESLint) to align code automatically.

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
- Tests: **Jest** + **Testing Library**.
  - Run tests with `bun run test` or `bun run test:watch`.
  - All tests should be placed in the `__test__` directory and follow the corresponding structure in `src/` (e.g., `__test__/components/...`).

## Conventions

- Use Conventional Commits (`/commit` workflow).
- Link, don't embed: For deep or detailed standards, link to an external `.md` doc.
