import { get, writable, type Writable } from 'svelte/store'
import { useSwipiCarousel } from '@midstem/swipi-svelte'
import type {
  SlidePositions,
  SwipiAxis,
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  SwipiCarouselStore,
  SwipiState
} from '@midstem/swipi-svelte'

const AXIS: SwipiAxis = 'y'

export const headless = (viewport: HTMLElement): string => {
  const [carouselRef, carousel]: [SwipiCarouselRef, SwipiCarouselStore] =
    useSwipiCarousel({
      loop: true,
      dragFree: true,
      onSelect: (state) => state
    })

  const action = carouselRef(viewport)
  const value: SwipiCarousel = get(carousel)

  action?.destroy?.()

  return `${value.selectedIndex} / ${value.snapCount} / ${value.slidesCount}`
}

export const consumer = (viewport: HTMLElement): (() => void) => {
  let state: SwipiState | undefined
  let positions: SlidePositions | undefined

  const options: Writable<SwipiCarouselOptions> = writable({
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
      state = next
    },
    onChange: (next) => {
      positions = next
    }
  })

  const [carouselRef, carousel] = useSwipiCarousel(options)

  const action = carouselRef(viewport)

  const stop = carousel.subscribe((value) => {
    if (!value.canScrollPrev) value.scrollTo(value.snapCount - 1)
  })

  options.update((previous) => ({ ...previous, loop: false }))

  return () => {
    console.log(state?.selectedIndex, positions?.next)
    stop()
    action?.destroy?.()
  }
}
