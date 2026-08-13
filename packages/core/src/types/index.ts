export type SwipiAxis = 'x' | 'y'

export type SwipiOptions = {
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
  onChange?: (value: SlidePositions) => void
  onSelect?: (state: SwipiState) => void
}

export type ResolvedSwipiOptions = SwipiOptions &
  Required<
    Pick<
      SwipiOptions,
      | 'axis'
      | 'loop'
      | 'dragFree'
      | 'autoplay'
      | 'startIndex'
      | 'autoplaySpeed'
      | 'animationSpeed'
      | 'respectReducedMotion'
    >
  >

export type SwipiSnapshot = {
  selectedIndex: number
  snapCount: number
  slidesCount: number
  hasOverflow: boolean
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type SwipiApi = {
  scrollNext(): void
  scrollPrev(): void
  scrollTo(index: number): void

  getSnapshot(): SwipiSnapshot
  subscribe(listener: () => void): () => void

  update(options: Partial<SwipiOptions>): void
  measure(): void
  sync(): void
  destroy(): void
}

export type SwipiState = {
  selectedIndex: number
  snapCount: number
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type SlideOffsets = WeakMap<HTMLElement, number>

export type SlidesMeasurement = {
  positions: number[]
  sizes: number[]
  contentSize: number
  loopSize: number
}

export type SlidesGeometry = SlidesMeasurement & {
  snaps: number[]
}

export type SlidePositions = {
  prev: number
  current: number
  next: number
}
