import { INITIAL_TRANSFORM } from '../../../constants'

export const toSnap = (position: number): number =>
  -position || INITIAL_TRANSFORM
