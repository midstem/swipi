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

export const buildMarkup = (state: PlaygroundState): string => {
  const selected = isFadeInAnimation(state.slidesAnimation)
    ? `
              data-selected={index === carousel.selectedIndex}`
    : ''

  const arrows = state.showArrows
    ? `
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
    : ''

  const dots = state.showDots
    ? `
      {Array.from({ length: carousel.snapCount }, (_, index) => (
        <button
          type="button"
          className="carousel__dot"
          key={index}
          aria-label={\`Go to slide \${index + 1}\`}
          aria-current={index === carousel.selectedIndex}
          onClick={() => carousel.scrollTo(index)}
        />
      ))}
`
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
${arrows}${dots}    </>
  )
}`
}

export const buildStyles = (state: PlaygroundState): string => {
  const visible = isFadeInAnimation(state.slidesAnimation)
    ? 1
    : state.slidesNumber
  const gap = state.spaceBetween
  const bias =
    state.biasRight && !isFadeInAnimation(state.slidesAnimation)
      ? ` * ${(1 - REDUCE_SLIDE / visible).toFixed(3)}`
      : ''

  const gaps = gap > 0 && visible > 1 ? ` - ${visible - 1} * ${gap}px` : ''
  const shared =
    visible > 1 || bias ? `calc((100%${gaps}) / ${visible}${bias})` : '100%'
  const basis =
    state.slideWidth > NO_SLIDE_WIDTH ? `${state.slideWidth}px` : shared

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

  const spacing = gap
    ? `
  margin-right: ${gap}px;
}

.carousel__slide:last-child {
  margin-right: 0;`
    : '\n}'

  return `.carousel__viewport {
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__track {
  display: flex;
  width: 100%;
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 ${basis};${spacing}
}

.carousel__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}${fade}`
}
