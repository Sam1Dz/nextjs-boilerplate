---
name: tsdoc
description: Generate comprehensive TSDoc comments for TypeScript/React files
invocation: /tsdoc in files <file1.tsx> <file2.ts> ...
tools:
  - read: "*"
  - edit: "*"
  - write: "*"
  - bash: npx eslint *
triggers:
  - user_invokes: "/tsdoc"
---

# TSDoc Generator

Generate TSDoc for files specified by the user: `$ARGUMENTS`

---

## Argument Parsing

Extract file paths from `$ARGUMENTS`. The expected pattern is:

```
in files <path1> <path2> <path3> ...
```

- Parse everything after `in files` as a space-separated list of file paths.
- If no valid file paths are found, ask the user: *"No files specified. Which files should I generate TSDoc for?"*
- If any specified file does not exist, report it and ask: *"File not found: `<path>`. Continue with the remaining files?"*

---

## Workflow Steps

Execute these steps for **each file** in the parsed list. Do not skip to the next file until the current file is complete.

### Step 1 — Read and Analyze

1. Read the full file content.
2. Identify **all exports** in the file:
   - React components (function declarations/expressions exported)
   - Custom hooks (functions starting with `use` and exported)
   - Utility functions, helpers, formatters (exported functions)
   - Classes (exported classes)
   - Types and interfaces (exported `type` or `interface` declarations)
   - API route handlers (exported `GET`, `POST`, etc. in route files)
3. For each identified export, determine:
   - Whether it already has a TSDoc comment (a `/** ... */` block immediately preceding it)
   - Whether the existing TSDoc is valid and complete (has summary, correct tags, proper syntax)

### Step 2 — Filter by Scope

Apply the project's documentation scope rules:

| Category | Action |
|---|---|
| Exported React components | **Always document** |
| Custom hooks | **Always document** |
| Utility functions, helpers, formatters | **Always document** |
| Shared types/interfaces reused across features | **Always document** |
| API route handlers | **Always document** |
| Complex page/layout components | Document (encouraged) |
| Shared constants/config with non-obvious usage | Document (encouraged) |
| Business-critical actions/thunks | Document (encouraged) |
| Simple one-off implementations local to a single file | **Skip** |
| Short, self-explanatory helpers where naming makes purpose obvious | **Skip** |

### Step 3 — Generate or Update TSDoc

For each export that passes the scope filter:

**If no TSDoc exists:** Generate a complete TSDoc comment following the structure below.

**If TSDoc exists but is incomplete or inconsistent:** Update only the missing/inconsistent parts. Do not rewrite sections that are already correct.

**If TSDoc exists and is valid/complete:** Leave it untouched.

#### Comment Structure

````ts
/**
 * Short summary sentence (no period at the end).
 *
 * Longer description with important notes or intent.
 *
 * @remarks
 * Optional section for design rationale, edge cases, and gotchas.
 *
 * @example
 * ```tsx
 * <MyComponent variant="outlined" disabled />
 * ```
 *
 * @param props - The component props.
 * @returns The rendered element.
 */
````

#### Syntax Rules

| Rule | Correct | Incorrect |
|---|---|---|
| Summary line | No trailing period | `Adds a feature.` |
| Block tag placement | Start of line | Indented |
| Param format | `@param foo - description` | `@param foo description` |
| Extra notes | `@remarks` | `@note`, `@description` |
| Void returns | Omit `@returns` | `@returns void` |
| Cross-references | `{@link Symbol}` | Plain text references |

#### Allowed TSDoc Tags

| Tag | When to Use |
|---|---|
| `@param` | All function/method parameters (dash format) |
| `@returns` | Return value (omit if void and obvious) |
| `@remarks` | Design notes, edge cases, gotchas |
| `@example` | Usage examples (strongly encouraged for components and hooks) |
| `@deprecated` | Items planned for removal |
| `@internal` | Intentionally non-public surface |
| `@beta` / `@alpha` | Release stage |
| `{@link Symbol}` | Inline cross-references to other API items |

#### React/Next Specifics

Prefer TSDoc on the function/component itself rather than duplicating prop docs:

````tsx
/**
 * Primary call-to-action button used across the marketing site.
 *
 * @remarks
 * Renders as `<button>` and supports async onClick handlers.
 *
 * @example
 * ```tsx
 * <CtaButton onClick={handleBuy}>Buy now</CtaButton>
 * ```
 */
export function CtaButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // ...
}
````

When exporting a reusable prop type, document the type itself with inline member comments:

```tsx
/**
 * Props for {@link CtaButton}.
 */
export interface CtaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional loading state; disables the button and shows a spinner. */
  loading?: boolean;
  /** Button style variant. Defaults to "primary". */
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

### Step 4 — Apply Edits

1. Edit the file to insert or update TSDoc comments.
2. **Do not modify any code** — only add or update comment blocks.
3. Preserve all existing whitespace, indentation, and code structure.

### Step 5 — Validate

After editing the file, run:

```bash
npx eslint --rule 'tsdoc/syntax: warn' <filepath>
```

- If no TSDoc syntax errors: proceed to the next file.
- If TSDoc syntax errors are found:
  1. Show the errors to the user.
  2. Fix the reported issues automatically.
  3. Re-run validation to confirm the fix.

---

## Post-Processing Summary

After all files have been processed, present a summary table:

```
| File | Exports Found | Documented | Skipped | Updated | Status |
|------|---------------|------------|---------|---------|--------|
| src/components/Button.tsx | 3 | 2 | 1 | 1 | ✅ |
| src/utils/helpers.ts | 5 | 4 | 1 | 2 | ✅ |
```

---

## Project Context

This is a **Next.js 16.2.1** project with **React 19.2.4** and **React Compiler** enabled:

| Technology | Documentation Implication |
|---|---|
| React Compiler | Note automatic optimizations in `@remarks` — do not document manual `useMemo`/`useCallback` as necessary unless truly exceptional |
| TypeScript Strict | Leverage strict types in `@example` blocks — examples should pass strict checking |
| Tailwind CSS 4.x | Reference styling approach in `@remarks` when relevant to component behavior |
| App Router (`src/app/`) | Distinguish Server Components from Client Components in `@remarks` when relevant |
| Path Aliases (`~/*` → `./src/*`) | Use `~/*` aliases in `@example` blocks to match project conventions |
| ESLint (`tsdoc/syntax` warn) | All generated TSDoc must pass this rule |

---

## Examples

### Hook Documentation

````tsx
/**
 * Custom hook for managing theme state with Next.js themes.
 *
 * @remarks
 * Combines Next-themes with React context for consistent theming
 * across Server and Client Components. Automatically handles system
 * preference detection.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *   return <button onClick={() => setTheme('dark')}>Dark mode</button>;
 * }
 * ```
 *
 * @returns Object containing current theme and setter function.
 */
export function useTheme(): ThemeContextValue {
  // ...
}
````

### Utility Function Documentation

````ts
/**
 * Formats a date using project-specific locale settings.
 *
 * @remarks
 * Uses Intl.DateTimeFormat with consistent options across the app.
 * Defaults to user's locale if available, otherwise en-US.
 *
 * @example
 * ```ts
 * formatDate(new Date()) // "March 30, 2026"
 * formatDate(new Date(), 'short') // "3/30/26"
 * ```
 *
 * @param date - The date to format.
 * @param format - Format style: "full", "long", "medium", or "short". Defaults to "long".
 * @returns Formatted date string.
 */
export function formatDate(date: Date, format: DateFormat = 'long'): string {
  // ...
}
````

---

## Invocation Examples

```
/tsdoc in files src/components/Button.tsx
/tsdoc in files src/utils/helpers.ts src/lib/api.ts
/tsdoc in files src/hooks/useTheme.ts src/components/Header.tsx
```

---

## Constraints

| Constraint | Detail |
|---|---|
| Non-destructive | Existing valid TSDoc is preserved — only gaps and inconsistencies are addressed |
| Code untouched | Only comment blocks are modified; no code logic, imports, or structure changes |
| ESLint compliant | All output must pass `tsdoc/syntax` rule |
| Project idiomatic | Examples use project aliases (`~/*`), patterns, and conventions |
| Cross-referenced | Use `{@link}` to connect related APIs (e.g., prop types to their components) |
| Complete tags | Every documented function includes all applicable `@param` and `@returns` tags |