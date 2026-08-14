import {
  computed,
  createApp,
  defineComponent,
  h,
  nextTick,
  reactive,
  type App,
  type PropType,
  type VNode
} from 'vue'
import { afterEach } from 'vitest'
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
        h('p', { 'data-testid': 'state' }, readable(carousel))
      ])
  }
})

export type CarouselProps = {
  options?: SwipiCarouselOptions
  count?: number
  label?: string
  trackStyle?: string
}

export type MountedCarousel = {
  setProps: (next: CarouselProps) => Promise<void>
  unmount: () => void
}

const live = new Set<{ app: App; host: HTMLElement }>()

const teardown = (entry: { app: App; host: HTMLElement }): void => {
  entry.app.unmount()
  entry.host.remove()
  live.delete(entry)
}

afterEach(() => Array.from(live).forEach(teardown))

export const settle = (): Promise<void> => nextTick()

export const mountCarousel = async (
  props: CarouselProps = {}
): Promise<MountedCarousel> => {
  const host = document.createElement('div')

  document.body.appendChild(host)

  const state = reactive<CarouselProps>({ ...props })
  const app = createApp({ render: () => h(Carousel, { ...state }) })
  const entry = { app, host }

  app.mount(host)
  live.add(entry)

  await settle()

  return {
    setProps: async (next: CarouselProps): Promise<void> => {
      Object.assign(state, next)

      await settle()
    },
    unmount: () => teardown(entry)
  }
}
