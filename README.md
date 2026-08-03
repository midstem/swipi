# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/swipi.svg
[npm-url]: http://npmjs.org/package/swipi
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/swipi
[bundlephobia-url]: https://bundlephobia.com/result?p=swipi

<a href='https://midstem.net'>
  <img src='assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for React. One hook gives you the engine
— drag, momentum, snapping, looping, autoplay — and hands back a ref and a
small object of state. The markup, the CSS and the accessibility stay yours, so
nothing of ours ends up in your DOM and there is no stylesheet to import.</p>

> Upgrading from Swipi 2? The `<Swipi>` component and its ~30 props are gone in
> 3.0 — [MIGRATION.md](MIGRATION.md) maps every one of them to a hook option or
> a line of CSS.

### Installation

**npm**

```bash
$ npm install swipi
```

**yarn**

```bash
$ yarn add swipi
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Usage**

Wiring is a single ref on the viewport. The track is its only child and the
slides are the children of the track — the same contract Embla uses.
Everything else on the page is markup you own, accessibility attributes
included — so the playground prints them for you instead of the library
inventing them at runtime.

### The markup

Roles, labels, `tabIndex`, the arrow keys and the live region are ordinary
JSX here: reword them, translate them, drop what you do not need.

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

### Required CSS

This is a contract, not a suggestion — the geometry depends on it. Class names
are yours; only the declarations matter. The last rule is the exception: it
only hides the live region from the screen while leaving it to screen readers.

```css
.carousel__viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__track {
  display: flex;
  width: 100%;
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 calc((100% - 1 * 12px) / 2);
  margin-right: 12px;
}

.carousel__slide:last-child {
  margin-right: 0;
}

.carousel__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
```

Slide widths are entirely yours. The carousel measures whatever your CSS
produces and derives the snap positions from it, so `flex: 0 0 50%`, fixed
pixel widths, breakpoints, and even a different width per slide all work.

Four rules make that measuring reliable:

- Keep `width: 100%` on the track rather than `fit-content`. A percentage
  `flex-basis` resolves against the track, and a track sized by its own content
  makes that circular — the browser will hand you widths you did not ask for.
- Give slides `flex-shrink: 0` (the `0` in `flex: 0 0 …`) so they keep the width
  you set instead of being squeezed to fit the viewport.
- Space slides with `margin` rather than `padding`, and clear it on the last
  one. Padding sits inside the slide's box, so in `loop` mode the trailing gap
  becomes part of the repeat and the carousel drifts by that much every lap.
- Keep `scale()` off the viewport, the track and the slides. Measuring goes
  through `getBoundingClientRect()`, so a scaled slide is measured at its
  on-screen size while the track still moves in unscaled pixels. Scaling
  something inside a slide is fine.

Measurements keep their fractions: widths that land between two pixels, as
percentage widths usually do, are used as they are rather than rounded, so a
`loop` stays seamless however many times it comes round.

The number of snap positions follows from the measurements: the carousel stops
once the remaining slides fit the viewport, so five half-width slides give four
snaps rather than five.

The block above is generated by the playground (`npm start`), which prints the
markup and the CSS for whatever settings you pick — and a test keeps this
README in step with it.

## **What the hook returns**

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

## **Options**

Every option is optional — `useSwipiCarousel()` on its own is a working
carousel.

| Option           | Description                                                                                                                                                                              | Default    | Type                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------- |
| `loop`           | Makes the carousel infinite. The real slides are moved around, not cloned, so every slide stays a single DOM node                                                                        | `false`    | `boolean`                             |
| `dragFree`       | Keeps the momentum of a drag without snapping to a slide — the track coasts and rests wherever it stops. With `false` one gesture moves by one slide at most, however far it was dragged | `false`    | `boolean`                             |
| `autoplay`       | Advances the carousel on its own                                                                                                                                                         | `false`    | `boolean`                             |
| `autoplaySpeed`  | Interval between automatic moves, ms                                                                                                                                                     | `4000`     | `number`                              |
| `animationSpeed` | Duration of the carousel's own movement, ms. Ignored under `prefers-reduced-motion`                                                                                                      | `300`      | `number`                              |
| `initialSlide`   | The slide to open on, counted from one. Applied once, on mount; `0` and `1` both mean the first slide                                                                                    | `0`        | `number`                              |
| `slideWidth`     | Optional. Written onto the track as the `--swipi-slide-width` custom property, for stylesheets that would rather take the number from JavaScript. Measuring still happens in the DOM     | —          | `number`                              |
| `spaceBetween`   | The same for the gap, as `--swipi-slide-gap`                                                                                                                                             | —          | `number`                              |
| `onSelect`       | Called on every state change with the full navigable state                                                                                                                               | `() => {}` | `(state: SwipiState) => void`         |
| `onChange`       | Called when the current index changes, with the previous, current and next positions counted from one                                                                                    | `() => {}` | `(positions: SlidePositions) => void` |

## **Reactive state (`onSelect`)**

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

## **The accessibility is yours**

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

The one thing the hook does decide is motion: it skips its own animation under
`prefers-reduced-motion`. Do the same for the transitions you write.

## **Browsers support**

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 3 versions                                                                                                                                                                                                   | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                           |

## 🛠 **Development**

Run the local playground (`src/Playground`) with hot-reload to try changes
before publishing:

```bash
$ npm start
```

The playground drives the hook through every option, prints the markup and the
CSS for the current settings, and keeps the layout controls — breakpoints,
`biasRight`, fade-in — on its own side so you can see what the CSS in this
README is doing.
