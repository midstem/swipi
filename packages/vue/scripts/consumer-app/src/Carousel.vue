<script setup>
import { computed } from 'vue'
import { useSwipiCarousel } from 'swipi-vue'

const SLIDES = ['one', 'two', 'three', 'four']

const SLIDE_WIDTH = 300

const [carouselRef, carousel] = useSwipiCarousel({ slideWidth: SLIDE_WIDTH })

const state = computed(
  () =>
    `${carousel.selectedIndex}/${carousel.snapCount}/${carousel.slidesCount}`
)
</script>

<template>
  <section>
    <div id="viewport" :ref="carouselRef">
      <div id="track">
        <article v-for="slide in SLIDES" :key="slide">{{ slide }}</article>
      </div>
    </div>

    <button id="next" @click="carousel.scrollNext()">next</button>

    <p id="state">{{ state }}</p>
  </section>
</template>
