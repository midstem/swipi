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

### 1. The markup

```tsx
import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

  return (
    <>
      <div className="carousel__viewport" ref={carouselRef}>
        <div className="carousel__track">
          {items.map((item) => (
            <div className="carousel__slide" key={item.id}>
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

### 2. Required CSS

This is a contract, not a suggestion — the geometry depends on it.

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

Two numbers are yours to change: `flex: 0 0 calc(100% / 2)` sets how many slides
are visible, and the `12px` pair — the slide's `padding-left` and the track's
matching negative `margin-left` — sets the space between them.

## **Documentation**

For advanced usage, available options, responsive layout specifics, state management, and accessibility guidelines, please refer to the full [DOCUMENTATION.md](./DOCUMENTATION.md).

## 🛠 **Development**

Run the local playground (`src/Playground`) with hot-reload to try changes:

```bash
$ npm start
```

For more details on the verification process, check [DOCUMENTATION.md](./DOCUMENTATION.md#development--verification).
