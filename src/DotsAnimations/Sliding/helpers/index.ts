import { CSSProperties, MutableRefObject } from 'react'
import { ACTIVE_DOT_SCALE, IDLE_DOT_SCALE } from '../constants'
import { DotsLeftOffsetsTypes } from '../types'

export const getWidthDifference = (
  dotWidth: number,
  activeDotWidth: number
): number => (dotWidth - activeDotWidth) / 2

export const getDotsLeftOffsets = (
  dotsRef: MutableRefObject<(HTMLButtonElement | null)[]>
): DotsLeftOffsetsTypes[] =>
  dotsRef.current?.map((dot) => ({
    left: dot?.offsetLeft ?? 0
  }))

export const getDotStyles = (
  animationSpeed: number
): [CSSProperties, CSSProperties] => {
  const transition = `${animationSpeed}ms`

  return [
    { transition, transform: ACTIVE_DOT_SCALE },
    { transition, transform: IDLE_DOT_SCALE }
  ]
}
