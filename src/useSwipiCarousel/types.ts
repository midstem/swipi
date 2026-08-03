import { SlidePositions, SwipiState } from '../Swipi/types'

export type SwipiCarouselOptions = {
  loop?: boolean
  dragFree?: boolean
  autoplay?: boolean
  slideWidth?: number
  spaceBetween?: number
  initialSlide?: number
  autoplaySpeed?: number
  animationSpeed?: number
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
