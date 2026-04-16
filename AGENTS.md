# Project Guidelines

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Code Style

- Next.js 16 App Router using `src/app` directory structure.
- React 19 with React Compiler enabled (`reactCompiler: true` in `next.config.ts`), so manual `useMemo`/`useCallback` is usually unnecessary unless profiling proves a need.
- HeroUI (`@heroui/react`) with Tailwind CSS v4. Shared design tokens live in `src/styles/globals.css`.
- TypeScript strict mode with `~/` path alias to `src` (see `tsconfig.json`). Prefer `~/...` imports for app code.
- Add comprehensive TSDoc comments for exported hooks/components/utilities and keep syntax valid (`tsdoc/syntax` is enforced as a warning).
- Run `bun run format` and `bun run lint:fix` after edits to align with project style and lint rules.

## Architecture

- Server Components by default. Add `use client` only where browser APIs or interactivity are required.
- Push client boundaries as deep as possible (for example: route shell in `src/app/page.tsx`, interactivity in `src/app/_components/...`).
- Mount app-wide providers via `src/components/providers/base.tsx`; keep root layout focused on document shell concerns.
- Keep cross-cutting config in `src/config` (for example `fonts.ts`, `site.ts`) instead of duplicating setup in route files.
- For full architectural patterns and recipes, link to `docs/TECH_DOCS.md` instead of re-embedding large guidance.

## Build and Test

- Package manager: Bun
- Install dependencies: `bun install`
- Start dev server: `bun dev`
- Build and run production: `bun run build` then `bun run start`
- Lint: `bun run lint`
- Auto-fix lint issues: `bun run lint:fix`
- Format: `bun run format`
- Test: `bun run test` or `bun run test:watch` (Jest + Testing Library, jsdom environment)
- Keep tests in `__test__` mirroring `src` structure (example: `src/components/hooks/useCopyToClipboard.ts` and `__test__/components/hooks/useCopyToClipboard.test.tsx`).

## Conventions

- Use Conventional Commits (`/commit` workflow).
- Respect typed routes (`typedRoutes: true`): links and route paths should map to actual files in `src/app`.
- Prefer server-first composition: fetch/compose data in server routes/components and pass plain props into client islands.
- Link, do not embed: point to `docs/TECH_DOCS.md` and `README.md` for deep details instead of duplicating long documentation here.
