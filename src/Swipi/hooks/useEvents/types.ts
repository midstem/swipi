import { MutableRefObject, PointerEvent } from 'react'
import { SlidesGeometry } from '../../types'

export type TouchEvents = {
  isLoop: boolean
  dragFree: boolean
  geometry: SlidesGeometry
  hasOverflow: boolean
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
  lastX: number
  lastAt: number
  previousX: number
  previousAt: number
  isDragging: boolean
}

export type PointerHandler = (event: PointerEvent<HTMLDivElement>) => void

export type UseEventsReturn = {
  onPointerDown: PointerHandler
  onPointerMove: PointerHandler
  onPointerUp: PointerHandler
}
