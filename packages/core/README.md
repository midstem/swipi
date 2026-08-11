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

Right now the package holds the React-free half of the engine, and every one of
its modules is free of React imports. The stateful part still lives in the hooks
of `packages/react` and moves in here later.

Each subject owns a folder, and everything only that subject needs — its
`constants.ts`, `types.ts`, `helpers.ts` and its test — stays inside it.
`src/constants` and `src/types` hold what more than one subject shares, and
`src/index.ts` re-exports the folders as the single entry adapters import from:

- `geometry/slides` — measures the track's children and shifts a slide by whole
  laps;
- `geometry/snaps` — turns positions into snap points and finds the one the
  track rests on;
- `geometry/targets` — where a step, a `scrollTo` or a flick should land;
- `drag` — pointer velocity and how long the momentum runs;
- `neighbours` — the previous, current and next slide index;
- `autoplay`, `animation`, `math` — the timer, the easing and the arithmetic
  the rest builds on.
