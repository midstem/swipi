# Contributing to Swipi

Thank you for your interest in contributing to Swipi! This guide will help you
get started.

## Code of Conduct

By participating in this project you agree to abide by the
[Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24 or later
- npm (comes with Node.js)

### Setup

1. Fork the repository on GitHub.
2. Clone your fork locally:

   ```bash
   git clone https://github.com/<your-username>/swipi.git
   cd swipi
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start a playground to verify everything works:

   ```bash
   npm start              # React playground
   npm run start:vue      # Vue playground
   npm run start:svelte   # Svelte playground
   npm run start:angular  # Angular playground
   npm run start:vanilla  # Vanilla JS playground
   ```

## Repository Structure

Swipi is a monorepo managed with npm workspaces:

```
packages/
  core/           # @midstem/swipi — the framework-agnostic engine
  react/          # @midstem/swipi-react
  vue/            # @midstem/swipi-vue
  svelte/         # @midstem/swipi-svelte
  angular/        # @midstem/swipi-angular
  playground-core/ # Shared playground utilities
apps/
  playground-*/   # Framework-specific playgrounds
tools/
  e2e/            # Playwright end-to-end tests
  scripts/        # Build and release scripts
  release/        # Release CLI
```

The engine (`packages/core`) is the foundation. Each adapter imports the engine
at build time — they are independent packages with independent version numbers.

## Development Workflow

### Running Checks

Before submitting a pull request, make sure all checks pass:

```bash
# Lint (ESLint + Prettier)
npm run lint

# Type check
npm run typecheck

# Unit tests
npm run test:run

# Build everything
npm run build
```

There is a `pre-commit` hook that runs `lint-tsc` (format, lint, and typecheck)
automatically.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# End-to-end tests (Playwright)
npm run test:e2e
```

### Code Style

The project uses **Prettier** for formatting and **ESLint** for linting. Both
are configured at the repository root:

- [`.prettierrc`](.prettierrc) — single quotes, no semicolons, 80 columns
- [`eslint.config.js`](eslint.config.js) — TypeScript, React, Vue, Svelte rules

The `pre-commit` hook runs both automatically, so your code will be formatted on
commit. You can also run them manually:

```bash
npm run lint:fix      # Fix ESLint issues
npm run lint:format   # Format with Prettier
```

## Submitting Changes

### Reporting Bugs

Use the [Bug Report](https://github.com/midstem/swipi/issues/new?template=bug_report.yml)
issue template. Please include:

- Which package is affected
- A minimal reproduction (a playground link or CodeSandbox is ideal)
- Expected vs actual behavior
- Browser and OS information

### Requesting Features

Use the [Feature Request](https://github.com/midstem/swipi/issues/new?template=feature_request.yml)
issue template.

### Pull Requests

1. Create a branch from `main`:

   ```bash
   git checkout -b fix/carousel-snap-on-resize
   ```

   Use a descriptive branch name — `fix/`, `feat/`, `docs/`, `refactor/` prefixes help.

2. Make your changes, keeping commits focused and descriptive.

3. Make sure all checks pass:

   ```bash
   npm run lint && npm run typecheck && npm run test:run && npm run build
   ```

4. Push your branch and open a pull request against `main`.

5. Fill in the PR template — link the related issue, describe what changed and
   why, and check off the checklist items.

### What the CI Checks

When you open a PR, CI will:

- Run **ESLint** across the repository
- Run **typecheck** and **tests** for the affected packages
- **Build** the affected packages and verify the published output
- Check **bundle size** changes
- Run **compatibility** tests against older framework versions

All checks must be green before a PR can be merged.

## Architecture Notes

- The engine's public API is `packages/core/src/index.ts`. Everything else under
  `packages/core/src` is internal.
- Adapters inline the engine at build time rather than declaring it as a
  dependency.
- Inside the repo, Vite's `resolve.alias` maps `@midstem/swipi` to the engine's
  source so you never need to build the engine before working on an adapter.
- See [PUBLISH.md](PUBLISH.md) for the full release process and versioning
  policy.

## Need Help?

- Check the [documentation](https://swipi.midstem.net/docs/)
- Open a [discussion](https://github.com/midstem/swipi/issues) on GitHub
- Look at the [playgrounds](https://midstem.github.io/swipi/) for working
  examples
