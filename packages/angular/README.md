# Swipi for Angular

[![NPM version][npm-image]][npm-url] [![bundle size][size-image]][size-url]

[npm-image]: https://img.shields.io/npm/v/%40midstem%2Fswipi-angular.svg
[npm-url]: https://npmjs.org/package/@midstem/swipi-angular
[size-image]: https://deno.bundlejs.com/badge?q=@midstem/swipi-angular&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22%40angular%2Fcore%22%5D%7D%7D
[size-url]: https://bundlejs.com/?q=%40midstem%2Fswipi-angular&treeshake=%5B%7BuseSwipiCarousel%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22%40angular%2Fcore%22%5D%7D%7D

<a href='https://midstem.net'>
  <img src='https://raw.githubusercontent.com/midstem/swipi/main/assets/midstem.png' height='60'>
</a>

<p><b>Swipi</b> is a headless carousel for Angular. One function gives you the
engine — drag, momentum, snapping, looping, autoplay — and hands back a ref and
a signal of state. The markup, the CSS and the accessibility stay yours, so
nothing of ours ends up in your DOM and there is no stylesheet to import.</p>

<p>There is no directive, no module and no decorator in the package — it is
plain TypeScript, so it needs no Ivy compilation of its own and drops straight
into an AOT build.</p>

<p>It weighs around <b>5.1 KB gzipped</b> with Angular kept external — roughly
2.5× less than
<a href="https://bundlejs.com/?q=embla-carousel-angular&treeshake=%5B%7BEmblaCarouselDirective%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22%40angular%2Fcore%22%2C%22%40angular%2Fcommon%22%5D%7D%7D"><code>embla-carousel-angular</code></a>
measured the same way.</p>

### Installation

**npm**

```bash
$ npm install @midstem/swipi-angular
```

**yarn**

```bash
$ yarn add @midstem/swipi-angular
```

## 🔥 <a href='https://swipi.midstem.net'>View more examples and create a custom slider</a>

## **Basic Usage**

Wiring is a single ref on the viewport. The track is its only child and the
slides are the children of the track.

### The markup

```ts
import { Component, effect, ElementRef, input, viewChild } from '@angular/core'
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type { SwipiCarouselSignal } from '@midstem/swipi-angular'

@Component({
  selector: 'app-carousel',
  template: `
    <div class="overflow-hidden touch-pan-y" #viewport>
      <div class="flex -ml-3 select-none">
        @for (item of items(); track item.id) {
          <div class="min-w-0 shrink-0 grow-0 basis-1/2 pl-3">
            {{ item.title }}
          </div>
        }
      </div>
    </div>

    <button
      type="button"
      [disabled]="!carousel().canScrollPrev"
      (click)="carousel().scrollPrev()"
    >
      ‹
    </button>
    <button
      type="button"
      [disabled]="!carousel().canScrollNext"
      (click)="carousel().scrollNext()"
    >
      ›
    </button>
  `
})
export class CarouselComponent {
  readonly items = input<Item[]>([])

  readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport')

  readonly carousel: SwipiCarouselSignal

  constructor() {
    const [carouselRef, carousel] = useSwipiCarousel({ loop: true })

    this.carousel = carousel

    effect(() => carouselRef(this.viewport()))
  }
}
```

`carouselRef` takes the viewport — an `ElementRef`, a bare `HTMLElement`, or
nothing at all while the query is still empty — and `carousel` is a signal, so
the template reads it as `carousel()`. Call `useSwipiCarousel` from a field
initializer or the constructor: it picks up the component's `DestroyRef` there
and tears the engine down when the component goes away, so there is nothing to
clean up by hand. Handing `carouselRef` a `null` detaches it early.

### Reactive options

The options you hand to `useSwipiCarousel` are read once. Pass a signal instead
when they have to follow something else, and every value it carries reaches the
engine:

```ts
import { Component, signal } from '@angular/core'
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type { SwipiCarouselOptions } from '@midstem/swipi-angular'

@Component({
  /* … */
})
export class CarouselComponent {
  readonly options = signal<SwipiCarouselOptions>({ loop: true })

  readonly carousel: SwipiCarouselSignal

  constructor() {
    const [carouselRef, carousel] = useSwipiCarousel(this.options)

    this.carousel = carousel
    // …
  }

  freeze(): void {
    this.options.set({ loop: false })
  }
}
```

An `input()` is a signal too, so a parent component can drive the options
straight through one.

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
