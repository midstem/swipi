import { MutableRefObject, PointerEvent } from 'react'

export type TouchEvents = {
  isLoop: boolean
  dragFree: boolean
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  animationSpeed: number
  transformRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number, duration?: number) => void
}

export type DragState = {
  pointerId: number
  startX: number
  startY: number
  startTransform: number
  /** Two last samples of the pointer — the release speed is taken from them. */
  lastX: number
  lastAt: number
  previousX: number
  previousAt: number
  /** Set once the gesture is recognised as horizontal. */
  isDragging: boolean
}

export type PointerHandler = (event: PointerEvent<HTMLDivElement>) => void

export type UseEventsReturn = {
  onPointerDown: PointerHandler
  onPointerMove: PointerHandler
  onPointerUp: PointerHandler
}
