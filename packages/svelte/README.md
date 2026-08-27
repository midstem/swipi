# Swipi for Svelte

[![NPM version][npm-image]][npm-url] [![bundle size][size-image]][size-url]

[npm-image]: https://img.shields.io/npm/v/%40midstem%2Fswipi-svelte.svg
[npm-url]: https://npmjs.org/package/@midstem/swipi-svelte
[size-image]: https://deno.bundlejs.com/badge?q=@midstem/swipi-svelte&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22svelte%22%2C%22svelte%2Fstore%22%5D%7D%7D
[size-url]: https://bundlejs.com/?q=%40midstem%2Fswipi-svelte&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22svelte%22%2C%22svelte%2Fstore%22%5D%7D%7D

<a href='https://midstem.net'>
  <img src='https://raw.githubusercontent.com/midstem/swipi/main/assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for Svelte. One function gives you the
engine — drag, momentum, snapping, looping, autoplay — and hands back an action
and a readable store of state. The markup, the CSS and the accessibility stay
yours, so nothing of ours ends up in your DOM and there is no stylesheet to
import.</p>

<p>It weighs around <b>4.9 KB gzipped</b> with Svelte kept external — roughly
1.6× less than
<a href="https://bundlejs.com/?q=embla-carousel-svelte&treeshake=%5B%7Bdefault%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22svelte%22%5D%7D%7D"><code>embla-carousel-svelte</code></a>
measured the same way.</p>

### Installation

**npm**

```bash
$ npm install @midstem/swipi-svelte
```

**yarn**

```bash
$ yarn add @midstem/swipi-svelte
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Basic Usage**

Wiring is a single action on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```svelte
<script>
  import { useSwipiCarousel } from '@midstem/swipi-svelte'

  let { items } = $props()

  const [carouselRef, carousel] = useSwipiCarousel({ loop: true })
</script>

<div class="overflow-hidden touch-pan-y" use:carouselRef>
  <div class="flex -ml-3 select-none">
    {#each items as item (item.id)}
      <div class="min-w-0 shrink-0 grow-0 basis-1/2 pl-3">{item.title}</div>
    {/each}
  </div>
</div>

<button
  type="button"
  disabled={!$carousel.canScrollPrev}
  onclick={() => $carousel.scrollPrev()}
>
  ‹
</button>
<button
  type="button"
  disabled={!$carousel.canScrollNext}
  onclick={() => $carousel.scrollNext()}
>
  ›
</button>
```

`carouselRef` is a Svelte action, so it goes on the viewport as `use:`, and
`carousel` is a readable store — read its state in the template with the `$`
prefix. The action tears the engine down when the element leaves the DOM, so
there is nothing to clean up by hand.

The snippet above is Svelte 5. Nothing in the package is tied to runes, so the
same wiring works on Svelte 4 with `export let items` and `on:click`.

### Reactive options

The options you hand to `useSwipiCarousel` are read once. Pass a store instead
when they have to follow something else, and every value it emits reaches the
engine:

```svelte
<script>
  import { writable } from 'svelte/store'
  import { useSwipiCarousel } from '@midstem/swipi-svelte'

  const options = writable({ loop: true })

  const [carouselRef, carousel] = useSwipiCarousel(options)

  const freeze = () => options.set({ loop: false })
</script>
```

### The classes

Those three class lists are a contract, not decoration — the geometry depends on
them. Two of them are yours to tune: `basis-1/2` sets how many slides are
visible, and the `pl-3` on the slide with the matching `-ml-3` on the track sets
the space between them. Everything else on the page is styling you own.

Not using Tailwind? Our documentation provides examples using both Tailwind and
plain CSS.

## **Documentation**

For advanced usage, available options, responsive layout specifics, state
management, and accessibility guidelines, please refer to our full documentation
at [https://swipi.midstem.net/docs/](https://swipi.midstem.net/docs/).
