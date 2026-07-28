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

Swipi ships with keyboard and screen-reader support out of the box:

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
tried without touching the code:

- toggles and sliders for `loop`, `autoplay`, `autoplaySpeed`, `showArrows`,
  `showDots`, `biasRight`, `initialSlide`, `slidesNumber`, `animationSpeed`,
  `spaceBetweenSlides` and the number of slides;
- selects for `slidesAnimation` and `dotsAnimation`, colour pickers and sizes
  for the dots, custom dot / custom active dot and custom arrow elements;
- an editor for the responsive `config` breakpoints that also shows the current
  window width and the breakpoint that is applied right now;
- buttons for the whole imperative API (`scrollNext`, `scrollPrev`, `scrollTo`,
  `selectedScrollSnap`, `scrollSnapList`, `canScrollNext`, `canScrollPrev`),
  live `onSelect` / `onChange` payloads and an event log;
- a resizable stage with device presets and a generated JSX snippet of the
  current setup, ready to be copied.

Every playground component lives in its own folder and keeps the logic out of
the markup — `index.tsx` renders, `use<Component>.ts` holds the state and the
handlers, `helpers.ts` and `constants.ts` hold the rest:

```
src/Playground
├── index.tsx, usePlayground.ts, types.ts, constants.ts, helpers.ts
└── components
    └── ConfigEditor
        ├── index.tsx          # UI only
        ├── useConfigEditor.ts # state and handlers
        ├── helpers.ts
        └── constants.ts
```

Settings are kept in `localStorage`, so a reload does not reset the setup —
use **Reset props** to get back to the defaults.
