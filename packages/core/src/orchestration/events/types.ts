import { SlidesGeometry } from '../../index'

export type DragState = {
  pointerId: number
  startX: number
  startY: number
  startTransform: number
  lastX: number
  lastAt: number
  previousX: number
  previousAt: number
  isDragging: boolean
}

export type SetupEventsProps = {
  viewport: HTMLElement
  getIsLoop: () => boolean
  getDragFree: () => boolean
  getGeometry: () => SlidesGeometry
  getHasOverflow: () => boolean
  getAnimationSpeed: () => number
  getTransform: () => number
  moveTo: (value: number) => void
  animateTo: (value: number, duration?: number) => void
}
