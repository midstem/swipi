# Size against Embla

Swipi 3.0 set out to be a headless carousel that weighs less than the headless
carousel people already reach for. This is the measurement behind that claim.

Measured on 2026-08-04, both libraries installed from npm, both put through the
same build.

## Result

| Bundle                                                   |    Raw |  Gzip | × swipi |
| -------------------------------------------------------- | -----: | ----: | ------: |
| `swipi` 3.0.0                                            | 12,831 | 4,368 |    1.00 |
| `embla-carousel-react` 8.6.0                             | 25,533 | 8,612 |    1.97 |
| `embla-carousel-react` + `embla-carousel-autoplay` 8.6.0 | 28,474 | 9,390 |    2.15 |

**Swipi is 2.15× lighter than the Embla setup that does the same things**, and
1.97× lighter than Embla's React core even before autoplay is added.

The second row exists because autoplay is not a fair thing to leave out: it is
an option in the swipi core (`autoplay`, `autoplaySpeed`), while in Embla it is
a separate plugin package. The last row compares carousels with the same feature
set; the middle row is there so nobody has to take that judgement on trust.

## How it was measured

One machine, one runtime, one build tract, both libraries bundled the same way —
Vite 8.2.0 in library mode, ESM output, default minifier, React marked external
so no React bytes land in either number. Gzip is `zlib` level 9.

```js
// bench.mjs
import { build } from 'vite'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'

const ENTRIES = [
  ['swipi', 'src/swipi.js'],
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

The three entry files are one line each:

```js
// src/swipi.js
export { useSwipiCarousel } from 'swipi'

// src/embla-core.js
export { default as useEmblaCarousel } from 'embla-carousel-react'

// src/embla-autoplay.js
export { default as useEmblaCarousel } from 'embla-carousel-react'
export { default as Autoplay } from 'embla-carousel-autoplay'
```

To reproduce:

```bash
npm install vite@8 swipi@3.0.0 embla-carousel-react@8.6.0 embla-carousel-autoplay@8.6.0
node bench.mjs
```

## What ships with each

|                        | swipi 3.0.0  | embla-carousel-react 8.6.0                        |
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
tarball, and the tarball is 12 files — `dist`, `LICENSE`, `README.md`,
`package.json`.

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
