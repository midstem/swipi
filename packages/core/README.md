# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][size-image]][size-url]

[npm-image]: https://img.shields.io/npm/v/%40midstem%2Fswipi.svg
[npm-url]: https://npmjs.org/package/@midstem/swipi
[size-image]: https://deno.bundlejs.com/badge?q=@midstem/swipi&treeshake=%5B%7BcreateSwipi%7D%5D
[size-url]: https://bundlejs.com/?q=%40midstem%2Fswipi&treeshake=%5B%7BcreateSwipi%7D%5D

<a href='https://midstem.net'>
  <img src='https://raw.githubusercontent.com/midstem/swipi/main/assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for plain JavaScript. One call gives you
the engine — drag, momentum, snapping, looping, autoplay — and hands back a
small imperative API. The markup, the CSS and the accessibility stay yours, so
nothing of ours ends up in your DOM and there is no stylesheet to import.</p>

<p>It weighs around <b>4.5 KB gzipped</b> and depends on nothing. This is not a
port of the framework adapters — <a
href="https://npmjs.org/package/@midstem/swipi-react"><code>@midstem/swipi-react</code></a>,
<a href="https://npmjs.org/package/@midstem/swipi-vue"><code>@midstem/swipi-vue</code></a>,
<a href="https://npmjs.org/package/@midstem/swipi-svelte"><code>@midstem/swipi-svelte</code></a>
and <a href="https://npmjs.org/package/@midstem/swipi-angular"><code>@midstem/swipi-angular</code></a>
are built on this package and bundle it, and each of them is a hundred lines of
wiring around the API below. Reach for it directly when you are on no framework,
or when you are writing an adapter for one we do not cover yet: you get the same
surface we build on, not a reduced one.</p>

### Installation

**npm**

```bash
$ npm install @midstem/swipi
```

**yarn**

```bash
$ yarn add @midstem/swipi
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Basic Usage**

Wiring is a single call on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```html
<div class="viewport">
  <div class="track">
    <div class="slide">one</div>
    <div class="slide">two</div>
    <div class="slide">three</div>
  </div>
</div>

<button type="button" id="prev">‹</button>
<button type="button" id="next">›</button>
```

### The engine

```js
import { createSwipi } from '@midstem/swipi'

const viewport = document.querySelector('.viewport')
const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

const carousel = createSwipi(viewport, { loop: true })

prev.addEventListener('click', () => carousel.scrollPrev())
next.addEventListener('click', () => carousel.scrollNext())

const render = () => {
  const { canScrollPrev, canScrollNext } = carousel.getSnapshot()

  prev.disabled = !canScrollPrev
  next.disabled = !canScrollNext
}

carousel.subscribe(render)

render()
```

Call `carousel.destroy()` when the carousel leaves the page: it removes every
listener and observer and puts the track back the way it found it.

### The classes

```css
.viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.track {
  display: flex;
  margin-left: -0.75rem;
  user-select: none;
}

.slide {
  flex: 0 0 50%;
  min-width: 0;
  padding-left: 0.75rem;
}
```

Those three rules are a contract, not decoration — the geometry depends on
them. Two of them are yours to tune: `flex-basis` sets how many slides are
visible, and the padding on the slide with the matching negative margin on the
track sets the space between them. Everything else on the page is styling you
own.

## **The API**

`createSwipi(viewport, options)` returns:

| Member                          | What it does                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `scrollNext()` / `scrollPrev()` | move one snap in either direction                                                                 |
| `scrollTo(index)`               | move to a snap by index                                                                           |
| `getSnapshot()`                 | read `selectedIndex`, `snapCount`, `slidesCount`, `hasOverflow`, `canScrollNext`, `canScrollPrev` |
| `subscribe(listener)`           | run a listener on every state change; returns the unsubscribe                                     |
| `update(options)`               | change options on a live carousel                                                                 |
| `measure()`                     | remeasure after a layout change the observers cannot see                                          |
| `sync()`                        | reapply the current transform after the slides were re-rendered                                   |
| `destroy()`                     | tear everything down                                                                              |

`subscribe` and `getSnapshot` are shaped for a store: they are exactly what
`useSyncExternalStore` and its equivalents in other frameworks expect, which is
how the adapters in this repository are written.

The package also exports `resolveOptions(options)`, which fills every option in
with its default and hands back a `ResolvedSwipiOptions`. An adapter needs it to
diff options across a render — every adapter in this repository is built on
`createSwipi`, `resolveOptions` and these types, and on nothing else.

## **Documentation**

For advanced usage, available options, responsive layout specifics, state
management, and accessibility guidelines, please refer to our full documentation
at [https://swipi.midstem.net/docs/](https://swipi.midstem.net/docs/).
