import { NO_SLIDE_WIDTH, REDUCE_SLIDE, VERTICAL_AXIS } from '../constants'
import { isFadeInAnimation } from '../helpers'
import { PlaygroundState } from '../types'

const SNIPPET_OPTIONS = [
  'axis',
  'loop',
  'dragFree',
  'autoplay',
  'autoplaySpeed',
  'animationSpeed',
  'respectReducedMotion',
  'startIndex'
] as const

type OptionValue = string | number | boolean

const DEFAULTS: Record<(typeof SNIPPET_OPTIONS)[number], OptionValue> = {
  axis: 'x',
  loop: false,
  dragFree: false,
  autoplay: false,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  respectReducedMotion: false,
  startIndex: 0
}

const toOption = (key: string, value: OptionValue): string =>
  typeof value === 'string' ? `${key}: '${value}'` : `${key}: ${String(value)}`

export const getOptions = (state: PlaygroundState): string => {
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

export const isVerticalAxis = (state: PlaygroundState): boolean =>
  state.axis === VERTICAL_AXIS

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

export type ClassNames = {
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
  const vertical = isVerticalAxis(state)
  const plain = state.slideWidth <= NO_SLIDE_WIDTH && !getBias(state)
  const fraction = plain ? BASIS_FRACTIONS[getVisibleSlides(state)] : undefined

  const classes = [
    vertical ? 'min-h-0' : 'min-w-0',
    'shrink-0',
    'grow-0',
    fraction ? `basis-${fraction}` : `basis-[${toArbitrary(getBasis(state))}]`
  ]

  if (gap) classes.push(toSpacing(vertical ? 'pt' : 'pl', gap))

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

const buildViewportClasses = (state: PlaygroundState): string =>
  isVerticalAxis(state)
    ? `overflow-hidden touch-pan-x h-[${state.stageHeight}px]`
    : 'overflow-hidden touch-pan-y'

const buildTrackClasses = (state: PlaygroundState): string => {
  const gap = state.spaceBetween
  const vertical = isVerticalAxis(state)
  const classes = ['flex']

  if (vertical) classes.push('flex-col', 'h-full')

  if (gap) classes.push(toSpacing(vertical ? '-mt' : '-ml', gap))

  classes.push('select-none')

  return classes.join(' ')
}

export const getClassNames = (
  state: PlaygroundState,
  tailwind: boolean
): ClassNames => {
  if (!tailwind) return CSS_CLASS_NAMES

  return {
    viewport: buildViewportClasses(state),
    track: buildTrackClasses(state),
    slide: buildSlideClasses(state),
    status: 'sr-only'
  }
}

export const ARROWS = {
  x: ['‹', '›'],
  y: ['↑', '↓']
}

export const KEYS = {
  x: ['ArrowLeft', 'ArrowRight'],
  y: ['ArrowUp', 'ArrowDown']
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

  const vertical = isVerticalAxis(state)

  const trackGap = gap
    ? `\n  margin-${vertical ? 'top' : 'left'}: -${gap}px;`
    : ''
  const slideGap = gap
    ? `\n  padding-${vertical ? 'top' : 'left'}: ${gap}px;`
    : ''

  const viewportSize = vertical ? `\n  height: ${state.stageHeight}px;` : ''
  const trackDirection = vertical
    ? '\n  flex-direction: column;\n  height: 100%;'
    : ''

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
  touch-action: pan-${vertical ? 'x' : 'y'};${viewportSize}
}

.carousel__track {
  display: flex;${trackDirection}${trackGap}
  user-select: none;
}

.carousel__slide {
  box-sizing: border-box;
  flex: 0 0 ${basis};
  min-${vertical ? 'height' : 'width'}: 0;${slideGap}
}${status}${fade}`
}
