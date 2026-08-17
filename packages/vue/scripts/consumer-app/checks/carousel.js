import { defineComponent, h } from 'vue'
import { useSwipiCarousel } from '@midstem/swipi-vue'

export const SLIDES = ['one', 'two', 'three', 'four']

export const Carousel = defineComponent({
  setup() {
    const [carouselRef, carousel] = useSwipiCarousel({ slideWidth: 300 })

    return () =>
      h('section', [
        h('div', { id: 'viewport', ref: carouselRef }, [
          h(
            'div',
            { id: 'track' },
            SLIDES.map((slide) => h('article', { key: slide }, slide))
          )
        ]),
        h(
          'button',
          { id: 'next', onClick: () => carousel.scrollNext() },
          'next'
        ),
        h(
          'p',
          { id: 'state' },
          `${carousel.selectedIndex}/${carousel.snapCount}/${carousel.slidesCount}`
        )
      ])
  }
})
