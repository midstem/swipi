import {
  reactive,
  watch,
  onBeforeUnmount,
  onUpdated,
  getCurrentInstance,
  isRef,
  Ref
} from 'vue'
import {
  createSwipi,
  resolveOptions,
  SwipiApi,
  SwipiSnapshot
} from '@midstem/swipi'
import {
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  UseSwipiCarousel
} from './types'

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

  const getFullOptions = () =>
    resolveOptions(isRef(options) ? options.value : options)

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
    () => (isRef(options) ? options.value : options),
    () => {
      engine?.update(getFullOptions())
    },
    { deep: true }
  )

  const teardown = (): void => {
    if (cleanupSubscription) {
      cleanupSubscription()
      cleanupSubscription = null
    }
    engine?.destroy()
    engine = null
    attached = null
  }

  if (getCurrentInstance()) {
    onUpdated(() => {
      engine?.sync()
    })
    onBeforeUnmount(teardown)
  }

  return [carouselRef, carousel]
}
