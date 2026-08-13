import { reactive, watch, onBeforeUnmount, isRef, Ref } from 'vue'
import {
  createSwipi,
  DEFAULT_OPTIONS,
  SwipiApi,
  SwipiSnapshot
} from '@swipi/core'
import {
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  UseSwipiCarousel
} from './types'

const noop = (): void => {}

const getEmptySnapshot = (): SwipiSnapshot => ({
  selectedIndex: 0,
  snapCount: 0,
  slidesCount: 0,
  hasOverflow: false,
  canScrollNext: false,
  canScrollPrev: false
})

export const useSwipiCarousel = (
  options: SwipiCarouselOptions | Ref<SwipiCarouselOptions> = {}
): UseSwipiCarousel => {
  let engine: SwipiApi | null = null
  let attached: HTMLElement | null = null
  let cleanupSubscription: (() => void) | null = null

  const carousel = reactive<SwipiCarousel>({
    ...getEmptySnapshot(),
    scrollNext: () => engine?.scrollNext(),
    scrollPrev: () => engine?.scrollPrev(),
    scrollTo: (index: number) => engine?.scrollTo(index)
  })

  const getFullOptions = () => ({
    ...DEFAULT_OPTIONS,
    onChange: noop,
    onSelect: noop,
    slideWidth: undefined,
    spaceBetween: undefined,
    ...(isRef(options) ? options.value : options)
  })

  const updateSnapshot = () => {
    if (!engine) return
    const snapshot = engine.getSnapshot()
    carousel.selectedIndex = snapshot.selectedIndex
    carousel.snapCount = snapshot.snapCount
    carousel.slidesCount = snapshot.slidesCount
    carousel.hasOverflow = snapshot.hasOverflow
    carousel.canScrollNext = snapshot.canScrollNext
    carousel.canScrollPrev = snapshot.canScrollPrev
  }

  const carouselRef: SwipiCarouselRef = (node): void => {
    const next = node instanceof HTMLElement ? node : null

    if (next === attached) return

    attached = next

    if (cleanupSubscription) {
      cleanupSubscription()
      cleanupSubscription = null
    }
    engine?.destroy()

    if (next) {
      engine = createSwipi(next, getFullOptions())
      cleanupSubscription = engine.subscribe(updateSnapshot)
      updateSnapshot()
    } else {
      engine = null
      Object.assign(carousel, getEmptySnapshot())
    }
  }

  watch(
    options,
    () => {
      engine?.update(getFullOptions())
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (cleanupSubscription) {
      cleanupSubscription()
      cleanupSubscription = null
    }
    engine?.destroy()
    engine = null
    attached = null
  })

  return [carouselRef, carousel]
}
