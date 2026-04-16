# Nextjs Boilerplate

A production-ready Next.js 16 starter with React 19, HeroUI, Tailwind CSS v4, TypeScript, and a preconfigured testing and linting setup.

![Next.js](https://img.shields.io/badge/Next.js-16.2.3-000000?logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2.5-149ECA?logo=react&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- HeroUI
- Tailwind CSS v4
- Bun
- Jest + Testing Library
- ESLint + Prettier

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)

### Install and run locally

```bash
bun install
bun run dev
```

The app starts locally at `http://localhost:3000`.

### Production build

```bash
bun run build
bun run start
```

## Available Scripts

| Script               | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `bun run dev`        | Start the Next.js development server.                |
| `bun run build`      | Create the production build.                         |
| `bun run start`      | Start the production server from the build output.   |
| `bun run lint`       | Run ESLint across the project.                       |
| `bun run lint:fix`   | Run ESLint and apply automatic fixes where possible. |
| `bun run format`     | Format the codebase with Prettier.                   |
| `bun run test`       | Run the Jest test suite once.                        |
| `bun run test:watch` | Run the Jest test suite in watch mode.               |
| `bun run outdated`   | Check dependency updates with npm-check-updates.     |

## Documentation

For architecture notes, internal patterns, and implementation details, see [docs/TECH_DOCS.md](./docs/TECH_DOCS.md).

## Contributing and License

Contributions are welcome. Follow Conventional Commits for commit messages.

This project is licensed under the [MIT License](./LICENSE).
