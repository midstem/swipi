import type { ElementRef, Signal } from '@angular/core'
import { SlidePositions, SwipiAxis, SwipiState } from '@midstem/swipi'

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

export type SwipiCarouselTarget =
  | ElementRef<HTMLElement>
  | HTMLElement
  | null
  | undefined

export type SwipiCarouselRef = (target: SwipiCarouselTarget) => void

export type SwipiCarousel = SwipiState & {
  slidesCount: number
  hasOverflow: boolean
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
}

export type SwipiCarouselSignal = Signal<SwipiCarousel>

export type SwipiCarouselSource =
  | SwipiCarouselOptions
  | Signal<SwipiCarouselOptions>

export type UseSwipiCarousel = [SwipiCarouselRef, SwipiCarouselSignal]
