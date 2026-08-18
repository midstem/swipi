import { ElementRef, signal, type WritableSignal } from '@angular/core'
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type {
  SlidePositions,
  SwipiAxis,
  SwipiCarousel,
  SwipiCarouselOptions,
  SwipiCarouselRef,
  SwipiCarouselSignal,
  SwipiCarouselSource,
  SwipiCarouselTarget,
  SwipiState
} from '@midstem/swipi-angular'

const AXIS: SwipiAxis = 'y'

export const headless = (viewport: HTMLElement): string => {
  const [carouselRef, carousel]: [SwipiCarouselRef, SwipiCarouselSignal] =
    useSwipiCarousel({
      loop: true,
      dragFree: true,
      onSelect: (state) => state
    })

  carouselRef(viewport)

  const value: SwipiCarousel = carousel()

  carouselRef(null)

  return `${value.selectedIndex} / ${value.snapCount} / ${value.slidesCount}`
}

export const consumer = (viewport: HTMLElement): (() => void) => {
  let state: SwipiState | undefined
  let positions: SlidePositions | undefined

  const options: WritableSignal<SwipiCarouselOptions> = signal({
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

  const source: SwipiCarouselSource = options

  const [carouselRef, carousel] = useSwipiCarousel(source)

  const target: SwipiCarouselTarget = new ElementRef(viewport)

  carouselRef(target)

  const value = carousel()

  if (!value.canScrollPrev) value.scrollTo(value.snapCount - 1)

  options.update((previous) => ({ ...previous, loop: false }))

  return () => {
    console.log(state?.selectedIndex, positions?.next)
    carouselRef(undefined)
  }
}
