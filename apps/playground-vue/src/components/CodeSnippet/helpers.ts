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
      :disabled="!carousel.canScrollPrev"
      @click="carousel.scrollPrev"
    >
      ${previous}
    </button>
    <button
      type="button"${label('Next slide')}
      :disabled="!carousel.canScrollNext"
      @click="carousel.scrollNext"
    >
      ${next}
    </button>
`
}

const buildDots = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showDots) return ''

  const marker = minimal
    ? `
      :data-active="index === carousel.selectedIndex"`
    : `
      :aria-label="\`Go to slide \${index + 1}\`"
      :aria-current="index === carousel.selectedIndex"`

  return `
    <button
      v-for="index in carousel.snapCount"
      :key="index"
      type="button"
      class="carousel__dot"${marker}
      @click="carousel.scrollTo(index)"
    />
`
}

const buildSetup = (state: PlaygroundState, minimal: boolean): string => {
  const [previousKey, nextKey] = KEYS[state.axis]

  const keyboard = minimal
    ? ''
    : `

const handleKeyDown = (event) => {
  if (event.key === '${previousKey}') carousel.scrollPrev()
  if (event.key === '${nextKey}') carousel.scrollNext()
}`

  return `<script setup>
import { useSwipiCarousel } from 'swipi-vue'

defineProps({ items: { type: Array, required: true } })

const [carouselRef, carousel] = useSwipiCarousel(${getOptions(state)})${keyboard}
</${'script'}>`
}

const buildMinimalMarkup = (
  state: PlaygroundState,
  classes: ClassNames
): string => {
  const selected = isFadeInAnimation(state.slidesAnimation)
    ? `
        :data-selected="index === carousel.selectedIndex"`
    : ''

  return `<template>
  <div :ref="carouselRef" class="${classes.viewport}">
    <div class="${classes.track}">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="${classes.slide}"${selected}
      >
        {{ item.title }}
      </div>
    </div>
  </div>
${buildArrows(state, true)}${buildDots(state, true)}</template>

${buildSetup(state, true)}`
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
        :data-selected="index === carousel.selectedIndex"`
    : ''

  return `<template>
  <div
    :ref="carouselRef"
    class="${classes.viewport}"
    role="group"
    tabindex="0"
    aria-roledescription="carousel"
    aria-label="${state.ariaLabel}"
    @keydown="handleKeyDown"
  >
    <div class="${classes.track}">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="${classes.slide}"
        role="group"
        aria-roledescription="slide"
        :aria-label="\`\${index + 1} of \${items.length}\`"${selected}
      >
        {{ item.title }}
      </div>
    </div>
  </div>

  <span class="${classes.status}" aria-live="polite" aria-atomic="true">
    Slide {{ carousel.selectedIndex + 1 }} of {{ carousel.snapCount }}
  </span>
${buildArrows(state, false)}${buildDots(state, false)}</template>

${buildSetup(state, false)}`
}
