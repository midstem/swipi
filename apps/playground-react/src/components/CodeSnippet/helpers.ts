import {
  ARROWS,
  ClassNames,
  KEYS,
  PlaygroundState,
  getClassNames,
  getOptions,
  isFadeInAnimation
} from '@swipi/playground-core'

const buildArrows = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showArrows) return ''

  const [previous, next] = ARROWS[state.axis]

  const label = (text: string): string =>
    minimal
      ? ''
      : `
        aria-label="${text}"`

  return `
      <button
        type="button"${label('Previous slide')}
        onClick={carousel.scrollPrev}
        disabled={!carousel.canScrollPrev}
      >
        ${previous}
      </button>
      <button
        type="button"${label('Next slide')}
        onClick={carousel.scrollNext}
        disabled={!carousel.canScrollNext}
      >
        ${next}
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

const MAX_LINE_LENGTH = 80

const SLIDE_INDENT = '            '

const ATTRIBUTE_INDENT = '              '

const buildSlideTag = (className: string, selected: string): string => {
  const inline = `<div className="${className}" key={item.id}>`

  if (!selected && SLIDE_INDENT.length + inline.length <= MAX_LINE_LENGTH) {
    return inline
  }

  return [
    '<div',
    `${ATTRIBUTE_INDENT}className="${className}"`,
    `${ATTRIBUTE_INDENT}key={item.id}${selected}`,
    `${SLIDE_INDENT}>`
  ].join('\n')
}

const buildMinimalMarkup = (
  state: PlaygroundState,
  classes: ClassNames
): string => {
  const isFadeIn = isFadeInAnimation(state.slidesAnimation)

  const selected = isFadeIn
    ? `
${ATTRIBUTE_INDENT}data-selected={index === carousel.selectedIndex}`
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
            ${buildSlideTag(classes.slide, selected)}
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

  const [previousKey, nextKey] = KEYS[state.axis]

  return `import { useSwipiCarousel } from 'swipi'

export const Carousel = ({ items }) => {
  const [carouselRef, carousel] = useSwipiCarousel(${getOptions(state)})

  const handleKeyDown = (event) => {
    if (event.key === '${previousKey}') carousel.scrollPrev()
    if (event.key === '${nextKey}') carousel.scrollNext()
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
