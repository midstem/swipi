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
  disabled={!$carousel.canScrollPrev}
  onclick={() => $carousel.scrollPrev()}
>
  ${previous}
</button>
<button
  type="button"${label('Next slide')}
  disabled={!$carousel.canScrollNext}
  onclick={() => $carousel.scrollNext()}
>
  ${next}
</button>
`
}

const buildDots = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showDots) return ''

  const marker = minimal
    ? `
    data-active={index === $carousel.selectedIndex}`
    : `
    aria-label="Go to slide {index + 1}"
    aria-current={index === $carousel.selectedIndex}`

  return `
{#each dots as index (index)}
  <button
    type="button"
    class="carousel__dot"${marker}
    onclick={() => $carousel.scrollTo(index)}
  ></button>
{/each}
`
}

const buildScript = (state: PlaygroundState, minimal: boolean): string => {
  const [previousKey, nextKey] = KEYS[state.axis]

  const dots = state.showDots
    ? `

  const dots = $derived(
    Array.from({ length: $carousel.snapCount }, (_, index) => index)
  )`
    : ''

  const keyboard = minimal
    ? ''
    : `

  const handleKeyDown = (event) => {
    if (event.key === '${previousKey}') $carousel.scrollPrev()
    if (event.key === '${nextKey}') $carousel.scrollNext()
  }`

  return `<${'script'}>
  import { useSwipiCarousel } from '@midstem/swipi-svelte'

  let { items } = $props()

  const [carouselRef, carousel] = useSwipiCarousel(${getOptions(state)})${dots}${keyboard}
</${'script'}>`
}

const buildSlideAttributes = (
  state: PlaygroundState,
  minimal: boolean
): string => {
  const selected = isFadeInAnimation(state.slidesAnimation)
    ? `
      data-selected={index === $carousel.selectedIndex}`
    : ''

  if (minimal) return selected

  return `
      role="group"
      aria-roledescription="slide"
      aria-label="{index + 1} of {items.length}"${selected}`
}

const buildTrack = (
  state: PlaygroundState,
  classes: ClassNames,
  minimal: boolean
): string => {
  const attributes = buildSlideAttributes(state, minimal)
  const cursor = attributes ? 'item, index' : 'item'

  return `  <div class="${classes.track}">
    {#each items as ${cursor} (item.id)}
      <div class="${classes.slide}"${attributes}>
        {item.title}
      </div>
    {/each}
  </div>`
}

const buildMinimalMarkup = (
  state: PlaygroundState,
  classes: ClassNames
): string => `<div use:carouselRef class="${classes.viewport}">
${buildTrack(state, classes, true)}
</div>
${buildArrows(state, true)}${buildDots(state, true)}`

export const buildMarkup = (
  state: PlaygroundState,
  minimal = false,
  tailwind = false
): string => {
  const classes = getClassNames(state, tailwind)

  const markup = minimal
    ? buildMinimalMarkup(state, classes)
    : `<div
  use:carouselRef
  class="${classes.viewport}"
  role="group"
  tabindex="0"
  aria-roledescription="carousel"
  aria-label="${state.ariaLabel}"
  onkeydown={handleKeyDown}
>
${buildTrack(state, classes, false)}
</div>

<span class="${classes.status}" aria-live="polite" aria-atomic="true">
  Slide {$carousel.selectedIndex + 1} of {$carousel.snapCount}
</span>
${buildArrows(state, false)}${buildDots(state, false)}`

  return `${buildScript(state, minimal)}

${markup}`
}
