import { NO_SLIDE_WIDTH, REDUCE_SLIDE } from '../../constants'
import { isFadeInAnimation } from '../../helpers'
import { PlaygroundState } from '../../types'

const SNIPPET_OPTIONS = [
  'loop',
  'dragFree',
  'autoplay',
  'autoplaySpeed',
  'animationSpeed',
  'startIndex'
] as const

type OptionValue = string | number | boolean

const DEFAULTS: Record<(typeof SNIPPET_OPTIONS)[number], OptionValue> = {
  loop: false,
  dragFree: false,
  autoplay: false,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  startIndex: 0
}

const toOption = (key: string, value: OptionValue): string =>
  typeof value === 'string' ? `${key}: '${value}'` : `${key}: ${String(value)}`

const getOptions = (state: PlaygroundState): string => {
  const used = SNIPPET_OPTIONS.filter(
    (key) => state[key] !== DEFAULTS[key]
  ).map((key) => toOption(key, state[key]))

  return used.length ? `{ ${used.join(', ')} }` : ''
}

const buildArrows = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showArrows) return ''

  if (minimal) {
    return `
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
`
  }

  return `
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
`
}

const buildDots = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showDots) return ''

  const marker = minimal
    ? `
          data-active={index === carousel.selectedIndex}`
    : `
          aria-label={\`Go to slide \${index + 1}\`}
          aria-current={index === carousel.selectedIndex}`

  return `
      {Array.from({ length: carousel.snapCount }, (_, index) => (
        <button
          type="button"
          className="carousel__dot"
          key={index}${marker}
          onClick={() => carousel.scrollTo(index)}
        />
      ))}
`
}

/**
 * The minimal variant is the same carousel with everything optional taken off:
 * no roles, no labels, no live region, no arrow keys. It works and it is short
 * — the accessible one is what you want to ship.
 */
const buildMinimalMarkup = (state: PlaygroundState): string => {
  const isFadeIn = isFadeInAnimation(state.slidesAnimation)

  const selected = isFadeIn
    ? `
              data-selected={index === carousel.selectedIndex}`
    : ''

  const params = isFadeIn ? '(item, index)' : '(item)'

  return `import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel(${getOptions(state)})

  return (
    <>
      <div className="carousel__viewport" ref={carouselRef}>
        <div className="carousel__track">
          {items.map(${params} => (
            <div className="carousel__slide" key={item.id}${selected}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
${buildArrows(state, true)}${buildDots(state, true)}    </>
  )
}`
}

export const buildMarkup = (
  state: PlaygroundState,
  minimal = false
): string => {
  if (minimal) return buildMinimalMarkup(state)

  const selected = isFadeInAnimation(state.slidesAnimation)
    ? `
              data-selected={index === carousel.selectedIndex}`
    : ''

  return `import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel(${getOptions(state)})

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
        aria-label="${state.ariaLabel}"
        onKeyDown={handleKeyDown}
      >
        <div className="carousel__track">
          {items.map((item, index) => (
            <div
              className="carousel__slide"
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${index + 1} of \${items.length}\`}${selected}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <span className="carousel__status" aria-live="polite" aria-atomic="true">
        Slide {carousel.selectedIndex + 1} of {carousel.snapCount}
      </span>
${buildArrows(state, false)}${buildDots(state, false)}    </>
  )
}`
}

export const buildStyles = (
  state: PlaygroundState,
  minimal = false
): string => {
  const visible = isFadeInAnimation(state.slidesAnimation)
    ? 1
    : state.slidesNumber
  const gap = state.spaceBetween
  const bias =
    state.biasRight && !isFadeInAnimation(state.slidesAnimation)
      ? ` * ${(1 - REDUCE_SLIDE / visible).toFixed(3)}`
      : ''

  /**
   * The gap is a padding inside the slide, so the basis stays a plain fraction
   * of the viewport — `calc(100% / 3)` rather than a subtraction no utility
   * class can express.
   */
  const shared = visible > 1 || bias ? `calc(100% / ${visible}${bias})` : '100%'
  const fixed = gap
    ? `calc(${state.slideWidth}px + ${gap}px)`
    : `${state.slideWidth}px`
  const basis = state.slideWidth > NO_SLIDE_WIDTH ? fixed : shared

  const fade = isFadeInAnimation(state.slidesAnimation)
    ? `

.carousel__slide {
  opacity: 0;
  transition: opacity 350ms cubic-bezier(0.25, 1, 0.5, 1);
}

.carousel__slide[data-selected='true'] {
  opacity: 1;
}`
    : ''

  const trackGap = gap ? `\n  margin-left: -${gap}px;` : ''
  const slideGap = gap ? `\n  padding-left: ${gap}px;` : ''

  /* Only the accessible markup renders a live region to hide. */
  const status = minimal
    ? ''
    : `

.carousel__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}`

  return `.carousel__viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__track {
  display: flex;
  width: 100%;${trackGap}
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 ${basis};${slideGap}
}${status}${fade}`
}
