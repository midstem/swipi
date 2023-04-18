import { MutableRefObject } from 'react'
import { DotsLeftOffsetsTypes } from './types'

export const getWidthDifference = (
  dotWidth: number,
  activeDotWidth: number
): number => (dotWidth - activeDotWidth) / 2

export const getDotsLeftOffsets = (
  dotsRef: MutableRefObject<(HTMLDivElement | null)[]>
): DotsLeftOffsetsTypes[] =>
  dotsRef.current?.map((dot) => ({
    left: dot?.offsetLeft ?? 0
  }))
