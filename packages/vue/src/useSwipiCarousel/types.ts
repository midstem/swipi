import { SlidePositions, SwipiAxis, SwipiState } from '@swipi/core'

export type SwipiCarouselOptions = {
  axis?: SwipiAxis
  loop?: boolean
  dragFree?: boolean
  autoplay?: boolean
  slideWidth?: number
  spaceBetween?: number
  startIndex?: number
  autoplaySpeed?: number
  animationSpeed?: number
  respectReducedMotion?: boolean
  onChange?: (positions: SlidePositions) => void
  onSelect?: (state: SwipiState) => void
}

export type SwipiCarouselRef = (node: HTMLElement | null) => void

export type SwipiCarousel = SwipiState & {
  slidesCount: number
  hasOverflow: boolean
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
}

export type UseSwipiCarousel = [SwipiCarouselRef, SwipiCarousel]
