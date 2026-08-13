<template>
  <div class="pg-card">
    <div class="pg-stage__slider" :style="{ width: state.stageWidth + 'px' }">
      <div :class="['pg-carousel', { 'pg-carousel--vertical': isVertical }]">
        <span class="pg-visually-hidden" aria-live="polite" aria-atomic="true">
          Slide {{ (carousel?.selectedIndex ?? 0) + 1 }} of {{ carousel?.snapCount ?? 0 }}
        </span>

        <div class="pg-carousel__row">
          <button
            v-if="showArrows"
            type="button"
            class="pg-carousel__arrow"
            aria-label="Previous slide"
            :disabled="!carousel?.canScrollPrev"
            @click="carousel?.scrollPrev()"
          >
            {{ previousArrow }}
          </button>

          <div
            :ref="carouselRefSetter"
            class="pg-carousel__viewport"
            :style="getViewportStyle(state, isVertical)"
            role="group"
            tabindex="0"
            aria-roledescription="carousel"
            :aria-label="state.ariaLabel"
            @keydown="handleKeyDown"
          >
            <div
              class="pg-carousel__track"
              :style="getTrackStyle(visibleSlides, bias, slideWidth)"
            >
              <div
                v-for="(color, index) in slides"
                :key="color"
                class="pg-carousel__slide"
                role="group"
                aria-roledescription="slide"
                :aria-label="`${index + 1} of ${slides.length}`"
                :style="getSlideStyle(state, index === (carousel?.selectedIndex ?? 0))"
              >
                <div
                  class="pg-carousel__slide-box"
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
            class="pg-carousel__arrow"
            aria-label="Next slide"
            :disabled="!carousel?.canScrollNext"
            @click="carousel?.scrollNext()"
          >
            {{ nextArrow }}
          </button>
        </div>

        <nav v-if="state.showDots" class="pg-carousel__dots">
          <button
            v-for="(_, index) in (carousel?.snapCount ?? 0)"
            :key="index"
            type="button"
            class="pg-carousel__dot"
            :aria-label="`Go to slide ${index + 1}`"
            :aria-current="index === (carousel?.selectedIndex ?? 0)"
            @click="carousel?.scrollTo(index)"
          >
            <span
              class="pg-carousel__dot-mark"
              :data-active="index === (carousel?.selectedIndex ?? 0)"
              :style="{ transition: `${state.animationSpeed}ms` }"
            />
          </button>
        </nav>
      </div>
    </div>

    <ul class="pg-facts">
      <li>
        window width: <b>{{ windowWidth }}px</b>
      </li>
      <li>
        visible slides: <b>{{ visibleSlides }}</b>
      </li>
      <li>
        snap positions: <b>{{ carousel?.snapCount ?? 0 }}</b>
      </li>
      <li>
        active breakpoint: <b>{{ activeBreakpoint ? `maxWidth ${activeBreakpoint.maxWidth}` : 'none' }}</b>
      </li>
    </ul>

    <p v-if="carousel && !carousel.hasOverflow" class="pg-warning">
      All slides fit on the screen, so arrows, dots navigation and
      <code>loop</code> are disabled — add more slides, decrease
      <code>slidesNumber</code> or narrow the stage.
    </p>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, watch, onMounted, onUnmounted, ref } from 'vue'
import { useSwipiCarousel } from 'swipi'
import type { StageProps } from '@swipi/playground-core'
import { getArrows, getSlideStyle, getTrackStyle, getViewportStyle, isNextKey, isPreviousKey, getActiveBreakpoint, getBias, getSlideWidth, getSpaceBetween, getVisibleSlides } from './helpers'
import { VERTICAL_AXIS } from '@swipi/playground-core'

const props = defineProps<StageProps>()

const emit = defineEmits<{
  (e: 'select', state: any): void
  (e: 'change', state: any): void
}>()

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const onResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const activeBreakpoint = computed(() => getActiveBreakpoint(props.state.config, windowWidth.value))

const isVertical = computed(() => props.state.axis === VERTICAL_AXIS)
const bias = computed(() => getBias(props.state, activeBreakpoint.value))
const slideWidth = computed(() => getSlideWidth(props.state, activeBreakpoint.value))
const spaceBetween = computed(() => getSpaceBetween(props.state, activeBreakpoint.value))
const visibleSlides = computed(() => getVisibleSlides(props.state, activeBreakpoint.value))

const carouselRef = ref<HTMLElement | null>(null)

const { carousel } = useSwipiCarousel(computed(() => ({
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
  onSelect: (st) => emit('select', st),
  onChange: (st) => emit('change', st)
})), carouselRef)

const carouselRefSetter = (el: any) => {
  carouselRef.value = el as HTMLElement
}

watch(carousel, (c) => {
  if (props.swipiRef && c) {
    props.swipiRef.value = {
      scrollNext: c.scrollNext,
      scrollPrev: c.scrollPrev,
      scrollTo: c.scrollTo,
      selectedScrollSnap: () => c.selectedIndex,
      scrollSnapList: () => Array.from({ length: c.snapCount }, (_, index) => index),
      canScrollNext: () => c.canScrollNext,
      canScrollPrev: () => c.canScrollPrev
    }
  }
}, { immediate: true })

const showArrows = computed(() => props.state.showArrows && carousel.value?.hasOverflow)
const previousArrow = computed(() => getArrows(isVertical.value)[0])
const nextArrow = computed(() => getArrows(isVertical.value)[1])

const handleKeyDown = (event: KeyboardEvent) => {
  if (isPreviousKey(event.key, isVertical.value)) carousel.value?.scrollPrev()
  if (isNextKey(event.key, isVertical.value)) carousel.value?.scrollNext()
}
</script>
