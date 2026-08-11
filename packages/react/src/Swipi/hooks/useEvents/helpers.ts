import { getDragVelocity, NO_VELOCITY, VELOCITY_STALE_TIME } from '@swipi/core'
import { DragState } from './types'

export const capturePointer = (
  element: Element | null,
  pointerId: number,
  isCapturing: boolean
): void => {
  if (!element) return

  try {
    if (isCapturing) {
      element.setPointerCapture?.(pointerId)
      return
    }

    if (element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId)
    }
  } catch {
    /* the pointer is gone — nothing to capture or release */
  }
}

export const getReleaseVelocity = (drag: DragState): number => {
  if (performance.now() - drag.lastAt > VELOCITY_STALE_TIME) return NO_VELOCITY

  return getDragVelocity({
    distance: drag.lastX - drag.previousX,
    duration: drag.lastAt - drag.previousAt
  })
}

export const preventDragStart = (event: Event): void => event.preventDefault()
