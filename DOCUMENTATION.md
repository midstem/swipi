# Swipi Documentation

This document covers all details of using Swipi, from layout specifics and hook options to accessibility and server rendering.

## Table of Contents

- [Detailed Markup & Accessibility](#detailed-markup--accessibility)
- [CSS Layout Details & Troubleshooting](#css-layout-details--troubleshooting)
- [What the hook returns](#what-the-hook-returns)
- [Options (Props)](#options)
- [Reactive state (`onSelect`)](#reactive-state-onselect)
- [Accessibility Guide](#accessibility-guide)
- [Server rendering](#server-rendering)
- [Browsers support](#browsers-support)
- [Development & Verification](#development--verification)

## Detailed Markup & Accessibility

Roles, labels, `tabIndex`, the arrow keys and the live region are ordinary JSX here: reword them, translate them, drop what you do not need.

```tsx
import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') carousel.scrollPrev()
    if (event.key === 'ArrowRight') carousel.scrollNext()
  }

  return (
    <>
      <div
        className="carousel__viewport"
        ref={carouselRef}
        role="group"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Slides"
        onKeyDown={handleKeyDown}
      >
        <div className="carousel__track">
          {items.map((item, index) => (
            <div
              className="carousel__slide"
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <span className="carousel__status" aria-live="polite" aria-atomic="true">
        Slide {carousel.selectedIndex + 1} of {carousel.snapCount}
      </span>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={carousel.scrollPrev}
        disabled={!carousel.canScrollPrev}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={carousel.scrollNext}
        disabled={!carousel.canScrollNext}
      >
        ›
      </button>

      {Array.from({ length: carousel.snapCount }, (_, index) => (
        <button
          type="button"
          className="carousel__dot"
          key={index}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === carousel.selectedIndex}
          onClick={() => carousel.scrollTo(index)}
        />
      ))}
    </>
  )
}
```

## CSS Layout Details & Troubleshooting

### Required CSS

The README writes the layout as Tailwind classes. Without Tailwind, the same
contract reads like this — class names are yours, only the declarations matter:

```css
.carousel__viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__track {
  display: flex;
  margin-left: -12px;
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 calc(100% / 2);
  min-width: 0;
  padding-left: 12px;
}
```

`flex: 0 0 calc(100% / 2)` sets how many slides are visible, and the `12px` pair
— the slide's `padding-left` and the track's matching negative `margin-left` —
sets the space between them. The rest of this section is why those declarations
are the ones that matter.

> **`slideWidth` and `spaceBetween` size nothing by themselves.** They only
> write `--swipi-slide-width` and `--swipi-slide-gap` onto the track. If your
> CSS never reads those properties, passing the options changes nothing on the
> screen — the carousel goes on measuring whatever your stylesheet actually
> produced.

Read them in the track and the slide rule to let the hook drive the layout:

```css
.carousel__track {
  margin-left: calc(-1 * var(--swipi-slide-gap, 0px));
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 calc(var(--swipi-slide-width, 300px) + var(--swipi-slide-gap, 0px));
  min-width: 0;
  padding-left: var(--swipi-slide-gap, 0px);
}
```

Now `useSwipiCarousel({ slideWidth: 300, spaceBetween: 12 })` decides the width
and the gap, and dropping an option takes the property back off the track so the
fallback in `var()` takes over. Skip the options entirely and the CSS above is
just a stylesheet with defaults.

Slide widths are entirely yours. The carousel measures whatever your CSS
produces and derives the snap positions from it, so `flex: 0 0 50%`, fixed
pixel widths, breakpoints, and even a different width per slide all work.

Five rules make that measuring reliable:

- Leave the track's width alone and never set it to `fit-content`. A percentage
  `flex-basis` resolves against the track, and a track sized by its own content
  makes that circular. Its automatic width fills the viewport, and the negative
  margin below widens it by exactly one gap — which is what lets the last slide
  reach the right edge.
- Give slides `flex-shrink: 0` (the `0` in `flex: 0 0 …`) so they keep the width
  you set instead of being squeezed to fit the viewport.
- Space slides with a `padding-left` and cancel the first one with a matching
  negative `margin-left` on the track. Every slide box then measures the same
  and they sit flush against each other, which is what keeps `loop` uniform —
  and it leaves the basis a plain `1 / N` fraction. Do not add a trailing
  `padding-right` instead: it makes the last slide different from the rest and
  the carousel drifts by that much every lap.
- Keep `scale()` off the viewport, the track and the slides. Measuring goes
  through `getBoundingClientRect()`, so a scaled slide is measured at its
  on-screen size while the track still moves in unscaled pixels. Scaling
  something inside a slide is fine.
- Change the gap between slides through the `spaceBetween` option rather than a
  media query. Sizes are watched with a `ResizeObserver`, and a slide's box
  keeps the same width when only its padding changes, so a breakpoint that
  changes only the gap — leaving the viewport and the slide widths as they are —
  is the one layout change that goes unnoticed.

The gap belongs to the slide here, so give the slide's background to an element
inside it. A background on `.carousel__slide` itself would fill the gap unless
you add `background-clip: content-box`.

In Tailwind the same two rules are `flex -ml-3` on the track and
`min-w-0 shrink-0 grow-0 basis-1/2 pl-3` on the slide — the classes shadcn's
carousel puts on its own container and items, so its components work over this
hook unchanged.

Measuring follows the layout rather than React. The carousel re-measures when a
slide changes size — an image that finishes loading, a webfont that swaps in, an
accordion inside a slide that opens — and when slides are added to or removed
from the track, none of which has to pass through a render. A re-render of the
component around it, on the other hand, reads nothing from the DOM at all.

Measurements keep their fractions: widths that land between two pixels, as
percentage widths usually do, are used as they are rather than rounded, so a
`loop` stays seamless however many times it comes round.

The number of snap positions follows from the measurements: the carousel stops
once the remaining slides fit the viewport, so five half-width slides give four
snaps rather than five.

## What the hook returns

The hook returns a tuple: the ref for the viewport and the carousel itself.

```tsx
const [carouselRef, carousel] = useSwipiCarousel()
```

| Field                    | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `carouselRef`            | Goes on the viewport; the track is found as its only child          |
| `carousel.selectedIndex` | Index of the current snap position                                  |
| `carousel.snapCount`     | Number of snap positions                                            |
| `carousel.slidesCount`   | Number of slides found in the track                                 |
| `carousel.canScrollNext` | Whether a next scroll is possible                                   |
| `carousel.canScrollPrev` | Whether a previous scroll is possible                               |
| `carousel.hasOverflow`   | Whether there are more slides than fit, i.e. dragging does anything |
| `carousel.scrollNext`    | Move to the next snap                                               |
| `carousel.scrollPrev`    | Move to the previous snap                                           |
| `carousel.scrollTo`      | Move to a given snap index                                          |

The object is the whole API: state to render from and methods to command with,
in one place. It keeps its identity between renders and is replaced only when
something about it actually changes, so it is safe in a dependency array.

Pointer and drag listeners are attached to the viewport element directly, so
nothing has to be spread onto your JSX and no handler of yours is overwritten.

## Options

Every option is optional — `useSwipiCarousel()` on its own is a working
carousel.

| Option                 | Description                                                                                                                                                                                           | Default    | Type                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------- |
| `loop`                 | Makes the carousel infinite. The real slides are moved around, not cloned, so every slide stays a single DOM node                                                                                     | `false`    | `boolean`                             |
| `dragFree`             | Keeps the momentum of a drag without snapping to a slide — the track coasts and rests wherever it stops. With `false` one gesture moves by one slide at most, however far it was dragged              | `false`    | `boolean`                             |
| `autoplay`             | Advances the carousel on its own                                                                                                                                                                      | `false`    | `boolean`                             |
| `autoplaySpeed`        | Interval between automatic moves, ms                                                                                                                                                                  | `4000`     | `number`                              |
| `animationSpeed`       | Duration of the carousel's own movement, ms                                                                                                                                                           | `300`      | `number`                              |
| `respectReducedMotion` | Watches `prefers-reduced-motion` and jumps to the target instead of animating while it is set. Off by default — the carousel animates the same for everyone until you ask it not to                   | `false`    | `boolean`                             |
| `startIndex`           | Index of the snap position to open on, counted from zero like every other index in the API. Applied once, on mount, and clamped to the last snap                                                      | `0`        | `number`                              |
| `slideWidth`           | Written onto the track as the `--swipi-slide-width` custom property and nothing else. Sizes a slide only if your CSS reads it — see [Required CSS](#required-css). Measuring still happens in the DOM | —          | `number`                              |
| `spaceBetween`         | The same for the gap, as `--swipi-slide-gap`                                                                                                                                                          | —          | `number`                              |
| `onSelect`             | Called on every state change with the full navigable state                                                                                                                                            | `() => {}` | `(state: SwipiState) => void`         |
| `onChange`             | Called when the current index changes, with the previous, current and next indexes, counted from zero                                                                                                 | `() => {}` | `(positions: SlidePositions) => void` |

## Reactive state (`onSelect`)

Reading `carousel` is enough for the UI around the carousel. `onSelect` is for
everything that lives further away — a progress bar in a sibling component, an
analytics call, a store.

```tsx
import { useState } from 'react'
import { useSwipiCarousel, type SwipiState } from 'swipi'

export const App = () => {
  const [state, setState] = useState<SwipiState>()
  const [carouselRef] = useSwipiCarousel({ onSelect: setState })

  return (
    <>
      <div ref={carouselRef}>
        <div>
          <div>one</div>
          <div>two</div>
        </div>
      </div>

      <p>
        Slide {(state?.selectedIndex ?? 0) + 1} of {state?.snapCount}
      </p>
    </>
  )
}
```

`onSelect` receives a `SwipiState` object:

| Field           | Description                                     | Type      |
| --------------- | ----------------------------------------------- | --------- |
| `selectedIndex` | Index of the currently selected snap position   | `number`  |
| `snapCount`     | Total number of snap positions                  | `number`  |
| `canScrollNext` | Whether a next scroll is currently possible     | `boolean` |
| `canScrollPrev` | Whether a previous scroll is currently possible | `boolean` |

The callback is read through a ref, so passing an inline arrow function does
not re-subscribe anything and does not fire an extra call on every render.

## Accessibility Guide

The hook generates no attributes and no strings. What the markup above gives
you instead is the whole thing as plain JSX:

- the viewport is a focusable `role="group"` with
  `aria-roledescription="carousel"` and a label you choose;
- every slide is a labelled group, `"2 of 5"`;
- <kbd>←</kbd> / <kbd>→</kbd> move between snaps while the viewport has focus;
- a polite live region announces the slide that was selected;
- arrows and dots are real `<button>`s with labels and `aria-current`.

Because it is your code, translating it is editing it — no options to look up,
no strings the library decides for you. `"Slide 2 of 5"` becomes
`"Слайд 2 з 5"` where it is written.

Motion is yours as well. The hook animates the same for everyone until you pass
`respectReducedMotion`; with it the carousel jumps straight to the target while
the system asks for reduced motion. Do the same for the transitions you write.

```tsx
const [carouselRef, carousel] = useSwipiCarousel({ respectReducedMotion: true })
```

## Server rendering

The hook renders on the server. Nothing it does during render touches `window`,
`document`, `ResizeObserver` or `MutationObserver` — every measurement lives in
an effect, and the effects that need the layout fall back to `useEffect` when
there is no `window`, so `renderToString` stays silent on React 18 as well as on
React 19.

What the server sends is your markup with an unmeasured carousel behind it:

```tsx
const [carouselRef, carousel] = useSwipiCarousel()

carousel.slidesCount // 0
carousel.snapCount // 0
carousel.hasOverflow // false
carousel.canScrollNext // false
```

The first client render returns the same values, so the markup hydrates without
a mismatch; the measurement lands right after, in a layout effect, before the
browser paints. Dots driven by `snapCount` therefore appear on hydration rather
than in the server output — render them from your own data if you need them in
the HTML.

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 3 versions                                                                                                                                                                                                   | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                           |

## Development & Verification

### Before publishing

```bash
$ npm run verify:published
```

The gate packs the tarball with `npm pack`, installs it into a throwaway Vite +
React app built from `packages/react/scripts/consumer-app`, and runs the package the way a
consumer does. The install uses a cache directory of its own, so a `file:`
tarball of a version npm has already seen can never be served from the cache.

The app is then put through:

- **entries** — `import 'swipi'` and `require('swipi')` both hand back
  `useSwipiCarousel`, and nothing else at runtime;
- **ssr** — `renderToString` produces the markup and writes nothing to the
  console;
- **client** — a StrictMode mount in jsdom measures the slides, moves to the
  next snap and unmounts, with the console silent through all of it;
- **dev** — the dev server pre-bundles the package, and an edit to the component
  holding the carousel arrives as a hot update instead of a page reload;
- **prod** — `vite build` output is minified, carries the carousel, works when
  it is mounted, and drops the runtime entirely from a build that imports the
  hook without calling it.

Everything except the dev server and the production build runs twice, on React
19 and on React 18. `npm run verify:package`, which checks what goes into the
tarball rather than what the tarball does, stays where it is and keeps running
on every pull request.
