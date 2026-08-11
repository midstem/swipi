import {
  clampToSnaps,
  DRAG_THRESHOLD,
  getMomentumDuration,
  getMomentumSnap,
  PRIMARY_BUTTON
} from '../../index'
import { PASSIVE } from './constants'
import { DragState, SetupEventsProps } from './types'
import { capturePointer, getReleaseVelocity, preventDragStart } from './helpers'

export const setupEvents = ({
  viewport,
  getIsLoop,
  getDragFree,
  getGeometry,
  getHasOverflow,
  getAnimationSpeed,
  getTransform,
  moveTo,
  animateTo
}: SetupEventsProps): (() => void) => {
  let dragState: DragState | null = null

  const onPointerDown = (event: PointerEvent): void => {
    if (!getHasOverflow() || event.button !== PRIMARY_BUTTON) return

    const startedAt = performance.now()

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTransform: getTransform(),
      lastX: event.clientX,
      lastAt: startedAt,
      previousX: event.clientX,
      previousAt: startedAt,
      isDragging: false
    }
  }

  const lockAxis = (
    drag: DragState,
    event: PointerEvent,
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
      dragState = null
      return false
    }

    drag.isDragging = true
    capturePointer(viewport, event.pointerId, true)
    return true
  }

  const onPointerMove = (event: PointerEvent): void => {
    const drag = dragState
    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (!drag.isDragging && !lockAxis(drag, event, deltaX, deltaY)) return

    drag.previousX = drag.lastX
    drag.previousAt = drag.lastAt
    drag.lastX = event.clientX
    drag.lastAt = performance.now()

    const isLoop = getIsLoop()
    const geometry = getGeometry()
    moveTo(clampToSnaps(drag.startTransform + deltaX, geometry, isLoop))
  }

  const onPointerUp = (event: PointerEvent): void => {
    const drag = dragState
    if (!drag || drag.pointerId !== event.pointerId) return

    dragState = null
    capturePointer(viewport, event.pointerId, false)

    if (!drag.isDragging) return

    const transform = getTransform()
    const velocity = getReleaseVelocity(drag)
    const isLoop = getIsLoop()
    const geometry = getGeometry()
    const dragFree = getDragFree()

    const target = clampToSnaps(
      getMomentumSnap({
        transform,
        velocity,
        startTransform: drag.startTransform,
        geometry,
        loop: isLoop,
        dragFree
      }),
      geometry,
      isLoop
    )

    animateTo(
      target,
      getMomentumDuration({
        distance: target - transform,
        velocity,
        animationSpeed: getAnimationSpeed()
      })
    )
  }

  viewport.addEventListener(
    'pointerdown',
    onPointerDown as EventListener,
    PASSIVE
  )
  viewport.addEventListener(
    'pointermove',
    onPointerMove as EventListener,
    PASSIVE
  )
  viewport.addEventListener('pointerup', onPointerUp as EventListener, PASSIVE)
  viewport.addEventListener(
    'pointercancel',
    onPointerUp as EventListener,
    PASSIVE
  )
  viewport.addEventListener('dragstart', preventDragStart)

  return () => {
    viewport.removeEventListener('pointerdown', onPointerDown as EventListener)
    viewport.removeEventListener('pointermove', onPointerMove as EventListener)
    viewport.removeEventListener('pointerup', onPointerUp as EventListener)
    viewport.removeEventListener('pointercancel', onPointerUp as EventListener)
    viewport.removeEventListener('dragstart', preventDragStart)
  }
}

export type { DragState, SetupEventsProps }
