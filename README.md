# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/swipi.svg
[npm-url]: http://npmjs.org/package/swipi
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/swipi
[bundlephobia-url]: https://bundlephobia.com/result?p=swipi

<a href='https://midstem.net'>
  <img src='assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a lightweight and compact slider optimized for mobile use. It's built with TypeScript and has a fast loading speed. It's also swipeable, making it easy for users to switch slides with a swipe on their mobile device. Its mobile-friendly design and convenience make it a great choice for improving user experience.</p>

### Installation

**npm**

```bash
$ npm install swipi
```

**yarn**

```bash
$ yarn add swipi
```

## **Usage**

```jsx
import Swipi from 'swipi'

const styles = { height: '250px', backgroundColor: '#dadada' }

export const App = () => (
  <Swipi loop showDots spaceBetweenSlides={15}>
    <div style={styles} />
    <div style={styles} />
    <div style={styles} />
    <div style={styles} />
    <div style={styles} />
  </Swipi>
)
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Headless (`useSwipiCarousel`)**

The component above renders our markup, our dots and our arrows. When you want
your own, take the hook instead: it gives you the carousel engine — drag,
momentum, snapping, looping, autoplay — and you write every element yourself.

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

Three rules make that measuring reliable:

- Keep `width: 100%` on the track rather than `fit-content`. A percentage
  `flex-basis` resolves against the track, and a track sized by its own content
  makes that circular — the browser will hand you widths you did not ask for.
- Give slides `flex-shrink: 0` (the `0` in `flex: 0 0 …`) so they keep the width
  you set instead of being squeezed to fit the viewport.
- Space slides with `margin` rather than `padding`, and clear it on the last
  one. Padding sits inside the slide's box, so in `loop` mode the trailing gap
  becomes part of the repeat and the carousel drifts by that much every lap.

The number of snap positions follows from the measurements: the carousel stops
once the remaining slides fit the viewport, so five half-width slides give four
snaps rather than five.

The block above is generated by the playground (`npm start`), which prints the
markup and the CSS for whatever settings you pick — and a test keeps this
README in step with it.

### What the hook returns

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

The hook takes the behavioural options — `loop`, `dragFree`, `initialSlide`,
`animationSpeed`, `autoplay`, `autoplaySpeed`, `onSelect`, `onChange` — and
none of the component's visual ones. Sizing props such as `slidesNumber` and
`spaceBetweenSlides` are deliberately absent: slide widths come from your CSS.

Pointer and drag listeners are attached to the viewport element directly, so
nothing has to be spread onto your JSX and no handler of yours is overwritten.

### The accessibility is yours

The hook generates no attributes and no strings. What the block above gives you
instead is the whole thing as plain JSX:

- the viewport is a focusable `role="group"` with
  `aria-roledescription="carousel"` and a label you choose;
- every slide is a labelled group, `"2 of 5"`;
- <kbd>←</kbd> / <kbd>→</kbd> move between snaps while the viewport has focus;
- a polite live region announces the slide that was selected;
- arrows and dots are real `<button>`s with labels and `aria-current`.

Because it is your code, translating it is editing it — no options to look up,
no strings the library decides for you. `"Slide 2 of 5"` becomes
`"Слайд 2 з 5"` where it is written.

## **Imperative API (ref)**

Attach a `ref` to control the slider programmatically — build your own
buttons, thumbnails, or sync several sliders together.

```tsx
import { useRef } from 'react'
import Swipi, { SwipiRef } from 'swipi'

const styles = { height: '250px', backgroundColor: '#dadada' }

export const App = () => {
  const swipiRef = useRef<SwipiRef>(null)

  return (
    <>
      <Swipi ref={swipiRef} loop showDots spaceBetweenSlides={15}>
        <div style={styles} />
        <div style={styles} />
        <div style={styles} />
      </Swipi>

      <button onClick={() => swipiRef.current?.scrollPrev()}>Prev</button>
      <button onClick={() => swipiRef.current?.scrollTo(2)}>Go to 3rd</button>
      <button onClick={() => swipiRef.current?.scrollNext()}>Next</button>
    </>
  )
}
```

| Method               | Description                                            | Type                      |
| -------------------- | ------------------------------------------------------ | ------------------------- |
| `scrollNext`         | Scroll to the next snap position (respects `loop`)     | `() => void`              |
| `scrollPrev`         | Scroll to the previous snap position (respects `loop`) | `() => void`              |
| `scrollTo`           | Scroll to a given snap index (0-based)                 | `(index: number) => void` |
| `selectedScrollSnap` | Index of the currently selected snap position          | `() => number`            |
| `scrollSnapList`     | List of all available snap indices, e.g. `[0, 1, 2]`   | `() => number[]`          |
| `canScrollNext`      | Whether a next scroll is currently possible            | `() => boolean`           |
| `canScrollPrev`      | Whether a previous scroll is currently possible        | `() => boolean`           |

## **Reactive state (`onSelect`)**

While `ref` lets you _command_ the slider, `onSelect` lets the slider _report_
its state back to you on every change — so your own UI (progress bar, "slide X
of Y", custom controls) re-renders automatically without reading from the ref.

```tsx
import { useState } from 'react'
import Swipi, { SwipiState } from 'swipi'

export const App = () => {
  const [state, setState] = useState<SwipiState>()

  return (
    <>
      <Swipi onSelect={setState} showDots>
        <div />
        <div />
        <div />
      </Swipi>

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

## **Accessibility**

The `<Swipi>` component ships with keyboard and screen-reader support out of
the box (with the hook, the markup — and therefore the accessibility — is
yours):

- The carousel exposes `role="group"` + `aria-roledescription="carousel"` with a
  configurable `aria-label` (via the `ariaLabel` prop), and each slide is a
  labelled group (`"1 of 5"`).
- Slide changes are announced through a polite `aria-live` region.
- Arrows and dots are real `<button>`s with meaningful labels
  (`"Previous slide"`, `"Go to slide 3"`) and `aria-current` on the active dot.
- The slider responds to <kbd>←</kbd> / <kbd>→</kbd> when focused, with a visible
  `:focus-visible` outline.
- Animations are disabled under `prefers-reduced-motion`.

## **Browsers support**

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 3 versions                                                                                                                                                                                                   | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                               | last 3 versions                                                                                                                                                                                           |

## **Props**

<table width='100%'>
  <tr>
    <th><h3><b>Props</b></h3></th>
    <th><h3><b>Description</b></h3></th>
    <th><h3><b>Default</b></h3></th>
    <th><h3><b>Type</b></h3></th>
  </tr>
  <tr>
    <td>initialSlide</td>
    <td>Sets the initial slide</td>
    <td><code>1</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>slidesNumber</td>
    <td>Number of visible slides (takes effect only if a user didn't set <code>slidesNumber</code> in the <code>config</code> or if the screen width is wider than what is stated in <code>maxWidth</code> in the <code>config</code>)</td>
    <td><code>3</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>spaceBetweenSlides</td>
    <td>Space between slides (takes effect only if a user didn't set <code>spaceBetween</code> in the <code>config</code> or if the screen width is wider than what is stated in <code>maxWidth</code> in the <code>config</code>)</td>
    <td><code>0</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>animationSpeed</td>
    <td>Sets the duration (in milliseconds) for slide transitions</td>
    <td><code>300</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>showDots</td>
    <td>Enable/disable dots</td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>sizeForDefaultDot</td>
    <td>Sets the size for default dot</td>
    <td><code>12</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>sizeForDefaultActiveDot</td>
    <td>Sets the size for default active dot</td>
    <td><code>12</code></td>
    <td>number</td>
  </tr>
  <tr>
    <td>dotColor</td>
    <td>
      If a custom dot is not provided but <code>showDots</code> is set to
      <code>true</code> then you can change the default dots color
    </td>
    <td><code>'#c7c7c7'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>activeDotColor</td>
    <td>
      If a custom active dot is not provided but <code>showDots</code> is set
      to <code>true</code> then you can change the active dot color
    </td>
    <td><code>'#000000'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>customDot</td>
    <td>Provide your custom JSX.Element</td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>customActiveDot</td>
    <td>
      Provide your custom active dot. It will be
      used to show the user what slide he is at
    </td>
    <td>-</td>
    <td>JSX.Element</td>
  </tr>
  <tr>
    <td>showArrows</td>
    <td>Enable/disable arrows</td>
    <td><code>true</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>prevButton</td>
    <td>Custom element to move slides back</td>
    <td><code>ᐸ</code></td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>nextButton</td>
    <td>Custom element to move slides forward</td>
    <td><code>ᐳ</code></td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>autoplay</td>
    <td>A boolean that enables slides to slide automatically</td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>autoplaySpeed</td>
    <td>The interval in milliseconds with which the slides are changed</td>
    <td><code>4000</code></td>
    <td>number</td>
  </tr>
    <tr>
    <td>biasRight</td>
    <td>Show/hide a piece of an element that goes after visible slides</td>
    <td>false</td>
    <td>boolean</td>
  </tr>
    <tr>
    <td>loop</td>
    <td>Makes the slider infinite</td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
    <tr>
    <td>dragFree</td>
    <td>
      Keeps the momentum of a drag without snapping to a slide — the track
      coasts and rests wherever it stops. With <code>false</code> one gesture
      moves by one slide at most, however far it was dragged, and the release
      speed only decides whether the slide changes at all
    </td>
    <td><code>false</code></td>
    <td>boolean</td>
  </tr>
    <tr>
    <td>onChange</td>
    <td>The onChange function is called every time the current index changes and returns an object with the current, previous and next indices</td>
    <td><code>() => {}</code></td>
    <td>({ prev: number, current: number, next: number }) => void</td>
  </tr>
    <tr>
    <td>onSelect</td>
    <td>Called on every state change with the full navigable state, so external UI can stay in sync (see <a href="#reactive-state-onselect">Reactive state</a>)</td>
    <td><code>() => {}</code></td>
    <td>({ selectedIndex: number, snapCount: number, canScrollNext: boolean, canScrollPrev: boolean }) => void</td>
  </tr>
    <tr>
    <td>ariaLabel</td>
    <td>Accessible name for the carousel, announced by screen readers</td>
    <td><code>'Slides'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td>config</td>
    <td>
      Takes an array of objects to manipulate slides:
      <code>slidesNumber, maxWidth, biasRight, spaceBetween</code>.
      If <code>config</code> is not provided then the default
      settings of its parameters are used
    </td>
    <td>
      -
    </td>
    <td>array</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3><code>config</code> parameters:</h3>
    </td>
  </tr>
  <tr>
    <td>slidesNumber</td>
    <td>Number of visible slides according to <code>maxWidth</code> prop</td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td>maxWidth</td>
    <td>Defines a width after which the number of slides will change</td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td>biasRight</td>
    <td>Show/hide a piece of an element that goes after visible slides</td>
    <td>-</td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>spaceBetween</td>
    <td>Space between slides that can be changed according <code>maxWidth</code></td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Dots animations:</h3>
    </td>
  </tr>
  <tr>
    <td>dotsAnimation</td>
    <td>Active dot behavior</td>
    <td><code>'default'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Options for dots animations:</h3>
    </td>
  </tr>
  <tr>
    <td><code>'default'</code></td>
    <td colspan="3">The active dot instantly moves with the corresponding slide without any animation</td>
  </tr>
  <tr>
    <td><code>'sliding'</code></td>
    <td colspan="3">The active dot smoothly slides to its new position, and the 'passive' dot smoothly fades away from the area it once occupied</td>
  </tr>
  <tr>
   <tr>
    <td colspan="4" align='center'>
      <h3>Slides animations:</h3>
    </td>
  </tr>
  <tr>
    <td>slidesAnimation</td>
    <td>The animation while transitioning between slides</td>
    <td><code>'default'</code></td>
    <td>string</td>
  </tr>
  <tr>
    <td colspan="4" align='center'>
      <h3>Options for slides animations:</h3>
    </td>
  </tr>
  <tr>
    <td><code>'default'</code></td>
    <td colspan="3">The slides change each other by sliding from left to right and vice verse, operating in a standard manner so to say</td>
  </tr>
  <tr>
    <td><code>'fade-in'</code></td>
    <td colspan="3">The fade-in animation gradually brings an element into view, transitioning it from complete transparency to full opacity on the screen</td>
  </tr>
  <tr>
</table>

## 💅 **Styling**

```css
.swipi-wrapper - styles the container that wraps the slider with dots

.swipi-container - styles the container that wraps slides with arrows

.swipi-viewport - styles the visible window the track is dragged inside

.swipi-track - styles the moving track that holds the slides (drag cursor and
text selection live here)

.dots-wrapper - styles the container that wraps the dots

.left-button - styles the left button that gets the user to the previous slide

.right-button - styles the right button that gets the user to the next slide
```

## 🛠 **Development**

Run the local playground (`src/Playground`) with hot-reload to try changes
before publishing:

```bash
$ npm start
```

The playground exposes **every** prop of the component, so a change can be
tried without touching the code.
