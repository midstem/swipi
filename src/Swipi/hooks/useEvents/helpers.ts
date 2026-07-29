import { getDragVelocity } from '../../helpers'
import { NO_VELOCITY, VELOCITY_STALE_TIME } from '../../constants'
import { PointerEvent } from 'react'
import { DragState } from './types'

export const noop = (): void => {}

export const capturePointer = (
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

export const getReleaseVelocity = (drag: DragState): number => {
  if (performance.now() - drag.lastAt > VELOCITY_STALE_TIME) return NO_VELOCITY

  return getDragVelocity({
    distance: drag.lastX - drag.previousX,
    duration: drag.lastAt - drag.previousAt
  })
}
