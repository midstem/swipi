# Migrating from Swipi 2 to Swipi 3

Swipi 3 is a different library from Swipi 2 wearing the same name. Version 2
shipped a `<Swipi>` component with ~30 props, its own markup, its own dots and
arrows, and a stylesheet. Version 3 ships one hook and nothing else:

```tsx
const [carouselRef, carousel] = useSwipiCarousel(options)
```

`carouselRef` goes on your viewport, the track is its only child, the slides
are the children of the track. Everything you can see on the screen — the
elements, the classes, the widths, the gaps, the dots, the arrows, the ARIA
attributes — is now yours.

That is a rewrite of the view layer, not a version bump. If you are happy with
the component, staying on `swipi@2` is a perfectly good answer; nothing in the
2.x line was removed from npm.

The rest of this document maps every removed prop to what replaces it. The
[README](README.md) has the complete markup and CSS to start from, and
`npm start` in the repository prints both for whatever settings you pick.

## What is gone

| Removed                                   | Replacement                             |
| ----------------------------------------- | --------------------------------------- |
| `<Swipi>` (the default export)            | `useSwipiCarousel` (a named export)     |
| `swipi/style.css`, `swipi/dist/style.css` | your own CSS — delete the import        |
| `SwipiProps`, `SwipiRef` (types)          | `SwipiCarouselOptions`, `SwipiCarousel` |
| `ref` + the imperative methods            | the `carousel` object the hook returns  |

`SwipiState` still exists and still describes what `onSelect` receives.

## Behaviour props — same names, now hook options

These moved as they are, from JSX props to the object you pass to the hook:

`loop`, `dragFree`, `autoplay`, `autoplaySpeed`, `animationSpeed`, `onSelect`,
`onChange`.

```tsx
// 2.x
<Swipi loop dragFree autoplaySpeed={2000} onSelect={setState}>

// 3.0
useSwipiCarousel({ loop: true, dragFree: true, autoplaySpeed: 2000, onSelect: setState })
```

## `initialSlide` → `startIndex`, and everything counts from zero

Version 2 mixed two ways of counting: `initialSlide` and `onChange` counted
slides from one, while `scrollTo` and `selectedScrollSnap` counted indexes from
zero. Version 3 has one base — zero, everywhere.

`initialSlide` is renamed to `startIndex` on purpose. The values it takes have
shifted by one, and a silent shift is the worst kind: the types would not have
moved, so the carousel would simply have opened on the wrong slide. Under the
new name TypeScript stops your old call instead.

```tsx
// 2.x — the third slide
<Swipi initialSlide={3}>

// 3.0 — the same slide
useSwipiCarousel({ startIndex: 2 })
```

`onChange` moved with it. `{ prev, current, next }` are now indexes, matching
`carousel.selectedIndex` and the argument `carousel.scrollTo` expects. On the
first slide of a four-snap carousel it used to report
`{ prev: 1, current: 1, next: 2 }` and now reports
`{ prev: 0, current: 0, next: 1 }`; in `loop` mode, `{ prev: 4, current: 1,
next: 2 }` became `{ prev: 3, current: 0, next: 1 }`.

If you were printing those numbers, add the `+ 1` back where you print them:

```tsx
onChange: ({ current }) => setLabel(`Slide ${current + 1} of ${snapCount}`)
```

## Imperative API → the `carousel` object

There is no `ref` any more. Everything the ref used to answer is a plain field
on the object the hook hands back, and it re-renders your component when it
changes instead of having to be read.

| 2.x (`ref.current`)    | 3.0                                                       |
| ---------------------- | --------------------------------------------------------- |
| `scrollNext()`         | `carousel.scrollNext()`                                   |
| `scrollPrev()`         | `carousel.scrollPrev()`                                   |
| `scrollTo(index)`      | `carousel.scrollTo(index)`                                |
| `selectedScrollSnap()` | `carousel.selectedIndex`                                  |
| `scrollSnapList()`     | `Array.from({ length: carousel.snapCount }, (_, i) => i)` |
| `canScrollNext()`      | `carousel.canScrollNext`                                  |
| `canScrollPrev()`      | `carousel.canScrollPrev`                                  |

## Layout props → CSS

Slide widths are measured from the DOM now, so anything that used to compute
them is a rule in your stylesheet. `N` below is the number of slides you want
in view, `G` the gap in pixels.

| 2.x prop                 | CSS                                                                 |
| ------------------------ | ------------------------------------------------------------------- |
| `slidesNumber={N}`       | `flex: 0 0 calc(100% / N)` on the slide                             |
| `spaceBetweenSlides={G}` | `padding-left: Gpx` on the slide + `margin-left: -Gpx` on the track |
| `biasRight`              | multiply the basis by `1 - 0.35 / N`, e.g. `calc(100% / 2 * 0.825)` |
| `config` (breakpoints)   | `@media` queries around the same rules                              |

```css
.carousel__track {
  margin-left: -12px;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 calc(100% / 3);
  min-width: 0;
  padding-left: 12px;
}
```

The gap lives inside the slide, and the track pulls itself back by one gap so
the padding never shows in front of the first slide. Leave the track's width
alone: automatically it fills the viewport, and the negative margin widens it by
that same gap, which is what lets the last slide reach the right edge.

Every slide box is then exactly `1 / N` of the viewport — no subtraction to
write, and utility classes work as they are: `flex -ml-3` on the track and
`min-w-0 shrink-0 grow-0 basis-1/3 pl-3` on the slide. Those are the classes
shadcn's carousel puts on its own container and items, so its components work
over this hook unchanged. `loop` stays uniform because all the boxes measure the
same and sit flush against each other.

Two things follow from the gap being part of the slide. Give the slide's
background to an element inside it, or the gap gets filled — `background-clip:
content-box` also works. And do not reach for a trailing `padding-right`
instead: it makes the last slide differ from the rest and the carousel drifts by
that much every lap.

If you would rather keep the numbers in JavaScript, the hook accepts
`slideWidth` and `spaceBetween` and writes them onto the track as the
`--swipi-slide-width` and `--swipi-slide-gap` custom properties for your CSS to
pick up — the measuring still happens in the DOM.

```css
.carousel__track {
  margin-left: calc(-1 * var(--swipi-slide-gap, 0px));
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 calc(var(--swipi-slide-width) + var(--swipi-slide-gap, 0px));
  min-width: 0;
  padding-left: var(--swipi-slide-gap, 0px);
}
```

## Animation props → CSS

`slidesAnimation="fade-in"` becomes one slide in view plus an opacity
transition. Mark the selected slide yourself:

```tsx
<div className="carousel__slide" data-selected={index === carousel.selectedIndex}>
```

```css
.carousel__slide {
  flex: 0 0 100%;
  opacity: 0;
  transition: opacity 350ms cubic-bezier(0.25, 1, 0.5, 1);
}

.carousel__slide[data-selected='true'] {
  opacity: 1;
}
```

`animationSpeed` stays an option — it is the duration of the carousel's own
movement, not of your CSS.

## Dots and arrows → your buttons

`showDots`, `dotColor`, `activeDotColor`, `customDot`, `customActiveDot`,
`sizeForDefaultDot`, `sizeForDefaultActiveDot` and `dotsAnimation` are all
replaced by the buttons you write:

```tsx
<nav>
  {Array.from({ length: carousel.snapCount }, (_, index) => (
    <button
      type="button"
      key={index}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={index === carousel.selectedIndex}
      onClick={() => carousel.scrollTo(index)}
    />
  ))}
</nav>
```

`showArrows`, `prevButton` and `nextButton` likewise:

```tsx
<button
  type="button"
  aria-label="Previous slide"
  onClick={carousel.scrollPrev}
  disabled={!carousel.canScrollPrev}
>
  ‹
</button>
```

The `dotsAnimation="sliding"` effect has no replacement in the package — it was
a CSS animation over the dots, and the dots are your elements now.

## Accessibility props → your attributes

`ariaLabel` is the `aria-label` you write on the viewport. The roles, the slide
labels, the live region and the arrow-key handler that the component used to
render are in the README markup, as ordinary JSX you can reword and translate.

```tsx
const handleKeyDown = (event) => {
  if (event.key === 'ArrowLeft') carousel.scrollPrev()
  if (event.key === 'ArrowRight') carousel.scrollNext()
}
```

One thing the component did for free is now an option: it disabled animations
under `prefers-reduced-motion`. The hook does it only with
`respectReducedMotion: true`, so a user with the setting on still gets the
animation unless you ask for it. Turn it on to keep the old behaviour, and do
the same for your transitions.

```css
@media (prefers-reduced-motion: reduce) {
  .carousel__slide {
    transition: none;
  }
}
```

## Things that behave the same

- The slide to open on still applies on mount only — it is `startIndex` now,
  and it counts from zero.
- `onChange` still fires with `{ prev, current, next }` — as indexes now.
- `loop` still moves the real slides instead of rendering clones, so every
  slide stays a single DOM node.
- The number of snaps still follows the measurements: the carousel stops once
  the remaining slides fit the viewport, so five half-width slides give four
  snaps rather than five.

## Checklist

1. `npm install swipi@3`
2. Delete every `import 'swipi/style.css'`.
3. Replace `<Swipi …>` with the markup from the README and move the behaviour
   props into `useSwipiCarousel({ … })`.
4. Move `slidesNumber`, `spaceBetweenSlides`, `biasRight` and `config` into
   your CSS.
5. Replace `ref` reads with fields of `carousel`.
6. Rename `initialSlide` to `startIndex` and subtract one from its value; do
   the same wherever you read `onChange`.
7. Check the gap is a `margin`, not a `padding`, if you use `loop`.
