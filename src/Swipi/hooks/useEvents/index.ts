import { PointerEvent, useRef } from 'react'
import { DragState, TouchEvents, UseEventsReturn } from './types'
import {
  clampTransform,
  getDragVelocity,
  getMomentumDuration,
  getMomentumTarget
} from '../../helpers'
import {
  DRAG_THRESHOLD,
  NO_VELOCITY,
  PRIMARY_BUTTON,
  VELOCITY_STALE_TIME
} from '../../constants'

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

/**
 * Speed of the last pointer sample. A pointer that stopped before the release
 * carries nothing, so holding the track still simply drops it where it is.
 */
const getReleaseVelocity = (drag: DragState): number => {
  if (performance.now() - drag.lastAt > VELOCITY_STALE_TIME) return NO_VELOCITY

  return getDragVelocity({
    distance: drag.lastX - drag.previousX,
    duration: drag.lastAt - drag.previousAt
  })
}

export const useEvents = ({
  isLoop,
  moveTo,
  dragFree,
  animateTo,
  lastIndex,
  slideWidth,
  isHideArrows,
  animationSpeed,
  transformRef
}: TouchEvents): UseEventsReturn => {
  const dragRef = useRef<DragState | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== PRIMARY_BUTTON) return

    const startedAt = performance.now()

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTransform: transformRef.current,
      lastX: event.clientX,
      lastAt: startedAt,
      previousX: event.clientX,
      previousAt: startedAt,
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

    capturePointer(event, true)

    return true
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (!drag.isDragging && !lockAxis(drag, event, deltaX, deltaY)) return

    drag.previousX = drag.lastX
    drag.previousAt = drag.lastAt
    drag.lastX = event.clientX
    drag.lastAt = performance.now()

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

    const transform = transformRef.current
    const velocity = getReleaseVelocity(drag)

    const target = clampTransform({
      transform: getMomentumTarget({
        transform,
        velocity,
        slideWidth,
        startTransform: drag.startTransform,
        dragFree
      }),
      slideWidth,
      lastIndex,
      loop: isLoop
    })

    animateTo(
      target,
      getMomentumDuration({
        distance: target - transform,
        velocity,
        animationSpeed
      })
    )
  }

  return {
    onPointerDown: isHideArrows ? onPointerDown : noop,
    onPointerMove: isHideArrows ? onPointerMove : noop,
    onPointerUp: isHideArrows ? onPointerUp : noop
  }
}
