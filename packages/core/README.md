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

The package now holds the whole engine, and every one of its modules is free of
React imports. An adapter owns nothing but the binding to its framework.

`createSwipi(viewport, options)` is the entry point. It takes the viewport
element, treats its first child as the track and returns a `SwipiApi`: the three
`scroll*` commands, a `getSnapshot`/`subscribe` pair shaped for
`useSyncExternalStore` and its equivalents, and `update`, `measure`, `sync`,
`destroy` for the host's lifecycle. Everything the engine remembers — options,
geometry, transform, the applied slide offsets — lives in that closure, so a
host never has to mirror it.

Each subject owns a folder, and everything only that subject needs — its
`constants.ts`, `types.ts`, `helpers.ts` and its test — stays inside it.
`src/constants` and `src/types` hold what more than one subject shares, and
`src/index.ts` re-exports the folders as the single entry adapters import from.
Nothing inside `src` imports that barrel back; a module reaches for the exact
folder it needs, so there is no cycle through the entry point.

Crossing from one subject to another goes through the single subpath import
declared in `package.json`, `"#src/*": "./src/*/index.ts"`, so a file five
folders deep writes `#src/constants` and says where it is going instead of
counting `../` to get there. The `#` is not decoration — it is what marks the
specifier as internal to this package, and Node would otherwise go looking for
`src` in `node_modules`. Inside a subject the imports stay relative.

Node, TypeScript and Vite all read that one line from the manifest, so no
bundler config or tsconfig in the repo repeats it, and it never reaches npm: the
adapter's build inlines the core into its own bundle and rolls its declarations
up before packing.

`src/createSwipi` wires the engine together:

- `store` — the snapshot the host subscribes to, and the `onChange`/`onSelect`
  callbacks fired next to it;
- `geometrySync` — the single mutable state: re-derives snaps, overflow and the
  scroll flags from a fresh measurement. It reports rather than commands —
  `syncGeometry` returns the transform to move to, or `null` when there is
  nothing measured yet, and `syncSlideIndex` returns whether the index actually
  moved — so it needs no reference to the pieces that act on the answer;
- `scroll` — turns `scrollNext`/`scrollPrev`/`scrollTo` into a target.

That is what keeps `createSwipi` a straight line: every piece is built after the
pieces it names, so nothing is referenced before it exists. The one exception is
the autoplay tick, which reaches forward to `scroll`; it can only fire from a
timer, long after the constructor has returned, and `createSwipi.test.ts` holds
it in place by letting autoplay advance twice.

`src/modules/orchestration` is the half that touches the DOM and the browser:

- `track` — writes the CSS variables, the track transform and the per-slide loop
  offsets;
- `transform` — owns the current transform and the `requestAnimationFrame` run
  between two of them;
- `events` — pointer down/move/up, the axis lock and the momentum on release;
- `observers` — `ResizeObserver` and `MutationObserver`, deduplicated so a
  measurement only reaches the engine when it actually changed;
- `autoplay`, `prefersReducedMotion` — the timer and the media query.

The rest is pure and testable on its own:

- `geometry/slides` — measures the track's children and shifts a slide by whole
  laps;
- `geometry/snaps` — turns positions into snap points and finds the one the
  track rests on;
- `geometry/targets` — where a step, a `scrollTo` or a flick should land;
- `drag` — pointer velocity and how long the momentum runs;
- `neighbours` — the previous, current and next slide index;
- `autoplay`, `animation`, `math` — the timer, the easing and the arithmetic
  the rest builds on.
