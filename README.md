# Swipi

[![NPM version][npm-image]][npm-url] [![bundle size][size-image]][size-url]

[npm-image]: https://img.shields.io/npm/v/%40midstem%2Fswipi-react.svg
[npm-url]: https://npmjs.org/package/@midstem/swipi-react
[size-image]: https://deno.bundlejs.com/badge?q=@midstem/swipi-react&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D
[size-url]: https://bundlejs.com/?q=%40midstem%2Fswipi-react&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D

<a href='https://midstem.net'>
  <img src='assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for React. One hook gives you the engine
— drag, momentum, snapping, looping, autoplay — and hands back a ref and a
small object of state. The markup, the CSS and the accessibility stay yours, so
nothing of ours ends up in your DOM and there is no stylesheet to import.</p>

<p>It weighs around <b>4.7 KB gzipped</b> with React kept external — roughly
1.7× less than
<a href="https://bundlejs.com/?q=embla-carousel-react&treeshake=%5B%7Bdefault%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D"><code>embla-carousel-react</code></a>
measured the same way.</p>

### Installation

**npm**

```bash
$ npm install @midstem/swipi-react
```

**yarn**

```bash
$ yarn add @midstem/swipi-react
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Basic Usage**

Wiring is a single ref on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```tsx
import { useSwipiCarousel } from '@midstem/swipi-react'

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

Not using Tailwind? Our documentation provides examples using both Tailwind and plain CSS.

## **Documentation**

For advanced usage, available options, responsive layout specifics, state management, and accessibility guidelines, please refer to our full documentation at [https://swipi.midstem.net/docs/](https://swipi.midstem.net/docs/).
