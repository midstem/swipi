import type { JSX, ReactNode } from 'react'

export type DotsProps = {
  isLoop: boolean
  dotColor?: string
  slideIndex: number
  slidesCount: number
  activeDotColor?: string
  customDot?: JSX.Element
  customActiveDot?: JSX.Element
  visibleCountSlides: number
}

export type UseDotsReturn = {
  returnDots: (index: number) => ReactNode
  countShowDots: number
}
