import { REDUCE_SLIDE } from '../../../Swipi/constants'
import { isFadeInAnimation } from '../../../Swipi/helpers'
import { PlaygroundState } from '../../types'

const HOOK_OPTIONS = [
  'loop',
  'dragFree',
  'autoplay',
  'autoplaySpeed',
  'animationSpeed',
  'initialSlide',
  'ariaLabel'
] as const

type OptionValue = string | number | boolean

const DEFAULTS: Record<(typeof HOOK_OPTIONS)[number], OptionValue> = {
  loop: false,
  dragFree: false,
  autoplay: false,
  autoplaySpeed: 4000,
  animationSpeed: 300,
  initialSlide: 0,
  ariaLabel: 'Slides'
}

const toOption = (key: string, value: OptionValue): string =>
  typeof value === 'string' ? `${key}: '${value}'` : `${key}: ${String(value)}`

const getOptions = (state: PlaygroundState): string => {
  const used = HOOK_OPTIONS.filter((key) => state[key] !== DEFAULTS[key]).map(
    (key) => toOption(key, state[key])
  )

  return used.length ? `{ ${used.join(', ')} }` : ''
}

export const buildMarkup = (state: PlaygroundState): string => {
  const arrows = state.showArrows
    ? `
      <button onClick={scrollPrev} disabled={!state.canScrollPrev}>‹</button>
      <button onClick={scrollNext} disabled={!state.canScrollNext}>›</button>
`
    : ''

  const dots = state.showDots
    ? `
      {Array.from({ length: state.snapCount }, (_, index) => (
        <button className="carousel__dot" key={index} {...getDotProps(index)} />
      ))}
`
    : ''

  return `import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const {
    state,
    scrollNext,
    scrollPrev,
    getViewportProps,
    getTrackProps,
    getSlideProps,
    getDotProps,
    getLiveRegionProps
  } = useSwipiCarousel(${getOptions(state)})

  return (
    <>
      <div className="carousel__viewport" {...getViewportProps()}>
        <div className="carousel__track" {...getTrackProps()}>
          {items.map((item, index) => (
            <div className="carousel__slide" key={item.id} {...getSlideProps(index)}>
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <span className="carousel__status" {...getLiveRegionProps()}>
        {state.announcement}
      </span>
${arrows}${dots}    </>
  )
}`
}

export const buildStyles = (state: PlaygroundState): string => {
  const visible = isFadeInAnimation(state.slidesAnimation)
    ? 1
    : state.slidesNumber
  const gap = state.spaceBetweenSlides
  const bias =
    state.biasRight && !isFadeInAnimation(state.slidesAnimation)
      ? ` * ${(1 - REDUCE_SLIDE / visible).toFixed(3)}`
      : ''

  const gaps = gap > 0 && visible > 1 ? ` - ${visible - 1} * ${gap}px` : ''
  const basis =
    visible > 1 || bias ? `calc((100%${gaps}) / ${visible}${bias})` : '100%'

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
