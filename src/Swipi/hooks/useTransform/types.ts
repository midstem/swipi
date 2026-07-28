import { MutableRefObject } from 'react'

export type UseTransformReturn = {
  /** Offset rendered on the track right now. */
  transform: number
  /** Offset the track is animating to. */
  target: number
  transformRef: MutableRefObject<number>
  targetRef: MutableRefObject<number>
  /** Jumps to the offset without animation (dragging, resize, initial slide). */
  moveTo: (value: number) => void
  /** Animates to the offset over `animationSpeed` ms. */
  animateTo: (value: number) => void
}
