import { INITIAL_TRANSFORM } from '#src/constants'

export const toSnap = (position: number): number =>
  -position || INITIAL_TRANSFORM
