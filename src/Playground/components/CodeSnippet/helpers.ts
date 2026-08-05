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

const ONE_SLIDE = 1

const BIAS_PRECISION = 3

const FADE_DURATION = 350

const EASING = 'cubic-bezier(0.25, 1, 0.5, 1)'

const BASIS_FRACTIONS: Record<number, string> = {
  1: 'full',
  2: '1/2',
  3: '1/3',
  4: '1/4',
  5: '1/5',
  6: '1/6',
  12: '1/12'
}

const toArbitrary = (value: string): string => value.replace(/\s/g, '_')

const SPACING_SCALE: Record<number, string> = {
  0: '0',
  1: 'px',
  2: '0.5',
  4: '1',
  6: '1.5',
  8: '2',
  10: '2.5',
  12: '3',
  14: '3.5',
  16: '4',
  20: '5',
  24: '6',
  28: '7',
  32: '8',
  36: '9',
  40: '10',
  44: '11',
  48: '12',
  56: '14',
  64: '16',
  80: '20',
  96: '24'
}

const toSpacing = (prefix: string, px: number): string => {
  const step = SPACING_SCALE[px]

  return step ? `${prefix}-${step}` : `${prefix}-[${px}px]`
}

const getVisibleSlides = (state: PlaygroundState): number =>
  isFadeInAnimation(state.slidesAnimation) ? ONE_SLIDE : state.slidesNumber

const getBias = (state: PlaygroundState): string => {
  if (!state.biasRight || isFadeInAnimation(state.slidesAnimation)) return ''

  const visible = getVisibleSlides(state)

  return ` * ${(1 - REDUCE_SLIDE / visible).toFixed(BIAS_PRECISION)}`
}

export const getBasis = (state: PlaygroundState): string => {
  const gap = state.spaceBetween

  if (state.slideWidth > NO_SLIDE_WIDTH) {
    return gap
      ? `calc(${state.slideWidth}px + ${gap}px)`
      : `${state.slideWidth}px`
  }

  const visible = getVisibleSlides(state)
  const bias = getBias(state)

  return visible > ONE_SLIDE || bias ? `calc(100% / ${visible}${bias})` : '100%'
}

type ClassNames = {
  viewport: string
  track: string
  slide: string
  status: string
}

const CSS_CLASS_NAMES: ClassNames = {
  viewport: 'carousel__viewport',
  track: 'carousel__track',
  slide: 'carousel__slide',
  status: 'carousel__status'
}

const buildSlideClasses = (state: PlaygroundState): string => {
  const gap = state.spaceBetween
  const plain = state.slideWidth <= NO_SLIDE_WIDTH && !getBias(state)
  const fraction = plain ? BASIS_FRACTIONS[getVisibleSlides(state)] : undefined

  const classes = [
    'min-w-0',
    'shrink-0',
    'grow-0',
    fraction ? `basis-${fraction}` : `basis-[${toArbitrary(getBasis(state))}]`
  ]

  if (gap) classes.push(toSpacing('pl', gap))

  if (isFadeInAnimation(state.slidesAnimation)) {
    classes.push(
      'opacity-0',
      'transition-opacity',
      `duration-[${FADE_DURATION}ms]`,
      `ease-[${toArbitrary(EASING)}]`,
      'data-[selected=true]:opacity-100'
    )
  }

  return classes.join(' ')
}

const getClassNames = (
  state: PlaygroundState,
  tailwind: boolean
): ClassNames => {
  if (!tailwind) return CSS_CLASS_NAMES

  const gap = state.spaceBetween

  return {
    viewport: 'overflow-hidden touch-pan-y',
    track: gap
      ? `flex ${toSpacing('-ml', gap)} select-none`
      : 'flex select-none',
    slide: buildSlideClasses(state),
    status: 'sr-only'
  }
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

const buildMinimalMarkup = (
  state: PlaygroundState,
  classes: ClassNames
): string => {
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
      <div className="${classes.viewport}" ref={carouselRef}>
        <div className="${classes.track}">
          {items.map(${params} => (
            <div className="${classes.slide}" key={item.id}${selected}>
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
  minimal = false,
  tailwind = false
): string => {
  const classes = getClassNames(state, tailwind)

  if (minimal) return buildMinimalMarkup(state, classes)

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
        className="${classes.viewport}"
        ref={carouselRef}
        role="group"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="${state.ariaLabel}"
        onKeyDown={handleKeyDown}
      >
        <div className="${classes.track}">
          {items.map((item, index) => (
            <div
              className="${classes.slide}"
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

      <span className="${classes.status}" aria-live="polite" aria-atomic="true">
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
  const gap = state.spaceBetween
  const basis = getBasis(state)

  const fade = isFadeInAnimation(state.slidesAnimation)
    ? `

.carousel__slide {
  opacity: 0;
  transition: opacity ${FADE_DURATION}ms ${EASING};
}

.carousel__slide[data-selected='true'] {
  opacity: 1;
}`
    : ''

  const trackGap = gap ? `\n  margin-left: -${gap}px;` : ''
  const slideGap = gap ? `\n  padding-left: ${gap}px;` : ''

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
  display: flex;${trackGap}
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 ${basis};
  min-width: 0;${slideGap}
}${status}${fade}`
}
