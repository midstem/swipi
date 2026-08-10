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

Right now the package holds a single `stump()` function that exists only to
prove the wiring end to end: workspace resolution, typecheck, bundling and the
published tarball. The real engine described in
[AGNOSTIC.md](../../AGNOSTIC.md) moves in here later.
