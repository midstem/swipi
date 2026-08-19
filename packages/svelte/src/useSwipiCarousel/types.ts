import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'
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

export type SwipiCarouselRef = Action<HTMLElement>

export type SwipiCarousel = SwipiState & {
  slidesCount: number
  hasOverflow: boolean
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
}

export type SwipiCarouselStore = Readable<SwipiCarousel>

export type SwipiCarouselSource =
  | SwipiCarouselOptions
  | Readable<SwipiCarouselOptions>

export type UseSwipiCarousel = [SwipiCarouselRef, SwipiCarouselStore]
