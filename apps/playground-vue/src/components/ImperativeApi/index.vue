<template>
  <div :class="STYLES.card">
    <h2 :class="STYLES.cardTitle">Carousel methods</h2>
    <div :class="STYLES.row">
      <button type="button" :class="STYLES.button" @click="scrollPrev">
        scrollPrev()
      </button>
      <button type="button" :class="STYLES.button" @click="scrollNext">
        scrollNext()
      </button>
      <span :class="STYLES.rowGroup">
        <input
          type="number"
          :class="STYLES.numberInput"
          aria-label="Slide index for scrollTo"
          :min="FIRST_INDEX"
          :max="getLastIndex(slidesCount)"
          :value="index"
          @change="changeIndex"
          @input="changeIndex"
        />
        <button type="button" :class="STYLES.button" @click="scrollTo">
          scrollTo(index)
        </button>
      </span>
      <button type="button" :class="STYLES.ghostButton" @click="readState">
        Read carousel state
      </button>
    </div>
    <pre v-if="readings" :class="STYLES.code">{{ readingsStr }}</pre>
  </div>
</template>

<script setup lang="ts">
import { STYLES } from '@swipi/playground-core'
import { computed, ref } from 'vue'
import {
  FIRST_INDEX,
  JSON_INDENT,
  clampIndex,
  getLastIndex
} from '@swipi/playground-core'
import type { ImperativeReadings } from '@swipi/playground-core'
import type { ImperativeApiProps } from '../../types'

const props = defineProps<ImperativeApiProps>()

const index = ref(FIRST_INDEX)
const readings = ref<ImperativeReadings>()

const readingsStr = computed(() =>
  readings.value ? JSON.stringify(readings.value, null, JSON_INDENT) : ''
)

const changeIndex = (event: Event): void => {
  const { value } = event.target as HTMLInputElement

  index.value = clampIndex(parseInt(value, 10), props.slidesCount)
}

const scrollPrev = (): void => props.carousel?.scrollPrev()

const scrollNext = (): void => props.carousel?.scrollNext()

const scrollTo = (): void => props.carousel?.scrollTo(index.value)

const readState = (): void => {
  const { carousel } = props

  if (!carousel) return

  readings.value = {
    canScrollNext: carousel.canScrollNext(),
    canScrollPrev: carousel.canScrollPrev(),
    scrollSnapList: carousel.scrollSnapList(),
    selectedScrollSnap: carousel.selectedScrollSnap()
  }
}
</script>
