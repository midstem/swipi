import { ONE_STEP } from '../../../constants'
import { NO_OFFSET } from './constants'

export const getGap = (positions: number[], sizes: number[]): number =>
  positions.length > ONE_STEP
    ? Math.max(positions[ONE_STEP] - (positions[0] + sizes[0]), NO_OFFSET)
    : NO_OFFSET
