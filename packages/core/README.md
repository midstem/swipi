# @swipi/core

The framework-agnostic carousel engine.

This package is **not published to npm**. Adapters depend on it through the
workspace, import it as TypeScript source and bundle it into their own `dist`,
so a consumer of `swipi` never has to install anything extra.

Two rules follow from that, and both are enforced by
`packages/react/scripts/verify-package.mjs`:

- `@swipi/core` belongs in an adapter's `devDependencies`, never in
  `dependencies` — a published `dependencies` entry would point at a package
  that does not exist on the registry;
- the built bundle must not contain an import of `@swipi/core`; if it does, the
  bundler treated the core as external and the tarball is broken.

Right now the package holds the React-free half of the engine — `constants`,
`types`, `geometry` and `helpers` — and every one of its modules is free of
React imports. The stateful part still lives in the hooks of `packages/react`
and moves in here later.
