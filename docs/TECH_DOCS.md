# Technical Documentation

## 1. Overview & Architecture

This project is a small Next.js 16 App Router starter organized around a server-first UI shell, a thin client-side provider boundary, and a handful of internal helpers. The current application surface is a single public route at `/`, backed by a root layout, route-local UI in `src/app/_components`, shared providers in `src/components/providers`, shared hooks in `src/components/hooks`, configuration modules in `src/config`, and global theme tokens in `src/styles`.

### High-level structure

| Path                                                                                                                | Purpose                                                                                   |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`src/app/layout.tsx`](../src/app/layout.tsx)                                                                       | Root HTML shell, global CSS import, font class injection, and app-level provider mounting |
| [`src/app/page.tsx`](../src/app/page.tsx)                                                                           | The current home page server component                                                    |
| [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx)                             | Route-private interactive UI for script cards and copy actions                            |
| [`src/components/providers/base.tsx`](../src/components/providers/base.tsx)                                         | Provider composition entrypoint for app-wide client providers                             |
| [`src/components/providers/theme.tsx`](../src/components/providers/theme.tsx)                                       | `next-themes` wrapper used by the provider stack                                          |
| [`src/components/hooks/useCopyToClipboard.ts`](../src/components/hooks/useCopyToClipboard.ts)                       | Reusable client hook for clipboard interactions                                           |
| [`src/config/fonts.ts`](../src/config/fonts.ts)                                                                     | Centralized `next/font` setup for Geist Sans and Geist Mono                               |
| [`src/config/site.ts`](../src/config/site.ts)                                                                       | Shared Next.js metadata export                                                            |
| [`src/styles/globals.css`](../src/styles/globals.css)                                                               | Tailwind v4 import, HeroUI styles import, and project theme tokens                        |
| [`__test__/components/hooks/useCopyToClipboard.test.tsx`](../__test__/components/hooks/useCopyToClipboard.test.tsx) | Example test that mirrors source structure                                                |

### Request-to-render flow

1. The request enters the App Router through [`src/app/layout.tsx`](../src/app/layout.tsx), which defines `<html>`, `<body>`, global classes, and the root provider boundary.
2. Layout-level metadata is re-exported from [`src/config/site.ts`](../src/config/site.ts) instead of being declared inline.
3. The route content is rendered by [`src/app/page.tsx`](../src/app/page.tsx), which stays on the server and assembles the landing page sections.
4. Interactivity is pushed down into [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx), which uses a client-only clipboard hook.

## 2. Active Architecture Patterns

### Server components by default, client islands for interaction

The route shell follows the App Router default: [`src/app/layout.tsx`](../src/app/layout.tsx) and [`src/app/page.tsx`](../src/app/page.tsx) are Server Components, while interactive behavior is isolated behind `"use client"` boundaries.

Current client boundaries:

- [`src/components/providers/base.tsx`](../src/components/providers/base.tsx) for app-wide providers
- [`src/components/providers/theme.tsx`](../src/components/providers/theme.tsx) for theme context
- [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx) for button presses, tooltip state, and clipboard UX
- [`src/components/hooks/useCopyToClipboard.ts`](../src/components/hooks/useCopyToClipboard.ts) for browser clipboard access

Minimal example from the current pattern:

```tsx
// src/app/page.tsx
import { ScriptsSection } from '~/app/_components/scripts-section';

export default function Page() {
  return <ScriptsSection scripts={scripts} />;
}
```

### Provider composition at the root

App-wide client providers are composed in one place instead of being stacked directly in the layout. [`src/components/providers/base.tsx`](../src/components/providers/base.tsx) exposes `BaseProvider`, which is mounted once in the root layout and currently wraps a configured `ThemeProvider`.

This keeps the server layout small while making it easy to add new providers later.

```tsx
// src/components/providers/base.tsx
export const BaseProvider = composeProviders(AppThemeProvider);
```

### Theme and styling pipeline

Styling is split across three layers:

1. [`src/styles/globals.css`](../src/styles/globals.css) imports Tailwind CSS v4 and `@heroui/styles`.
2. The same file defines project theme tokens in `:root` and `.dark`, including semantic colors, radius values, and font variables.
3. [`src/app/layout.tsx`](../src/app/layout.tsx) applies the font variables from [`src/config/fonts.ts`](../src/config/fonts.ts), while [`src/components/providers/base.tsx`](../src/components/providers/base.tsx) enables class-based theme switching through `next-themes`.

The result is a CSS-first theme system where HeroUI components and Tailwind utility classes share the same token source.

### Configuration extracted into dedicated modules

Cross-cutting configuration is pulled out of route files:

- Fonts live in [`src/config/fonts.ts`](../src/config/fonts.ts)
- Metadata lives in [`src/config/site.ts`](../src/config/site.ts)
- Next.js features are enabled in [`next.config.ts`](../next.config.ts), including `reactCompiler` and `typedRoutes`

This keeps route modules focused on rendering.

## 3. Developer Recipes

### How to add a route

Create a new folder under `src/app` and add a `page.tsx` file. Keep it as a Server Component unless the route itself needs browser-only behavior.

Use the existing root route as the reference point:

- Route example: [`src/app/page.tsx`](../src/app/page.tsx)
- Shared shell: [`src/app/layout.tsx`](../src/app/layout.tsx)

Minimal shape:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <main>About</main>;
}
```

If the route needs interactive UI, place that UI in a client component under a private folder such as `src/app/about/_components`.

### How to add a provider

Define the provider as a client component, then add it to the composition in [`src/components/providers/base.tsx`](../src/components/providers/base.tsx). This preserves the current “single root provider entrypoint” pattern.

Minimal shape:

```tsx
const AppProvider = composeProviders(NewProvider, AppThemeProvider);
```

Follow the existing provider split:

- Low-level wrapper: [`src/components/providers/theme.tsx`](../src/components/providers/theme.tsx)
- Root composition: [`src/components/providers/base.tsx`](../src/components/providers/base.tsx)

### How to add interactive UI

Keep the page or layout on the server and move the interactive part into a dedicated client component. The current example is [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx), which receives server-defined data and handles copy actions on the client.

For reusable browser behavior, extract a hook in `src/components/hooks` and test it under `__test__` using the same folder shape as the source file.

Reference pair:

- Hook: [`src/components/hooks/useCopyToClipboard.ts`](../src/components/hooks/useCopyToClipboard.ts)
- Test: [`__test__/components/hooks/useCopyToClipboard.test.tsx`](../__test__/components/hooks/useCopyToClipboard.test.tsx)

## 4. Component Libraries Reference

### Providers and wrappers

| Module          | Role                                                     | Source                                                                        |
| --------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `BaseProvider`  | App-level provider entrypoint mounted by the root layout | [`src/components/providers/base.tsx`](../src/components/providers/base.tsx)   |
| `ThemeProvider` | Thin wrapper around `next-themes` `ThemeProvider`        | [`src/components/providers/theme.tsx`](../src/components/providers/theme.tsx) |

### Hooks

| Module               | Role                                                                                                                                  | Source                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `useCopyToClipboard` | Returns the last copied value plus an async copy function with timeout reset support and a fallback to `document.execCommand('copy')` | [`src/components/hooks/useCopyToClipboard.ts`](../src/components/hooks/useCopyToClipboard.ts) |

### Internal UI helpers

| Module             | Role                                                                                                            | Source                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ScriptsSection`   | Route-local client component that renders script cards, tooltips, and copy buttons from a typed `scripts` array | [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx) |
| `ScriptDefinition` | Shared type for each rendered script item in `ScriptsSection`                                                   | [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx) |

## 5. Best Practices

- Keep `src/app` server-first. Add `"use client"` only to the smallest interactive boundary, following the split between [`src/app/page.tsx`](../src/app/page.tsx) and [`src/app/_components/scripts-section.tsx`](../src/app/_components/scripts-section.tsx).
- Mount app-wide providers once in [`src/components/providers/base.tsx`](../src/components/providers/base.tsx) and keep the root layout focused on document structure.
- Centralize metadata and font setup in [`src/config/site.ts`](../src/config/site.ts) and [`src/config/fonts.ts`](../src/config/fonts.ts) rather than duplicating them inside route files.
- Use the `~/` path alias defined in [`tsconfig.json`](../tsconfig.json) for application imports.
- Keep design tokens in [`src/styles/globals.css`](../src/styles/globals.css) so Tailwind utilities and HeroUI components share the same theme vocabulary.
- Mirror source structure in tests, as shown by [`src/components/hooks/useCopyToClipboard.ts`](../src/components/hooks/useCopyToClipboard.ts) and [`__test__/components/hooks/useCopyToClipboard.test.tsx`](../__test__/components/hooks/useCopyToClipboard.test.tsx).
- Respect the active project config in [`next.config.ts`](../next.config.ts): route changes should remain compatible with `typedRoutes`, and React code should assume the React Compiler is enabled.
