import { MutableRefObject, RefObject } from 'react'

export type DotsLeftOffsetsTypes = { left: number }

export type UseSlidingProps = {
  slideIndex: number
  countShowDots: number
}

export type UseSlidingReturn = {
  dotsRef: MutableRefObject<(HTMLButtonElement | null)[]>
  activeDotRef: RefObject<HTMLDivElement | null>
  activeDotLeft: number
}
