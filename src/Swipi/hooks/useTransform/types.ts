import { MutableRefObject } from 'react'

export type UseTransformReturn = {
  transform: number
  target: number
  transformRef: MutableRefObject<number>
  targetRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number) => void
}
