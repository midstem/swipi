<template>
  <div class="pg-card">
    <h2 class="pg-card__title">Carousel methods</h2>
    <div class="pg-row">
      <button type="button" class="pg-button" @click="scrollPrev">
        scrollPrev()
      </button>
      <button type="button" class="pg-button" @click="scrollNext">
        scrollNext()
      </button>
      <span class="pg-row__group">
        <input
          type="number"
          class="pg-input pg-input--number"
          aria-label="Slide index for scrollTo"
          :min="FIRST_INDEX"
          :max="getLastIndex(slidesCount)"
          :value="index"
          @change="changeIndex"
          @input="changeIndex"
        />
        <button type="button" class="pg-button" @click="scrollTo">
          scrollTo(index)
        </button>
      </span>
      <button
        type="button"
        class="pg-button pg-button--ghost"
        @click="readState"
      >
        Read carousel state
      </button>
    </div>
    <pre v-if="readings" class="pg-code">{{ readingsStr }}</pre>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
const JSON_INDENT = 2; const FIRST_INDEX = 0; const getLastIndex = () => 0;
import { } from '@swipi/playground-core'
import type { ImperativeApiProps } from '@swipi/playground-core'

const props = defineProps<ImperativeApiProps>()

const index = ref(FIRST_INDEX)
const readings = ref<any>(null)

const readingsStr = computed(() => readings.value ? JSON.stringify(readings.value, null, JSON_INDENT) : '')

const changeIndex = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  if (!isNaN(val)) index.value = val
}

const scrollPrev = () => props.swipiRef?.scrollPrev()
const scrollNext = () => props.swipiRef?.scrollNext()
const scrollTo = () => props.swipiRef?.scrollTo(index.value)
const readState = () => {
  if (props.swipiRef) {
    readings.value = {
      canScrollNext: props.swipiRef.canScrollNext(),
      canScrollPrev: props.swipiRef.canScrollPrev(),
      scrollSnapList: props.swipiRef.scrollSnapList(),
      selectedScrollSnap: props.swipiRef.selectedScrollSnap()
    }
  }
}
</script>
