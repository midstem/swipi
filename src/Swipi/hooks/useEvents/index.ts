import { PointerEvent, useRef } from 'react'
import { DragState, TouchEvents, UseEventsReturn } from './types'
import { clampTransform, getSwipeDirection, snapToSlide } from '../../helpers'
import { DRAG_THRESHOLD, PRIMARY_BUTTON } from '../../constants'

const noop = (): void => {}

const capturePointer = (
  event: PointerEvent<HTMLDivElement>,
  isCapturing: boolean
): void => {
  const element = event.currentTarget

  try {
    if (isCapturing) {
      element.setPointerCapture?.(event.pointerId)
      return
    }

    if (element.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }
  } catch {
    /* the pointer is gone — nothing to capture or release */
  }
}

export const useEvents = ({
  isLoop,
  moveTo,
  animateTo,
  lastIndex,
  slideWidth,
  isHideArrows,
  transformRef
}: TouchEvents): UseEventsReturn => {
  const dragRef = useRef<DragState | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== PRIMARY_BUTTON) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      startTransform: transformRef.current,
      startedAt: performance.now(),
      isDragging: false
    }
  }

  const lockAxis = (
    drag: DragState,
    event: PointerEvent<HTMLDivElement>,
    deltaX: number,
    deltaY: number
  ): boolean => {
    if (
      Math.abs(deltaX) < DRAG_THRESHOLD &&
      Math.abs(deltaY) < DRAG_THRESHOLD
    ) {
      return false
    }

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      dragRef.current = null

      return false
    }

    drag.isDragging = true
    drag.startedAt = performance.now()

    capturePointer(event, true)

    return true
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (!drag.isDragging && !lockAxis(drag, event, deltaX, deltaY)) return

    drag.lastX = event.clientX

    moveTo(
      clampTransform({
        transform: drag.startTransform + deltaX,
        slideWidth,
        lastIndex,
        loop: isLoop
      })
    )
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null

    capturePointer(event, false)

    if (!drag.isDragging) return

    const transform = snapToSlide({
      transform: transformRef.current,
      slideWidth,
      swipedSide: getSwipeDirection({
        touchStartX: drag.startX,
        touchEndX: drag.lastX
      }),
      startedAt: drag.startedAt
    })

    animateTo(
      clampTransform({ transform, slideWidth, lastIndex, loop: isLoop })
    )
  }

  return {
    onPointerDown: isHideArrows ? onPointerDown : noop,
    onPointerMove: isHideArrows ? onPointerMove : noop,
    onPointerUp: isHideArrows ? onPointerUp : noop
  }
}
