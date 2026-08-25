import { NO_VELOCITY, VELOCITY_STALE_TIME } from '#src/constants'
import { getDragVelocity } from '#src/modules/drag'
import { DragState } from './types'

const dragOwners = new Map<number, Element>()

export const claimDrag = (pointerId: number, owner: Element): boolean => {
  const current = dragOwners.get(pointerId)

  if (current && current !== owner) return false

  dragOwners.set(pointerId, owner)
  return true
}

export const releaseDrag = (pointerId: number, owner: Element): void => {
  if (dragOwners.get(pointerId) === owner) dragOwners.delete(pointerId)
}

export const capturePointer = (
  element: Element,
  pointerId: number,
  isCapturing: boolean
): void => {
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
    distance: drag.lastMain - drag.previousMain,
    duration: drag.lastAt - drag.previousAt
  })
}

export const preventDragStart = (event: Event): void => event.preventDefault()
