# @tools/e2e

Cross-browser Playwright checks that drive the React playground in Chromium,
Firefox and WebKit. They exist to catch engine-specific drag regressions that
the jsdom unit tests cannot see.

## Running

```bash
npm run test:e2e
```

The first run needs the browser binaries:

```bash
npm run install:browsers --workspace @tools/e2e
```

A single engine:

```bash
npm run test:e2e:firefox
```

Watch the drags happen:

```bash
npm exec --workspace @tools/e2e -- playwright test --headed --project=firefox
```

Playwright starts the playground itself (`vite` on port 3000) and reuses an
already running one. `linkCard.spec.ts` serves its own fixture instead and
loads the built core, so it needs a build first:

```bash
npm run build --workspace @midstem/swipi
```

## The suites

| Spec                  | What it covers                                                                        |
| --------------------- | ------------------------------------------------------------------------------------- |
| `drag.spec.ts`        | Pointer tracking, snap forward, snap back, repeated drags                             |
| `flick.spec.ts`       | Velocity-driven flicks, release outside the viewport, slide content                   |
| `behaviour.spec.ts`   | Loop wrap, arrows, dots, animation interruption, vertical, autoplay, dragFree, resize |
| `linkCard.spec.ts`    | A carousel nested inside an `<a>` — the Firefox link-drag case                        |
| `diagnostics.spec.ts` | Prints the pointer events the viewport actually receives per engine                   |
| `smoothness.spec.ts`  | Prints frame timings for a drag and for the release animation                         |

`diagnostics` and `smoothness` are reporting suites — they log per-engine
numbers rather than asserting thresholds, so a regression shows up as a number
that moved rather than as a red test.
