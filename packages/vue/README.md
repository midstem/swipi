# Swipi for Vue

[![NPM version][npm-image]][npm-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: https://img.shields.io/npm/v/swipi-vue.svg
[npm-url]: http://npmjs.org/package/swipi-vue
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/swipi-vue?color=%238ab4f8&label=gzip%20size
[bundlephobia-url]: https://bundlephobia.com/result?p=swipi-vue

<a href='https://midstem.net'>
  <img src='https://raw.githubusercontent.com/midstem/swipi/main/assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for Vue 3. One composable gives you the
engine — drag, momentum, snapping, looping, autoplay — and hands back a template
ref and a reactive object of state. The markup, the CSS and the accessibility
stay yours, so nothing of ours ends up in your DOM and there is no stylesheet to
import.</p>

<p>It weighs <b>5.2 KB gzipped</b> and runs on the same
framework-agnostic core as the React adapter
(<a href="https://www.npmjs.com/package/swipi"><code>swipi</code></a>), measured
in <a href="https://github.com/midstem/swipi/blob/main/SIZE.md">SIZE.md</a>.</p>

### Installation

**npm**

```bash
$ npm install swipi-vue
```

**yarn**

```bash
$ yarn add swipi-vue
```

Vue 3.2 or newer is a peer dependency.

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Basic Usage**

Wiring is a single ref on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```vue
<script setup>
import { useSwipiCarousel } from 'swipi-vue'

const props = defineProps({ items: { type: Array, required: true } })

const [carouselRef, carousel] = useSwipiCarousel({ loop: true })
</script>

<template>
  <div class="overflow-hidden touch-pan-y" :ref="carouselRef">
    <div class="flex -ml-3 select-none">
      <div
        v-for="item in props.items"
        :key="item.id"
        class="min-w-0 shrink-0 grow-0 basis-1/2 pl-3"
      >
        {{ item.title }}
      </div>
    </div>
  </div>

  <button
    type="button"
    :disabled="!carousel.canScrollPrev"
    @click="carousel.scrollPrev()"
  >
    ‹
  </button>
  <button
    type="button"
    :disabled="!carousel.canScrollNext"
    @click="carousel.scrollNext()"
  >
    ›
  </button>
</template>
```

`carouselRef` is a function ref, so it goes on the viewport as `:ref` — Vue
calls it with the element once it is mounted. `carousel` is reactive: read
`selectedIndex`, `snapCount`, `slidesCount`, `canScrollPrev`, `canScrollNext`
and `hasOverflow` straight in the template.

Options can be a plain object or a `ref`. Pass a `ref` and the engine picks up
every change to it without remounting the carousel.

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
