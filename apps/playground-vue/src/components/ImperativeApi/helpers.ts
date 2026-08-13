// @ts-nocheck
import { FIRST_INDEX, LAST_INDEX_OFFSET } from '../../constants'

export const getLastIndex = (slidesCount: number): number =>
  Math.max(slidesCount - LAST_INDEX_OFFSET, FIRST_INDEX)

export const clampIndex = (index: number, slidesCount: number): number => {
  if (Number.isNaN(index)) return FIRST_INDEX

  return Math.min(Math.max(index, FIRST_INDEX), getLastIndex(slidesCount))
}
