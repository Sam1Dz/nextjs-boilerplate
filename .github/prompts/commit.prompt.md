---
name: 'commit'
description: 'Review the current diff, run checks, and create an emoji conventional commit'
argument-hint: '[--no-verify] [--amend] [optional commit guidance]'
agent: 'agent'
---

# Smart Git Commit

Create well-formatted commit based on the user's input: `$ARGUMENTS`

---

## Context Gathering

Before taking any action, gather the current repository state by running these commands in sequence and storing their output:

| Variable | Command |
|---|---|
| `git_status` | `git status --porcelain` |
| `current_branch` | `git branch --show-current` |
| `staged_changes` | `git diff --cached --stat` |
| `unstaged_changes` | `git diff --stat` |
| `recent_commits` | `git log --oneline -5` |

Present this information to the user in a summary block before proceeding.

---

## Workflow Steps

Execute these steps in order. Do not skip ahead unless the user explicitly requests it.

### Step 1 — Pre-commit Verification (unless `--no-verify` is passed)

If `$ARGUMENTS` does **not** contain `--no-verify`:

1. Run `bun run lint` and capture the result.
2. Run `bun run test` and capture the result.
3. Run `bun run build` and capture the result.
4. If any of the three commands (`lint`, `test`, `build`) fails:
   - Show the user the error output.
   - Ask: *"Pre-commit checks failed. Would you like to fix the issues first, or proceed with the commit anyway?"*
   - Wait for user decision before continuing.
5. If all three commands (`lint`, `test`, `build`) pass, proceed to Step 2.

If `--no-verify` **is** present, skip to Step 2.

### Step 2 — Determine Staging State

1. Check `git_status` for staged files (lines starting with `M`, `A`, `D`, `R`, `C` in the index column).
2. **If files are staged**: Proceed to Step 3 with those files only.
3. **If zero files are staged**: Run `git add` to stage all modified and new files, then proceed to Step 3.

### Step 3 — Analyze the Diff

1. Run `git diff --cached` (or `git diff` if freshly staged) to get the full diff.
2. Analyze the diff to determine if **multiple distinct logical changes** are present.

Use these splitting criteria:

| Criterion | Example |
|---|---|
| Different concerns | Auth logic + UI refactor in same diff |
| Different change types | Feature + bug fix mixed together |
| Different file patterns | Source code + documentation changes |
| Logical grouping | Changes easier to understand separately |
| Size | Very large diffs exceeding ~400 lines |

### Step 4 — Propose Commit Plan

**If multiple distinct changes detected:**

- Present a proposed split to the user, e.g.:
  ```
  I detected multiple distinct changes. Suggested split:

  1. ✨ feat: add new solc version type definitions
     Files: src/types/solc.ts
  2. 📝 docs: update documentation for new solc versions
     Files: docs/solc-versions.md
  3. 🔧 chore: update package.json dependencies
     Files: package.json, package-lock.json

  Proceed with this split?
  ```
- Wait for user confirmation or modification.
- Execute each commit sequentially, repeating Steps 3–5 per group.

**If a single logical change:** Proceed to Step 5.

### Step 5 — Generate Commit Message

Construct the commit message using the **Emoji Conventional Commit** format defined in the Guidelines section below.

Rules for message generation:

1. **First line**: `<emoji> <type>: <description>` — under 72 characters.
2. **Description**: Present tense, imperative mood ("add feature", not "added feature").
3. **Body** (optional): Blank line after first line, then detailed explanation if the change is non-trivial.
4. **Footer** (optional): Breaking changes (`BREAKING CHANGE:`), issue references, etc.
5. The message **must accurately reflect** the actual diff content. Never fabricate changes.

### Step 6 — Execute Commit

1. Run `git commit -m "<generated message>"`.
   - If `--amend` is in `$ARGUMENTS`, use `git commit --amend -m "<generated message>"`.
2. Show the user the resulting commit with `git log --oneline -1`.
3. Confirm success.

---

## Project Context

This is a **Next.js 16.2.1** project with **React 19.2.4** and **React Compiler** enabled. Apply these constraints when reviewing diffs and generating messages:

| Technology | Key Constraint |
|---|---|
| Next.js 16.x | Breaking changes from earlier versions — APIs may differ from training data |
| React Compiler | Automatically optimizes — avoid manual `useMemo`/`useCallback` unless necessary |
| TypeScript Strict | All code must pass strict type checking; type errors fail the build |
| Tailwind CSS 4.x | Uses `@import "tailwindcss"` PostCSS plugin — not v3 config files |
| App Router | Uses `src/app/` directory pattern |

When the diff modifies:

- **Component logic**: Flag if manual memoization was added unnecessarily (React Compiler handles this).
- **Styling**: Verify Tailwind CSS v4 syntax is used (not v3 `@tailwind` directives or `tailwind.config.js` patterns).
- **APIs**: Flag if Next.js 16.x-incompatible APIs are used.
- **Types**: Verify TypeScript strict mode compliance is maintained.

---

## Commit Message Guidelines

### Format

```
<emoji> <type>: <description>

<body>

<optional footer>
```

### Types

| Type | Purpose |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code changes that neither fix bugs nor add features |
| `perf` | Performance improvements |
| `test` | Adding or fixing tests |
| `chore` | Changes to the build process, tools, etc. |
| `ci` | CI/CD improvements |
| `revert` | Reverting changes |
| `wip` | Work in progress |
| `experiment` | Perform experiments |
| `assets` | Add or update assets |
| `db` | Perform database related changes |
| `ui` | Add or update animations and transitions |

### Emoji Mapping

| Emoji | Type | Specific Meaning |
|---|---|---|
| ✨ | `feat` | New feature |
| 💥 | `feat` | Introducing breaking changes |
| 🏷️ | `feat` | Add or update types |
| 👔 | `feat` | Add or update business logic |
| 📱 | `feat` | Work on responsive design |
| 🚸 | `feat` | Improve user experience / usability |
| ♿️ | `feat` | Improve accessibility |
| 🔍️ | `feat` | Improve SEO |
| 💬 | `feat` | Add or update text and literals |
| 🌐 | `feat` | Internationalization and localization |
| 🧵 | `feat` | Add or update code related to multithreading or concurrency |
| 🦺 | `feat` | Add or update code related to validation |
| ✈️ | `feat` | Improve offline support |
| 📈 | `feat` | Add or update analytics or tracking code |
| 🚩 | `feat` | Add, update, or remove feature flags |
| 🥚 | `feat` | Add or update an easter egg |
| 🔊 | `feat` | Add or update logs |
| 🐛 | `fix` | Bug fix |
| 🚨 | `fix` | Fix compiler/linter warnings |
| 🔒️ | `fix` | Fix security issues |
| 🩹 | `fix` | Simple fix for a non-critical issue |
| 🥅 | `fix` | Catch errors |
| 👽️ | `fix` | Update code due to external API changes |
| 🔥 | `fix` | Remove code or files |
| 🚑️ | `fix` | Critical hotfix |
| ✏️ | `fix` | Fix typos |
| 💚 | `fix` | Fix CI build |
| 🔇 | `fix` | Remove logs |
| 📝 | `docs` | Documentation |
| 💡 | `docs` | Add or update comments in source code |
| 💄 | `style` | Formatting/style |
| 🎨 | `style` | Improve structure/format of the code |
| ♻️ | `refactor` | Code refactoring |
| 🚚 | `refactor` | Move or rename resources |
| 🏗️ | `refactor` | Make architectural changes |
| ⚰️ | `refactor` | Remove dead code |
| ⚡️ | `perf` | Performance improvements |
| ✅ | `test` | Tests |
| 🧪 | `test` | Add a failing test |
| 🤡 | `test` | Mock things |
| 📸 | `test` | Add or update snapshots |
| 🔧 | `chore` | Tooling, configuration |
| 👥 | `chore` | Add or update contributors |
| 🔀 | `chore` | Merge branches |
| 📦️ | `chore` | Add or update compiled files or packages |
| ➕ | `chore` | Add a dependency |
| ➖ | `chore` | Remove a dependency |
| 🌱 | `chore` | Add or update seed files |
| 🧑‍💻 | `chore` | Improve developer experience |
| 🎉 | `chore` | Begin a project |
| 🔖 | `chore` | Release/Version tags |
| 📌 | `chore` | Pin dependencies to specific versions |
| 🙈 | `chore` | Add or update .gitignore file |
| 📄 | `chore` | Add or update license |
| 👷 | `ci` | Add or update CI build system |
| 🚀 | `ci` | CI/CD improvements |
| ⏪️ | `revert` | Revert changes |
| 🗑️ | `revert` | Reverting changes |
| 🚧 | `wip` | Work in progress |
| ⚗️ | `experiment` | Perform experiments |
| 🍱 | `assets` | Add or update assets |
| 🗃️ | `db` | Perform database related changes |
| 💫 | `ui` | Add or update animations and transitions |

---

## Examples

### Single Commits

```
✨ feat: add user authentication system
🐛 fix: resolve memory leak in rendering process
📝 docs: update API documentation with new endpoints
♻️ refactor: simplify error handling logic in parser
🚨 fix: resolve linter warnings in component files
🧑‍💻 chore: improve developer tooling setup process
👔 feat: implement business logic for transaction validation
🩹 fix: address minor styling inconsistency in header
🚑️ fix: patch critical security vulnerability in auth flow
🎨 style: reorganize component structure for better readability
🔥 fix: remove deprecated legacy code
🦺 feat: add input validation for user registration form
💚 fix: resolve failing CI pipeline tests
📈 feat: implement analytics tracking for user engagement
🔒️ fix: strengthen authentication password requirements
♿️ feat: improve form accessibility for screen readers
```

### Split Commit Sequence

```
✨ feat: add new solc version type definitions
📝 docs: update documentation for new solc versions
🔧 chore: update package.json dependencies
🏷️ feat: add type definitions for new API endpoints
🧵 feat: improve concurrency handling in worker threads
🚨 fix: resolve linting issues in new code
✅ test: add unit tests for new solc version features
🔒️ fix: update dependencies with security vulnerabilities
```

---

## Flags Reference

| Flag | Effect |
|---|---|
| `--no-verify` | Skip `bun run lint`, `bun run test` and `bun run build` pre-commit checks |
| `--amend` | Amend the previous commit instead of creating a new one |