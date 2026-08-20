<template>
  <div :class="STYLES.card">
    <div :class="STYLES.slider" :style="{ width: state.stageWidth + 'px' }">
      <div :class="STYLES.carousel" data-pg="carousel">
        <span
          :class="STYLES.visuallyHidden"
          aria-live="polite"
          aria-atomic="true"
        >
          Slide {{ carousel.selectedIndex + 1 }} of {{ carousel.snapCount }}
        </span>

        <div :class="STYLES.carouselRow" :data-axis="state.axis">
          <button
            v-if="showArrows"
            type="button"
            :class="STYLES.arrow"
            aria-label="Previous slide"
            :disabled="!carousel.canScrollPrev"
            @click="carousel.scrollPrev()"
          >
            {{ previousArrow }}
          </button>

          <div
            :ref="carouselRef"
            :class="STYLES.viewport"
            data-pg="viewport"
            :data-axis="state.axis"
            :style="getViewportStyle(state, isVertical)"
            role="group"
            tabindex="0"
            aria-roledescription="carousel"
            :aria-label="state.ariaLabel"
            @keydown="handleKeyDown"
          >
            <div
              :class="STYLES.track"
              :data-axis="state.axis"
              :style="getTrackStyle(visibleSlides, bias, slideWidth)"
            >
              <div
                v-for="(color, index) in slides"
                :key="color"
                :class="STYLES.slide"
                data-pg="slide"
                :data-axis="state.axis"
                role="group"
                aria-roledescription="slide"
                :aria-label="`${index + 1} of ${slides.length}`"
                :style="getSlideStyle(state, index === carousel.selectedIndex)"
              >
                <div
                  :class="STYLES.slideBox"
                  :style="{ backgroundColor: color }"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="showArrows"
            type="button"
            :class="STYLES.arrow"
            aria-label="Next slide"
            :disabled="!carousel.canScrollNext"
            @click="carousel.scrollNext()"
          >
            {{ nextArrow }}
          </button>
        </div>

        <nav v-if="state.showDots" :class="STYLES.dots">
          <button
            v-for="(_, index) in carousel.snapCount"
            :key="index"
            type="button"
            :class="STYLES.dot"
            :aria-label="`Go to slide ${index + 1}`"
            :aria-current="index === carousel.selectedIndex"
            @click="carousel.scrollTo(index)"
          >
            <span
              :class="STYLES.dotMark"
              :data-active="index === carousel.selectedIndex"
              :style="{ transition: `${state.animationSpeed}ms` }"
            />
          </button>
        </nav>
      </div>
    </div>

    <ul :class="STYLES.facts">
      <li>
        window width: <b>{{ windowWidth }}px</b>
      </li>
      <li>
        visible slides: <b>{{ visibleSlides }}</b>
      </li>
      <li>
        snap positions: <b>{{ carousel.snapCount }}</b>
      </li>
      <li>
        active breakpoint:
        <b>{{
          activeBreakpoint ? `maxWidth ${activeBreakpoint.maxWidth}` : 'none'
        }}</b>
      </li>
    </ul>

    <p v-if="!carousel.hasOverflow" :class="STYLES.warning">
      All slides fit on the screen, so arrows, dots navigation and
      <code>loop</code> are disabled — add more slides, decrease
      <code>slidesNumber</code> or narrow the stage.
    </p>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSwipiCarousel } from '@midstem/swipi-vue'
import type { SlidePositions, SwipiState } from '@midstem/swipi-vue'
import {
  VERTICAL_AXIS,
  getActiveBreakpoint,
  getArrows,
  getBias,
  getConfig,
  getSlideStyle,
  getSlideWidth,
  getSpaceBetween,
  getTrackStyle,
  getViewportStyle,
  getVisibleSlides,
  isNextKey,
  isPreviousKey
} from '@swipi/playground-core'
import type { CarouselRef } from '@swipi/playground-core'
import type { StageProps } from '../../types'

const props = defineProps<StageProps>()

const emit = defineEmits<{
  (e: 'select', state: SwipiState): void
  (e: 'change', positions: SlidePositions): void
  (e: 'ready', carousel: CarouselRef): void
}>()

const windowWidth = ref(window.innerWidth)

const onResize = (): void => {
  windowWidth.value = window.innerWidth
}

onMounted(() => window.addEventListener('resize', onResize))

onUnmounted(() => window.removeEventListener('resize', onResize))

const config = computed(() => getConfig(props.state))

const activeBreakpoint = computed(() =>
  getActiveBreakpoint(config.value, windowWidth.value)
)

const isVertical = computed(() => props.state.axis === VERTICAL_AXIS)

const visibleSlides = computed(() =>
  getVisibleSlides(props.state, config.value, windowWidth.value)
)

const bias = computed(() =>
  getBias(props.state, config.value, windowWidth.value, visibleSlides.value)
)

const slideWidth = computed(() => getSlideWidth(props.state))

const spaceBetween = computed(() =>
  getSpaceBetween(props.state, config.value, windowWidth.value)
)

const [carouselRef, carousel] = useSwipiCarousel(
  computed(() => ({
    axis: props.state.axis,
    loop: props.state.loop,
    dragFree: props.state.dragFree,
    autoplay: props.state.autoplay,
    startIndex: props.state.startIndex,
    autoplaySpeed: props.state.autoplaySpeed,
    animationSpeed: props.state.animationSpeed,
    respectReducedMotion: props.state.respectReducedMotion,
    slideWidth: slideWidth.value,
    spaceBetween: spaceBetween.value,
    onSelect: (state: SwipiState) => emit('select', state),
    onChange: (positions: SlidePositions) => emit('change', positions)
  }))
)

onMounted(() => {
  emit('ready', {
    scrollNext: carousel.scrollNext,
    scrollPrev: carousel.scrollPrev,
    scrollTo: carousel.scrollTo,
    selectedScrollSnap: () => carousel.selectedIndex,
    scrollSnapList: () =>
      Array.from({ length: carousel.snapCount }, (_, index) => index),
    canScrollNext: () => carousel.canScrollNext,
    canScrollPrev: () => carousel.canScrollPrev
  })
})

const showArrows = computed(
  () => props.state.showArrows && carousel.hasOverflow
)

const previousArrow = computed(() => getArrows(isVertical.value)[0])

const nextArrow = computed(() => getArrows(isVertical.value)[1])

const handleKeyDown = (event: KeyboardEvent): void => {
  if (isPreviousKey(event.key, isVertical.value)) carousel.scrollPrev()
  if (isNextKey(event.key, isVertical.value)) carousel.scrollNext()
}
</script>
