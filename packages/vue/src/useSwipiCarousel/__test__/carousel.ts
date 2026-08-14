import {
  computed,
  defineComponent,
  h,
  nextTick,
  type PropType,
  type VNode
} from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { useSwipiCarousel } from '..'
import { SwipiCarousel, SwipiCarouselOptions } from '../types'
import { SLIDE_WIDTH, SLIDES_COUNT } from './dom'

const readable = (carousel: SwipiCarousel): string =>
  [
    carousel.selectedIndex,
    carousel.snapCount,
    carousel.slidesCount,
    carousel.canScrollPrev,
    carousel.canScrollNext,
    carousel.hasOverflow
  ].join('/')

export const Carousel = defineComponent({
  props: {
    options: {
      type: Object as PropType<SwipiCarouselOptions>,
      default: (): SwipiCarouselOptions => ({})
    },
    count: { type: Number, default: SLIDES_COUNT },
    label: { type: String, default: '' },
    trackStyle: { type: String, default: '' }
  },
  setup(props) {
    const [carouselRef, carousel] = useSwipiCarousel(
      computed(() => ({ slideWidth: SLIDE_WIDTH, ...props.options }))
    )

    return (): VNode =>
      h('section', [
        h('div', { 'data-testid': 'viewport', ref: carouselRef }, [
          h(
            'div',
            { 'data-testid': 'track', style: props.trackStyle },
            Array.from({ length: props.count }, (_, index) =>
              h('article', { key: index }, String(index + 1))
            )
          )
        ]),
        h('p', { 'data-testid': 'label' }, props.label),
        h('p', { 'data-testid': 'state' }, readable(carousel)),
        h('button', { onClick: () => carousel.scrollNext() }, 'forward'),
        h('button', { onClick: () => carousel.scrollPrev() }, 'back')
      ])
  }
})

export type CarouselProps = {
  options?: SwipiCarouselOptions
  count?: number
  label?: string
  trackStyle?: string
}

export const settle = (): Promise<void> => nextTick()

export const mountCarousel = async (
  props: CarouselProps = {}
): Promise<VueWrapper<InstanceType<typeof Carousel>>> => {
  const wrapper = mount(Carousel, { props, attachTo: document.body })

  await settle()

  return wrapper
}
