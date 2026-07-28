import { MutableRefObject } from 'react'

export type UseTransformProps = {
  animationSpeed: number
  render: (transform: number) => void
  onTarget: (target: number) => void
}

export type UseTransformReturn = {
  transformRef: MutableRefObject<number>
  targetRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number) => void
}
