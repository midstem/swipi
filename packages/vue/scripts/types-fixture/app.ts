import { defineComponent, h, ref, shallowRef, type Ref, type VNode } from 'vue'
import { useSwipiCarousel } from '@midstem/swipi-vue'
import type {
  SlidePositions,
  SwipiAxis,
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  SwipiState
} from '@midstem/swipi-vue'

const AXIS: SwipiAxis = 'y'

export const Headless = defineComponent({
  setup() {
    const [carouselRef, carousel]: [SwipiCarouselRef, SwipiCarousel] =
      useSwipiCarousel({
        loop: true,
        dragFree: true,
        onSelect: (state) => state
      })

    return (): VNode =>
      h('div', [
        h('div', { ref: carouselRef }, [
          h('div', [h('div', 'one'), h('div', 'two')])
        ]),
        h(
          'button',
          { disabled: !carousel.canScrollNext, onClick: carousel.scrollNext },
          `${carousel.selectedIndex} / ${carousel.snapCount} / ${carousel.slidesCount}`
        )
      ])
  }
})

export const Consumer = defineComponent({
  setup() {
    const state = shallowRef<SwipiState>()
    const positions = shallowRef<SlidePositions>()

    const options: Ref<SwipiCarouselOptions> = ref({
      axis: AXIS,
      loop: true,
      autoplay: true,
      slideWidth: 320,
      spaceBetween: 10,
      startIndex: 1,
      autoplaySpeed: 4000,
      animationSpeed: 300,
      respectReducedMotion: true,
      onSelect: (next) => {
        state.value = next
      },
      onChange: (next) => {
        positions.value = next
      }
    })

    const [carouselRef, carousel] = useSwipiCarousel(options)

    const scrollToLast = (): void => carousel.scrollTo(carousel.snapCount - 1)

    return (): VNode =>
      h('div', [
        h('div', { ref: carouselRef }, [
          h('div', [h('div', 'one'), h('div', 'two')])
        ]),
        h(
          'button',
          { disabled: !carousel.canScrollPrev, onClick: carousel.scrollPrev },
          'prev'
        ),
        h(
          'button',
          { onClick: scrollToLast },
          `${state.value?.selectedIndex} / ${state.value?.snapCount} / ${positions.value?.next}`
        )
      ])
  }
})
