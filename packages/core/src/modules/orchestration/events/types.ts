import { SlidesGeometry, SwipiAxis } from '#src/types'

export type DragState = {
  pointerId: number
  startMain: number
  startCross: number
  startTransform: number
  lastMain: number
  lastAt: number
  previousMain: number
  previousAt: number
  isDragging: boolean
}

export type SetupEventsProps = {
  viewport: HTMLElement
  getAxis: () => SwipiAxis
  getIsLoop: () => boolean
  getDragFree: () => boolean
  getGeometry: () => SlidesGeometry
  getHasOverflow: () => boolean
  getAnimationSpeed: () => number
  getTransform: () => number
  moveTo: (value: number) => void
  animateTo: (value: number, duration?: number) => void
}
