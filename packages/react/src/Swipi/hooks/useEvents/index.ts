import { useEffect, useRef } from 'react'
import { DragState, TouchEvents } from './types'
import { getMomentumDuration } from '../../helpers'
import { useLatestRef } from '../useLatestRef'
import { clampToSnaps, getMomentumSnap } from '../../geometry'
import { DRAG_THRESHOLD, PRIMARY_BUTTON } from '../../constants'
import { capturePointer, getReleaseVelocity, preventDragStart } from './helpers'

const PASSIVE = { passive: true }

export const useEvents = ({
  isLoop,
  moveTo,
  dragFree,
  animateTo,
  geometry,
  hasOverflow,
  viewportRef,
  animationSpeed,
  transformRef
}: TouchEvents): void => {
  const dragRef = useRef<DragState | null>(null)

  const onPointerDown = (event: PointerEvent): void => {
    if (!hasOverflow || event.button !== PRIMARY_BUTTON) return

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
      dragRef.current = null

      return false
    }

    drag.isDragging = true

    capturePointer(viewportRef.current, event.pointerId, true)

    return true
  }

  const onPointerMove = (event: PointerEvent): void => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (!drag.isDragging && !lockAxis(drag, event, deltaX, deltaY)) return

    drag.previousX = drag.lastX
    drag.previousAt = drag.lastAt
    drag.lastX = event.clientX
    drag.lastAt = performance.now()

    moveTo(clampToSnaps(drag.startTransform + deltaX, geometry, isLoop))
  }

  const onPointerUp = (event: PointerEvent): void => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null

    capturePointer(viewportRef.current, event.pointerId, false)

    if (!drag.isDragging) return

    const transform = transformRef.current
    const velocity = getReleaseVelocity(drag)

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
        animationSpeed
      })
    )
  }

  const handlersRef = useLatestRef({
    onPointerDown,
    onPointerMove,
    onPointerUp
  })

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    const handleDown = (event: PointerEvent): void =>
      handlersRef.current.onPointerDown(event)

    const handleMove = (event: PointerEvent): void =>
      handlersRef.current.onPointerMove(event)

    const handleUp = (event: PointerEvent): void =>
      handlersRef.current.onPointerUp(event)

    viewport.addEventListener('pointerdown', handleDown, PASSIVE)
    viewport.addEventListener('pointermove', handleMove, PASSIVE)
    viewport.addEventListener('pointerup', handleUp, PASSIVE)
    viewport.addEventListener('pointercancel', handleUp, PASSIVE)
    viewport.addEventListener('dragstart', preventDragStart)

    return () => {
      viewport.removeEventListener('pointerdown', handleDown)
      viewport.removeEventListener('pointermove', handleMove)
      viewport.removeEventListener('pointerup', handleUp)
      viewport.removeEventListener('pointercancel', handleUp)
      viewport.removeEventListener('dragstart', preventDragStart)
    }
  }, [viewportRef, handlersRef])
}
