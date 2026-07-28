import { MutableRefObject, PointerEvent } from 'react'

export type TouchEvents = {
  isLoop: boolean
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  transformRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number) => void
}

export type DragState = {
  pointerId: number
  startX: number
  startY: number
  lastX: number
  startTransform: number
  startedAt: number
  /** Set once the gesture is recognised as horizontal. */
  isDragging: boolean
}

export type PointerHandler = (event: PointerEvent<HTMLDivElement>) => void

export type UseEventsReturn = {
  onPointerDown: PointerHandler
  onPointerMove: PointerHandler
  onPointerUp: PointerHandler
}
