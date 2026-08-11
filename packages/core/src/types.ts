export type UseSwipiType = {
  loop: boolean
  autoplay: boolean
  dragFree: boolean
  slideWidth?: number
  spaceBetween?: number
  startIndex: number
  autoplaySpeed: number
  animationSpeed: number
  respectReducedMotion: boolean
  onChange: (value: SlidePositions) => void
  onSelect: (state: SwipiState) => void
}

export type SwipiState = {
  selectedIndex: number
  snapCount: number
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type DragVelocityType = {
  distance: number
  duration: number
}

export type MomentumDurationType = {
  distance: number
  velocity: number
  animationSpeed: number
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

export type MomentumSnapType = {
  transform: number
  velocity: number
  startTransform: number
  geometry: SlidesGeometry
  loop: boolean
  dragFree: boolean
}

export type SnapsFromPositions = {
  positions: number[]
  sizes: number[]
  contentSize: number
  viewportWidth: number
  loop: boolean
}

export type SlidePositions = {
  prev: number
  current: number
  next: number
}

export type TimeoutRef = {
  current: ReturnType<typeof setTimeout> | undefined
}
