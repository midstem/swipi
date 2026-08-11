import { MutableRefObject, RefObject } from 'react'
import { SlidesGeometry } from '@swipi/core'

export type TouchEvents = {
  isLoop: boolean
  dragFree: boolean
  geometry: SlidesGeometry
  hasOverflow: boolean
  animationSpeed: number
  transformRef: MutableRefObject<number>
  viewportRef: RefObject<HTMLElement | null>
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

export type PointerHandler = (event: PointerEvent) => void

export type PointerHandlers = {
  onPointerDown: PointerHandler
  onPointerMove: PointerHandler
  onPointerUp: PointerHandler
}
