import { DRAG_THRESHOLD, PRIMARY_BUTTON } from '#src/constants'
import { getCrossPoint, getMainPoint } from '#src/modules/axis'
import { getMomentumDuration } from '#src/modules/drag'
import { clampToSnaps, getMomentumSnap } from '#src/modules/geometry'
import { PASSIVE } from './constants'
import { DragState, SetupEventsProps } from './types'
import { capturePointer, getReleaseVelocity, preventDragStart } from './helpers'

export const setupEvents = ({
  viewport,
  getAxis,
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
    const axis = getAxis()
    const main = getMainPoint(event, axis)

    dragState = {
      pointerId: event.pointerId,
      startMain: main,
      startCross: getCrossPoint(event, axis),
      startTransform: getTransform(),
      lastMain: main,
      lastAt: startedAt,
      previousMain: main,
      previousAt: startedAt,
      isDragging: false
    }
  }

  const lockAxis = (
    drag: DragState,
    event: PointerEvent,
    deltaMain: number,
    deltaCross: number
  ): boolean => {
    if (
      Math.abs(deltaMain) < DRAG_THRESHOLD &&
      Math.abs(deltaCross) < DRAG_THRESHOLD
    ) {
      return false
    }

    if (Math.abs(deltaCross) > Math.abs(deltaMain)) {
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

    const axis = getAxis()
    const main = getMainPoint(event, axis)
    const deltaMain = main - drag.startMain
    const deltaCross = getCrossPoint(event, axis) - drag.startCross

    if (!drag.isDragging && !lockAxis(drag, event, deltaMain, deltaCross)) {
      return
    }

    drag.previousMain = drag.lastMain
    drag.previousAt = drag.lastAt
    drag.lastMain = main
    drag.lastAt = performance.now()

    const isLoop = getIsLoop()
    const geometry = getGeometry()
    moveTo(clampToSnaps(drag.startTransform + deltaMain, geometry, isLoop))
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
