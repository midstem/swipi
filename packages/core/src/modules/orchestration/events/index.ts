import { DRAG_THRESHOLD, PRIMARY_BUTTON } from '#src/constants'
import { getCrossPoint, getMainPoint } from '#src/modules/axis'
import { getMomentumDuration } from '#src/modules/drag'
import { clampToSnaps, getMomentumSnap } from '#src/modules/geometry'
import { CAPTURE, PASSIVE } from './constants'
import { DragState, SetupEventsProps } from './types'
import {
  capturePointer,
  claimDrag,
  getReleaseVelocity,
  isInsideViewport,
  isPointerReleased,
  releaseDrag,
  wrapsViewport
} from './helpers'

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
  const ownerDocument = viewport.ownerDocument
  let dragState: DragState | null = null
  let shouldPreventClick = false

  const onPointerDown = (event: PointerEvent): void => {
    shouldPreventClick = false

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

    if (!claimDrag(event.pointerId, viewport)) {
      dragState = null
      return false
    }

    drag.isDragging = true
    drag.startTransform = getTransform()
    capturePointer(viewport, event.pointerId, true)
    return true
  }

  const finishDrag = (drag: DragState): void => {
    dragState = null
    releaseDrag(drag.pointerId, viewport)
    capturePointer(viewport, drag.pointerId, false)

    if (!drag.isDragging) return

    shouldPreventClick = true

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

  const onPointerMove = (event: PointerEvent): void => {
    const drag = dragState
    if (!drag || drag.pointerId !== event.pointerId) return

    if (isPointerReleased(event)) {
      finishDrag(drag)
      return
    }

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

    finishDrag(drag)
  }

  const onDragStart = (event: Event): void => {
    const { target } = event

    if (
      isInsideViewport(target, viewport) ||
      (dragState && wrapsViewport(target, viewport))
    ) {
      event.preventDefault()
    }
  }

  const onClick = (event: MouseEvent): void => {
    if (!shouldPreventClick) return

    shouldPreventClick = false
    event.preventDefault()
    event.stopPropagation()
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
  ownerDocument.addEventListener(
    'pointerup',
    onPointerUp as EventListener,
    PASSIVE
  )
  ownerDocument.addEventListener(
    'pointercancel',
    onPointerUp as EventListener,
    PASSIVE
  )
  ownerDocument.addEventListener('dragstart', onDragStart, CAPTURE)
  viewport.addEventListener('click', onClick as EventListener, CAPTURE)

  return () => {
    if (dragState) releaseDrag(dragState.pointerId, viewport)

    viewport.removeEventListener('pointerdown', onPointerDown as EventListener)
    viewport.removeEventListener('pointermove', onPointerMove as EventListener)
    ownerDocument.removeEventListener('pointerup', onPointerUp as EventListener)
    ownerDocument.removeEventListener(
      'pointercancel',
      onPointerUp as EventListener
    )
    ownerDocument.removeEventListener('dragstart', onDragStart, CAPTURE)
    viewport.removeEventListener('click', onClick as EventListener, CAPTURE)
  }
}

export type { DragState, SetupEventsProps }
