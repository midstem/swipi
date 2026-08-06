# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/swipi.svg
[npm-url]: http://npmjs.org/package/swipi
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/swipi?color=%238ab4f8&label=gzip%20size
[bundlephobia-url]: https://bundlephobia.com/result?p=swipi

<a href='https://midstem.net'>
  <img src='assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for React. One hook gives you the engine
— drag, momentum, snapping, looping, autoplay — and hands back a ref and a
small object of state. The markup, the CSS and the accessibility stay yours, so
nothing of ours ends up in your DOM and there is no stylesheet to import.</p>

<p>It weighs <b>4.4 KB gzipped</b> — 2.15× less than
<code>embla-carousel-react</code> with its autoplay plugin, measured through the
same build in
<a href="https://github.com/midstem/swipi/blob/main/SIZE.md">SIZE.md</a>.</p>

> Upgrading from Swipi 2? The `<Swipi>` component and its ~30 props are gone in
> 3.0 —
> [MIGRATION.md](https://github.com/midstem/swipi/blob/main/MIGRATION.md) maps
> every one of them to a hook option or a line of CSS.

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

## **Basic Usage**

Wiring is a single ref on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```tsx
import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

  return (
    <>
      <div className="overflow-hidden touch-pan-y" ref={carouselRef}>
        <div className="flex -ml-3 select-none">
          {items.map((item) => (
            <div
              className="min-w-0 shrink-0 grow-0 basis-1/2 pl-3"
              key={item.id}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={carousel.scrollPrev}
        disabled={!carousel.canScrollPrev}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={carousel.scrollNext}
        disabled={!carousel.canScrollNext}
      >
        ›
      </button>
    </>
  )
}
```

### The classes

Those three class lists are a contract, not decoration — the geometry depends on
them. Two of them are yours to tune: `basis-1/2` sets how many slides are
visible, and the `pl-3` on the slide with the matching `-ml-3` on the track sets
the space between them. Everything else on the page is styling you own.

Not using Tailwind? The same contract as plain CSS is in
[DOCUMENTATION.md](./DOCUMENTATION.md#required-css).

## **Documentation**

For advanced usage, available options, responsive layout specifics, state management, and accessibility guidelines, please refer to the full [DOCUMENTATION.md](./DOCUMENTATION.md).

## 🛠 **Development**

Run the local playground (`src/Playground`) with hot-reload to try changes:

```bash
$ npm start
```

For more details on the verification process, check [DOCUMENTATION.md](./DOCUMENTATION.md#development--verification).
