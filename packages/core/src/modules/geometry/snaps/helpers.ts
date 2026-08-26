import { INITIAL_TRANSFORM } from '#src/constants'
import { SlidesGeometry } from '#src/types'

export const toSnap = (position: number): number =>
  -position || INITIAL_TRANSFORM

export const toLoopSnaps = ({ snaps, loopSize }: SlidesGeometry): number[] => [
  ...snaps,
  -loopSize
]
