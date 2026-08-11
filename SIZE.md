# Size against Embla

Swipi 3.0 set out to be a headless carousel that weighs less than the headless
carousel people already reach for. This is the measurement behind that claim.

Measured on 2026-08-11. Embla comes from npm; swipi is the build of this
repository, packed with `npm pack` and installed into the bench from the
tarball.

## Result

| Bundle                                                   |    Raw |  Gzip | × swipi |
| -------------------------------------------------------- | -----: | ----: | ------: |
| `swipi` (this tree, unreleased)                          | 15,534 | 5,069 |    1.00 |
| `embla-carousel-react` 8.6.0                             | 25,533 | 8,612 |    1.70 |
| `embla-carousel-react` + `embla-carousel-autoplay` 8.6.0 | 28,474 | 9,390 |    1.85 |

**Swipi is 1.85× lighter than the Embla setup that does the same things**, and
1.70× lighter than Embla's React core even before autoplay is added.

The second row exists because autoplay is not a fair thing to leave out: it is
an option in the swipi core (`autoplay`, `autoplaySpeed`), while in Embla it is
a separate plugin package. The last row compares carousels with the same feature
set; the middle row is there so nobody has to take that judgement on trust.

Swipi grew to get here. The same run measured the published 3.0.0 at 12,834 raw
and 4,371 gzip, so moving the engine out of the React hooks and into a
framework-agnostic core cost **698 bytes gzipped** — the store the host
subscribes to, the option diffing behind `update()`, and the seam that lets a
non-React adapter drive the same engine. The ratio against Embla fell from 2.15×
to 1.85×, and the claim in the README moved with it.

## How it was measured

One machine, one runtime, one build tract, both libraries bundled the same way —
Vite 8.2.1 in library mode, ESM output, default minifier, React marked external
so no React bytes land in either number. Gzip is `zlib` level 9.

```js
// bench.mjs
import { build } from 'vite'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'

const ENTRIES = [
  ['swipi', 'src/swipi.js'],
  ['swipi 3.0.0', 'src/swipi-300.js'],
  ['embla-carousel-react', 'src/embla-core.js'],
  ['embla-carousel-react + autoplay', 'src/embla-autoplay.js']
]

for (const [name, entry] of ENTRIES) {
  const outDir = `out/${name.replace(/\W/g, '')}`

  await build({
    logLevel: 'error',
    build: {
      outDir,
      minify: true,
      lib: {
        entry: resolve(entry),
        formats: ['es'],
        fileName: () => 'bundle.js'
      },
      rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] }
    }
  })

  const code = readFileSync(resolve(outDir, 'bundle.js'))

  console.log(name, code.length, gzipSync(code, { level: 9 }).length)
}
```

The four entry files are one line each:

```js
// src/swipi.js
export { useSwipiCarousel } from 'swipi'

// src/swipi-300.js
export { useSwipiCarousel } from 'swipi300'

// src/embla-core.js
export { default as useEmblaCarousel } from 'embla-carousel-react'

// src/embla-autoplay.js
export { default as useEmblaCarousel } from 'embla-carousel-react'
export { default as Autoplay } from 'embla-carousel-autoplay'
```

To reproduce, build and pack this repository first, then install the tarball
next to the published packages. The `swipi300` alias is what makes the released
3.0.0 measurable in the same run as the tree:

```bash
npm run build --workspace swipi
npm pack --workspace swipi --pack-destination <bench>
npm install vite@8 <bench>/swipi-<version>.tgz swipi300@npm:swipi@3.0.0 embla-carousel-react@8.6.0 embla-carousel-autoplay@8.6.0
node bench.mjs
```

Once the version measured here is on npm, the tarball step goes away and `swipi`
can come from the registry like everything else.

The bench is a check on itself: run against the released 3.0.0 it returns 12,834
raw and 4,371 gzip, within three bytes of the 12,831 and 4,368 this document
reported on 2026-08-04, and the two Embla numbers come back identical to the
byte. Absolute sizes drift with zlib and the minifier; the fact that they did
not drift here is what says the swipi row moved because the library changed.

## What ships with each

|                        | swipi        | embla-carousel-react 8.6.0                        |
| ---------------------- | ------------ | ------------------------------------------------- |
| Runtime dependencies   | none         | `embla-carousel`, `embla-carousel-reactive-utils` |
| Stylesheets in package | none         | none                                              |
| React                  | peer, `>=18` | peer, `^16.8 \|\| ^17 \|\| ^18 \|\| ^19`          |
| Autoplay               | in the core  | separate package                                  |

## Headless, both of them

Neither library ships a stylesheet and neither renders markup of its own — that
part is not a difference, and this document does not pretend it is. Swipi's own
guarantee is enforced rather than asserted: `npm run verify:package` fails the
build if a `.css` file appears in either bundle or anywhere in the published
tarball, and the tarball is six files — the three in `dist`, `LICENSE`,
`README.md` and `package.json`.

What swipi gives back is a ref and a plain object of state. The viewport, the
track, the slides, the arrows, the dots and every accessibility attribute are
markup the consumer writes, so nothing of the library's ends up in the DOM.

Embla's wider React range is a real difference in the other direction: swipi
asks for React 18 or newer, Embla goes back to 16.8.

## Reading the numbers honestly

- **The ratio is the durable figure, not the byte count.** Absolute gzip sizes
  shift with the zlib version and the minifier, so a number measured on another
  machine will not match to the byte. Both libraries here went through the same
  build in the same run, which is what makes the comparison mean anything.
- **This measures the library, not an application.** A real bundle also carries
  React, your components and your CSS, and both carousels are a rounding error
  next to that. The number matters when you are choosing between them, not when
  you are budgeting a page.
- **Feature sets are close but not identical.** Embla has a plugin ecosystem
  (wheel gestures, class names, fade, auto-scroll) that swipi does not, and
  swipi has no vertical axis or RTL. Weight is one axis of the choice.
