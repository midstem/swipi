import { MutableRefObject } from 'react'

export type UseTransformProps = {
  animationSpeed: number
  /** Applies a transform straight to the DOM, outside of the React render. */
  render: (transform: number) => void
  /** Called when the destination changes, so the index can be synced. */
  onTarget: (target: number) => void
}

export type UseTransformReturn = {
  transformRef: MutableRefObject<number>
  targetRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number) => void
}
